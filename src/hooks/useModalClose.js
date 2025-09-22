import { useEffect } from "react";

export function useModalClose(isOpen, modalRef, handleClose) {
  useEffect(() => {
    if (!isOpen) return;

    function handleOverlayClose(event) {
      const isEscape = event.type === "keydown" && event.key === "Escape";
      const isOutsideClick =
        event.type === "mousedown" &&
        modalRef.current &&
        !modalRef.current.contains(event.target);

      if (isEscape || isOutsideClick) {
        handleClose();
      }
    }

    document.addEventListener("keydown", handleOverlayClose);
    document.addEventListener("mousedown", handleOverlayClose);

    return () => {
      document.removeEventListener("keydown", handleOverlayClose);
      document.removeEventListener("mousedown", handleOverlayClose);
    };
  }, [isOpen, handleClose, modalRef]);
}
