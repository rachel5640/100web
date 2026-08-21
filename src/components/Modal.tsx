import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';

const Modal = ({ open, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <Overlay onClick={onClose}>
      <Panel onClick={(event) => event.stopPropagation()}>
        <CloseButton type="button" onClick={onClose} aria-label="닫기">
          ×
        </CloseButton>
        {children}
      </Panel>
    </Overlay>,
    document.body
  );
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: translateY(1.6rem) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.4rem;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(0.6rem);
  animation: ${fadeIn} 0.2s ease;

  @media (max-width: 720px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const Panel = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'images header'
    'images details';
  width: 80vw;
  /* an explicit (not just max-) height is required for the columns'
     overflow-y to actually kick in instead of the panel just growing */
  height: 90vh;
  max-height: 90vh;
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;

  animation: ${scaleIn} 0.25s ease;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      'header'
      'images'
      'details';
    width: 100%;
    height: 100dvh;
    max-height: 100dvh;
    overflow-y: auto;
    animation: ${slideUp} 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  width: 4rem;
  height: 4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.white};

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

export default Modal;
