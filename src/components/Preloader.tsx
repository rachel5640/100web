import { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

interface PreloaderProps {
  onDone?: () => void;
}

const COUNT_DURATION = 1600; // ms
const EXIT_DURATION = 700; // ms

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

const Preloader = ({ onDone }: PreloaderProps) => {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<'counting' | 'exiting' | 'done'>('counting');

  useEffect(() => {
    if (phase !== 'counting') return;

    let rafId: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / COUNT_DURATION, 1);
      setCount(Math.round(easeOutExpo(progress) * 100));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setPhase('exiting');
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    const timeout = setTimeout(() => setPhase('done'), EXIT_DURATION);
    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase === 'done') onDone?.();
  }, [phase, onDone]);

  if (phase === 'done') return null;

  return (
    <Overlay $exiting={phase === 'exiting'}>
      <Count>{count}%</Count>
    </Overlay>
  );
};

const revealExit = keyframes`
  to {
    opacity: 0;
    transform: scale(1.08);
  }
`;

const Overlay = styled.div<{ $exiting: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.preloaderBg};
  pointer-events: ${({ $exiting }) => ($exiting ? 'none' : 'auto')};
  ${({ $exiting }) =>
    $exiting &&
    css`
      animation: ${revealExit} ${EXIT_DURATION}ms cubic-bezier(0.6, 0, 0.2, 1) forwards;
    `}
`;

const Count = styled.span`
  ${({ theme }) => theme.fonts.Text01};
  font-size: clamp(5.6rem, 12vw, 16rem);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  min-width: 4ch;
  text-align: center;
`;

export default Preloader;
