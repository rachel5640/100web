import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import styled from "styled-components";

import { galleryImages, type GalleryImage } from "../data/galleryImages";
import Modal from "./Modal";

const CELL_WIDTH = 340;
const CELL_HEIGHT = 440;
const CARD_WIDTH = 240;
const CARD_HEIGHT = 320; // matches the 900x1200 (3:4) source aspect ratio
const JITTER = 70;
const BUFFER = 2;
const CLICK_THRESHOLD = 6;

// momentum glide after releasing a drag
const VELOCITY_SAMPLE_WINDOW = 120; // ms of recent pointer history used to estimate fling speed
const MOMENTUM_MAX_SPEED = 3.2; // px/ms clamp so a hard flick doesn't send it flying
const MOMENTUM_FRICTION = 0.0035; // higher = stops sooner
const MOMENTUM_STOP_SPEED = 0.03; // px/ms below which the glide is considered settled

// deterministic pseudo-random value in [0, 1) for a given grid cell + salt
function hash(x: number, y: number, salt: number) {
  let h =
    Math.imul(x, 374761393) ^
    Math.imul(y, 668265263) ^
    Math.imul(salt, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

interface Tile {
  key: string;
  left: number;
  top: number;
  image: GalleryImage;
}

const Viewport = styled.div<{ $dragging: boolean }>`
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors};
  cursor: ${({ $dragging }) => ($dragging ? "grabbing" : "grab")};
  touch-action: none;
`;

const World = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
`;

const Card = styled.button<{ $left: number; $top: number }>`
  position: absolute;
  left: ${({ $left }) => $left}px;
  top: ${({ $top }) => $top}px;
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  padding: 0;
  cursor: inherit;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  user-select: none;
`;

const ModalImage = styled.img`
  width: 340px;
  max-width: 40vw;
  height: 100%;
  min-height: 320px;
  object-fit: cover;
  display: block;

  @media (max-width: 720px) {
    width: 100%;
    max-width: 100%;
    min-height: 240px;
  }
`;

const ModalInfo = styled.div`
  padding: 40px;
  overflow-y: auto;
  text-align: left;

  h2 {
    margin: 0 0 8px;
  }

  p {
    margin: 0 0 12px;
    color: var(--text);
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
}

interface PointerSample {
  x: number;
  y: number;
  t: number;
}

const InfiniteGallery = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<DragState | null>(null);
  const movedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const historyRef = useRef<PointerSample[]>([]);
  const velocityRef = useRef({ x: 0, y: 0 });
  const inertiaRafRef = useRef<number | null>(null);
  const inertiaLastTimeRef = useRef(0);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const handleResize = () =>
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (inertiaRafRef.current != null) cancelAnimationFrame(inertiaRafRef.current);
    };
  }, []);

  const applyTransform = useCallback((x: number, y: number) => {
    if (worldRef.current) {
      worldRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }, []);

  const scheduleOffsetSync = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setOffset({ ...offsetRef.current });
    });
  }, []);

  const stopInertia = () => {
    if (inertiaRafRef.current != null) {
      cancelAnimationFrame(inertiaRafRef.current);
      inertiaRafRef.current = null;
    }
  };

  const runInertiaFrame = (time: number) => {
    const dt = inertiaLastTimeRef.current ? time - inertiaLastTimeRef.current : 16;
    inertiaLastTimeRef.current = time;

    const decay = Math.exp(-MOMENTUM_FRICTION * dt);
    const vx = velocityRef.current.x * decay;
    const vy = velocityRef.current.y * decay;
    velocityRef.current = { x: vx, y: vy };

    if (Math.hypot(vx, vy) < MOMENTUM_STOP_SPEED) {
      inertiaRafRef.current = null;
      return;
    }

    const nextX = offsetRef.current.x + vx * dt;
    const nextY = offsetRef.current.y + vy * dt;
    offsetRef.current = { x: nextX, y: nextY };
    applyTransform(nextX, nextY);
    setOffset({ x: nextX, y: nextY });
    inertiaRafRef.current = requestAnimationFrame(runInertiaFrame);
  };

  const startInertia = () => {
    const now = performance.now();
    const samples = historyRef.current.filter((sample) => now - sample.t <= VELOCITY_SAMPLE_WINDOW);
    const first = samples[0];
    const last = samples[samples.length - 1];

    if (!first || !last || last.t === first.t) return;

    const dt = last.t - first.t;
    let vx = (last.x - first.x) / dt;
    let vy = (last.y - first.y) / dt;

    const speed = Math.hypot(vx, vy);
    if (speed > MOMENTUM_MAX_SPEED) {
      const scale = MOMENTUM_MAX_SPEED / speed;
      vx *= scale;
      vy *= scale;
    }
    if (Math.hypot(vx, vy) < MOMENTUM_STOP_SPEED) return;

    velocityRef.current = { x: vx, y: vy };
    inertiaLastTimeRef.current = 0;
    inertiaRafRef.current = requestAnimationFrame(runInertiaFrame);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    stopInertia();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offsetRef.current.x,
      originY: offsetRef.current.y,
    };
    movedRef.current = false;
    historyRef.current = [{ x: event.clientX, y: event.clientY, t: performance.now() }];
    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (
      !movedRef.current &&
      (Math.abs(dx) > CLICK_THRESHOLD || Math.abs(dy) > CLICK_THRESHOLD)
    ) {
      // only capture once an actual drag starts — capturing on pointerdown
      // would redirect the click event away from the tapped card and the
      // modal would never open
      movedRef.current = true;
      viewportRef.current?.setPointerCapture(drag.pointerId);
    }

    const now = performance.now();
    historyRef.current.push({ x: event.clientX, y: event.clientY, t: now });
    historyRef.current = historyRef.current.filter(
      (sample) => now - sample.t <= VELOCITY_SAMPLE_WINDOW,
    );

    const nextX = drag.originX + dx;
    const nextY = drag.originY + dy;
    offsetRef.current = { x: nextX, y: nextY };
    applyTransform(nextX, nextY);
    scheduleOffsetSync();
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    if (movedRef.current) {
      viewportRef.current?.releasePointerCapture(event.pointerId);
      startInertia();
    }
    dragRef.current = null;
    setIsDragging(false);
    setOffset({ ...offsetRef.current });
  };

  const tiles = useMemo<Tile[]>(() => {
    const colStart = Math.floor(-offset.x / CELL_WIDTH) - BUFFER;
    const colEnd =
      Math.ceil((-offset.x + viewportSize.width) / CELL_WIDTH) + BUFFER;
    const rowStart = Math.floor(-offset.y / CELL_HEIGHT) - BUFFER;
    const rowEnd =
      Math.ceil((-offset.y + viewportSize.height) / CELL_HEIGHT) + BUFFER;

    const result: Tile[] = [];
    for (let row = rowStart; row <= rowEnd; row += 1) {
      for (let col = colStart; col <= colEnd; col += 1) {
        const imageIndex = Math.floor(hash(col, row, 1) * galleryImages.length);
        const jitterX = (hash(col, row, 2) - 0.5) * JITTER;
        const jitterY = (hash(col, row, 3) - 0.5) * JITTER;

        result.push({
          key: `${col}_${row}`,
          left: col * CELL_WIDTH + (CELL_WIDTH - CARD_WIDTH) / 2 + jitterX,
          top: row * CELL_HEIGHT + (CELL_HEIGHT - CARD_HEIGHT) / 2 + jitterY,
          image: galleryImages[imageIndex],
        });
      }
    }
    return result;
  }, [offset, viewportSize]);

  const handleCardClick = (image: GalleryImage) => {
    if (movedRef.current) return;
    setSelectedImage(image);
  };

  return (
    <>
      <Viewport
        ref={viewportRef}
        $dragging={isDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <World
          ref={worldRef}
          style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
        >
          {tiles.map((tile) => (
            <Card
              key={tile.key}
              type="button"
              $left={tile.left}
              $top={tile.top}
              onClick={() => handleCardClick(tile.image)}
            >
              <CardImage
                src={tile.image.src}
                alt={tile.image.title}
                draggable={false}
                loading="lazy"
              />
            </Card>
          ))}
        </World>
      </Viewport>

      <Modal
        open={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
      >
        {selectedImage && (
          <>
            <ModalImage src={selectedImage.src} alt={selectedImage.title} />
            <ModalInfo>
              <h2>{selectedImage.title}</h2>
              <p>
                {selectedImage.category} · {selectedImage.year}
              </p>
              <p>{selectedImage.description}</p>
            </ModalInfo>
          </>
        )}
      </Modal>
    </>
  );
};

export default InfiniteGallery;
