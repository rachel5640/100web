import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { css, keyframes } from 'styled-components';

import { type Work, works } from '../data/works';
import Modal from './Modal';
import WorkDetail from './WorkDetail';
import WorkListPanel from './WorkListPanel';

const CARD_HEIGHT_VH = 0.3;
const CARD_ASPECT = 900 / 1200; // width : height, matches the source images
const GUTTER_X_RATIO = 100 / 320;
const GUTTER_Y_RATIO = 120 / 320;
const JITTER_RATIO = 70 / 320;
const BUFFER = 2;
const CLICK_THRESHOLD = 6;

interface CardMetrics {
  cardWidth: number;
  cardHeight: number;
  cellWidth: number;
  cellHeight: number;
  jitter: number;
}

function computeCardMetrics(viewportHeight: number): CardMetrics {
  const cardHeight = viewportHeight * CARD_HEIGHT_VH;
  const cardWidth = cardHeight * CARD_ASPECT;
  return {
    cardWidth,
    cardHeight,
    cellWidth: cardWidth + cardHeight * GUTTER_X_RATIO,
    cellHeight: cardHeight + cardHeight * GUTTER_Y_RATIO,
    jitter: cardHeight * JITTER_RATIO,
  };
}

// momentum glide after releasing a drag
const VELOCITY_SAMPLE_WINDOW = 120; // ms of recent pointer history used to estimate fling speed
const MOMENTUM_MAX_SPEED = 3.2; // px/ms clamp so a hard flick doesn't send it flying
const MOMENTUM_FRICTION = 0.0035; // higher = stops sooner
const MOMENTUM_STOP_SPEED = 0.03; // px/ms below which the glide is considered settled

