import React from 'react';
import {Modal, Row, Image, InputGroup, FormControl} from 'react-bootstrap'
import {Moeda} from '../../controllers/Tools'
import ButtonCustom from '../../components/ButtonCustom'
import InputNumber from '../../components/InputNumber'
import './style.css';

export default function ModalDetailProduto({
	show, 
	onHide, 
	onChangeTextArea, 
	nome, 
	descricao, 
	valorUnitario, 
	onClickDecrement, 
	onClickIncrement,
	onClickAdicionar,
	onChangeInputQnt,
	btnAddValue, 
	quantidade,
	dir_img,
	fracionado = false
	}) {
	//const api_andress = "api."+window.location.origin.split("//")[1]
	const api_andress = "api.luccasalmeida.com"
    return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton/>
			<Modal.Body>
				<Row className="container-img-detail-produto-component">
					<Image
						className="img-fundo-produto-compnt"
						src={
                            dir_img === null 
                            ? window.location.origin+"/img/img_indisponivel.png" 
                            : "https://"+api_andress+"/public/img/"+dir_img
                        }
						style={{
							position:"relative",
							top:0,
							left:0,
							width:'100%',
							height:200
						}}
					/>
					<Image 
						style={{
							position:"absolute",
							top:40,							
						}}
						src={
							dir_img === null 
							? window.location.origin+"/img/img_indisponivel.png" 
							: "https://"+api_andress+"/public/img/"+dir_img
						} 
						roundedCircle 
						className="img-detail-produto-component" 
						alt='Imagem do Produto' 
					/>
				</Row>
				<Row className="titulo-detail-produto-component">
					<p><strong>{nome}</strong></p>
				</Row>
				<Row className="descricao-detail-produto-component">
					<p>{descricao}</p>
				</Row>
				<Row className="valor-unitario-detail-produto-component">
					<p><strong>{Moeda(valorUnitario)}</strong></p>
				</Row>
				<Row className="container-observacoes-detail-produto">
					<p><strong>Deseja acrescentar observações?</strong></p>
					<InputGroup>
						<FormControl 
							onChange={onChangeTextArea} 
							as="textarea" 
							aria-label="With textarea" 
							maxLength={120} 
							height={70} 
							className="input-descricao-detail-produto"
						/>
					</InputGroup>
				</Row>
				<InputNumber 
					handleIncrement={onClickIncrement}
					handleDecrement={onClickDecrement}
					quantidade={quantidade}
					fracionado={fracionado}
					onChangeInputQnt={onChangeInputQnt} 
				/>
			</Modal.Body>
			<Modal.Footer className="footer-modal-detail-produto">
			<ButtonCustom 
				variant="info" 
				onClick={onClickAdicionar} 
				title={"Adicionar "+Moeda(btnAddValue)} 
			/>
			</Modal.Footer>
		</Modal>    
    );
}