import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";

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
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(10, 10, 12, 0.55);
  backdrop-filter: blur(6px);
  animation: ${fadeIn} 0.2s ease;
`;

const Panel = styled.div`
  position: relative;
  display: flex;
  max-width: min(960px, 90vw);
  max-height: 85vh;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;

  animation: ${scaleIn} 0.25s ease;

  @media (max-width: 720px) {
    flex-direction: column;
    max-height: 90vh;
    overflow-y: auto;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  line-height: 1;
  color: #16171d;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  &:hover {
    background: #fff;
  }
`;

const Modal = ({ open, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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
    document.body,
  );
};

export default Modal;
