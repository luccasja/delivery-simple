import React from 'react';
import {Modal, Image} from 'react-bootstrap'
import ButtonCustom from '../../components/ButtonCustom'
import './style.css';

export default function ModalConnection({show, onHide}) {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
            <Modal.Title>Ops...</Modal.Title>
            </Modal.Header>
                <Modal.Body className="body-modal-connection">
                    <Image 
                        roundedCircle="true" 
                        src={window.location.origin+'/img/connection.jpg'} 
                        className="img-modal-connection" 
                        alt='connection' 
                    />
                    <p>
                        <strong>
                            Ocorreu um problema na conexão com a internet!
                        </strong>
                    </p>
                </Modal.Body>
            <Modal.Footer className="footer-modal-connection">
                <ButtonCustom 
                    variant="info" 
                    onClick={()=>window.location.reload(false)} 
                    title="Atualizar Página"
                />
            </Modal.Footer>
        </Modal>
    );
}