// deterministic pseudo-random value in [0, 1) for a given grid cell + salt
function hash(x: number, y: number, salt: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(salt, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// find (a, b), both coprime with n, whose linear grid index a*col + b*row (mod n)
// keeps identical values as far apart as possible — this is what keeps the same
// work from showing up twice within one screenful of tiles
function findSpreadCoprimePair(n: number, searchRadius = 8) {
  if (n < 2) return { a: 1, b: 1 };

  let best = { a: 1, b: 1, distance: -1 };
  for (let a = 2; a < n; a += 1) {
    if (gcd(a, n) !== 1) continue;
    for (let b = 2; b < n; b += 1) {
      if (a === b || gcd(b, n) !== 1) continue;

      let minDistance = Infinity;
      for (let dc = -searchRadius; dc <= searchRadius; dc += 1) {
        for (let dr = -searchRadius; dr <= searchRadius; dr += 1) {
          if (dc === 0 && dr === 0) continue;
          if ((((a * dc + b * dr) % n) + n) % n === 0) {
            minDistance = Math.min(minDistance, Math.max(Math.abs(dc), Math.abs(dr)));
          }
        }
      }
      if (minDistance > best.distance) {
        best = { a, b, distance: minDistance };
      }
    }
  }
  return { a: best.a, b: best.b };
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function computeGridBounds(
  offsetX: number,
  offsetY: number,
  width: number,
  height: number,
  cellWidth: number,
  cellHeight: number
) {
  return {
    colStart: Math.floor(-offsetX / cellWidth) - BUFFER,
    colEnd: Math.ceil((-offsetX + width) / cellWidth) + BUFFER,
    rowStart: Math.floor(-offsetY / cellHeight) - BUFFER,
    rowEnd: Math.ceil((-offsetY + height) / cellHeight) + BUFFER,
  };
}

interface Tile {
  key: string;
  left: number;
  top: number;
  work: Work;
  delay: number;
  rotate: number;
}

const Viewport = styled.div<{ $dragging: boolean }>`
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.white};
  cursor: ${({ $dragging }) => ($dragging ? 'grabbing' : 'grab')};
  touch-action: none;
`;

const World = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  will-change: transform;
`;

const KeywordBackdrop = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};

  transition: opacity 0.3s ease;
`;

const KeywordText = styled.span`
  font-size: clamp(4rem, 12vw, 16rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.grey};
  ${({ theme }) => theme.fonts.Title01};
  font-size: 15rem;

  @media (max-width: 720px) {
    font-size: 8rem;
  }
`;

const shuffleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.4) rotate(var(--shuffle-rotate, 0deg));
  }
  60% {
    opacity: 1;
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
`;

const Card = styled.button<{ $left: number; $top: number; $shuffleIn?: boolean }>`
  position: absolute;
  left: ${({ $left }) => $left}px;
  top: ${({ $top }) => $top}px;
  width: var(--card-width);
  height: var(--card-height);
  padding: 0;
  cursor: inherit;
  ${({ $shuffleIn }) =>
    $shuffleIn &&
    css`
      animation: ${shuffleIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
      animation-delay: var(--shuffle-delay, 0s);
    `}
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  user-select: none;
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
  const [cardMetrics, setCardMetrics] = useState(() => computeCardMetrics(window.innerHeight));
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [hoveredWork, setHoveredWork] = useState<Work | null>(null);

  // shuffled once per page load: which work sits in which grid slot, spaced
  // out via a Latin-square index so the same work can't land twice on one
  // screen, plus a random jitter seed so the scatter itself differs too
  const [layout] = useState(() => {
    const { a, b } = findSpreadCoprimePair(works.length);
    const initialMetrics = computeCardMetrics(window.innerHeight);
    const bounds = computeGridBounds(
      0,
      0,
      window.innerWidth,
      window.innerHeight,
      initialMetrics.cellWidth,
      initialMetrics.cellHeight
    );
    const initialKeys = new Set<string>();
    for (let row = bounds.rowStart; row <= bounds.rowEnd; row += 1) {
      for (let col = bounds.colStart; col <= bounds.colEnd; col += 1) {
        initialKeys.add(`${col}_${row}`);
      }
    }
    return {
      order: shuffle(works),
      a,
      b,
      jitterSeed: Math.floor(Math.random() * 100000),
      initialKeys,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
      setCardMetrics(computeCardMetrics(window.innerHeight));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    if (!movedRef.current && (Math.abs(dx) > CLICK_THRESHOLD || Math.abs(dy) > CLICK_THRESHOLD)) {
      // only capture once an actual drag starts — capturing on pointerdown
      // would redirect the click event away from the tapped card and the
      // modal would never open
      movedRef.current = true;
      viewportRef.current?.setPointerCapture(drag.pointerId);
    }

    const now = performance.now();
    historyRef.current.push({ x: event.clientX, y: event.clientY, t: now });
    historyRef.current = historyRef.current.filter((sample) => now - sample.t <= VELOCITY_SAMPLE_WINDOW);

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
    const { cellWidth, cellHeight, cardWidth, cardHeight, jitter } = cardMetrics;
    const { colStart, colEnd, rowStart, rowEnd } = computeGridBounds(
      offset.x,
      offset.y,
      viewportSize.width,
      viewportSize.height,
      cellWidth,
      cellHeight
    );

    const n = layout.order.length;
    const result: Tile[] = [];
    for (let row = rowStart; row <= rowEnd; row += 1) {
      for (let col = colStart; col <= colEnd; col += 1) {
        const workIndex = (((layout.a * col + layout.b * row) % n) + n) % n;
        const jitterX = (hash(col, row, layout.jitterSeed + 2) - 0.5) * jitter;
        const jitterY = (hash(col, row, layout.jitterSeed + 3) - 0.5) * jitter;
        const delay = hash(col, row, layout.jitterSeed + 4) * 0.4;
        const rotate = (hash(col, row, layout.jitterSeed + 5) - 0.5) * 24;

        result.push({
          key: `${col}_${row}`,
          left: col * cellWidth + (cellWidth - cardWidth) / 2 + jitterX,
          top: row * cellHeight + (cellHeight - cardHeight) / 2 + jitterY,
          work: layout.order[workIndex],
          delay,
          rotate,
        });
      }
    }
    return result;
  }, [offset, viewportSize, layout, cardMetrics]);

  const handleCardClick = (work: Work) => {
    if (movedRef.current) return;
    setSelectedWork(work);
  };

  return (
    <>
      <Viewport
        ref={viewportRef}
        $dragging={isDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}>
        <KeywordBackdrop $visible={hoveredWork !== null}>
          <KeywordText>{hoveredWork?.keyword}</KeywordText>
        </KeywordBackdrop>
        <World
          ref={worldRef}
          style={
            {
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
              '--card-width': `${cardMetrics.cardWidth}px`,
              '--card-height': `${cardMetrics.cardHeight}px`,
            } as CSSProperties
          }>
          {tiles.map((tile) => {
            const isInitial = layout.initialKeys.has(tile.key);
            const style = isInitial
              ? ({
                  '--shuffle-delay': `${tile.delay}s`,
                  '--shuffle-rotate': `${tile.rotate}deg`,
                } as CSSProperties)
              : undefined;

            return (
              <Card
                key={tile.key}
                type="button"
                $left={tile.left}
                $top={tile.top}
                $shuffleIn={isInitial}
                style={style}
                onClick={() => handleCardClick(tile.work)}
                onMouseEnter={() => setHoveredWork(tile.work)}
                onMouseLeave={() => setHoveredWork(null)}>
                <CardImage src={tile.work.thumbnail} alt={tile.work.title} draggable={false} loading="lazy" />
              </Card>
            );
          })}
        </World>
      </Viewport>

      <WorkListPanel onSelect={setSelectedWork} />

      <Modal open={selectedWork !== null} onClose={() => setSelectedWork(null)}>
        {selectedWork && <WorkDetail work={selectedWork} />}
      </Modal>
    </>
  );
};

export default InfiniteGallery;
