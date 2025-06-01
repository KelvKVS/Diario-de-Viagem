// src/components/Modal.jsx (ou src/assets/components/Modal.jsx)
import React from 'react';
import ReactDOM from 'react-dom'; // Para criar um portal
import '../assets/style/modal.css';

const Modal = ({ show, onClose, title, children, footer }) => {
  if (!show) {
    return null; // Não renderiza nada se 'show' for false
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}> {/* Impede que o clique no conteúdo feche o modal */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children} {/* Conteúdo dinâmico do modal */}
        </div>
        {footer && ( // Renderiza o rodapé apenas se for fornecido
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body // Anexa o modal diretamente ao body do documento
  );
};

export default Modal;