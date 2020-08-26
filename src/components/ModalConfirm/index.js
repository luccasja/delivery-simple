import React from 'react';
import {Modal, Button} from 'react-bootstrap'
import './style.css';

export default function ModalConfirm({
        show, 
        onHide, 
        titulo, 
        texto, 
        onClickNegacao, 
        onClickConfirmacao
    }) {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {titulo}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="body-modal-confirm-cmp">
                {texto}
            </Modal.Body>
            <Modal.Footer className="footer-modal-confirm-cmp">
                <Button 
                    variant="info" 
                    className="btn-negacao-modal-confirm" 
                    onClick={onClickNegacao}>
                    Não
                </Button>
                <Button 
                    className="btn-confirmacao-modal-confirm" 
                    onClick={onClickConfirmacao}>
                    Sim
                </Button>
            </Modal.Footer>
        </Modal>
    );
}