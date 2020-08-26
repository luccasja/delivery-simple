import React, {useState, useEffect} from 'react';
import {Row, Col, Image, Button} from 'react-bootstrap'
import {LimitarString, Moeda} from '../../controllers/Tools'
import Config from '../../config/global'
import './style.css';

export default function ItemPedido({
        indice,
        nome,
        descricao,
        quantidade,
        valorUnitario,
        observacoes,
        nomeProdutoRefs,
        inputRefs,
        totalItemRefs,
        dir_img,
        onClickDecrement,
        onClickIncrement,
        onClickExcluir
    }) {
    return (
        <li className="item-pedido-component">
            <Row className="container-item-pedido-component">
                <Col xs='2' my-auto="true">
                    <Image 
                        src={
                            dir_img === null 
                            ? window.location.origin+"/img/img_indisponivel.png" 
                            : Config.repositorioImg+dir_img
                        } 
                        my-auto="true" 
                        roundedCircle 
                        className="img-item-pedido-component" 
                        alt='imagem do produto' 
                    />
                </Col>
                <Col 
                    xs='5' 
                    my-auto="true" 
                    className="container-descricao-item-pedido">
                    <p>
                        <strong ref={ref =>{nomeProdutoRefs[indice] = ref}}>
                            {nome}
                        </strong>
                    </p>
                    <p className="txt-descricao-item-ped">
                        {descricao}
                    </p>
                    <p>
                        <strong>
                            {Moeda(valorUnitario)}
                        </strong>
                    </p>
                    {
                        observacoes !== '' 
                        ? <p className="txt-descricao-item-ped">
                            <strong>Observações: </strong>
                            {LimitarString(observacoes, 30)}
                          </p>
                        : <p/>
                    }
                </Col>
                <Col xs='5' my-auto="true">
                    <Row>
                        <Col xs='4' className="col-btn-count-item-ped">
                            <Button 
                                onClick={onClickDecrement} 
                                className="btn-decrement-item-ped">
                                -
                            </Button>
                        </Col>
                        <Col xs='4' className="col-btn-count-item-ped">
                            <p 
                                ref={inputRef => {inputRefs[indice] = inputRef}} 
                                className="input-qnt-item-pedido">
                                {quantidade}
                            </p>
                        </Col>
                        <Col xs='4' className="col-btn-count-item-ped">
                            <Button 
                                onClick={onClickIncrement} 
                                className="btn-increment-item-ped">
                                +
                            </Button>
                        </Col>
                    </Row>
                    <Row className="container-total-item-ped">
                        <Col>
                            <p> 
                                T: <strong ref={totalItemRef => {totalItemRefs[indice] = totalItemRef}}>
                                    {Moeda(quantidade*valorUnitario)}
                                </strong>
                            </p>
                        </Col>
                    </Row>
                    <Row style={{display:"flex", justifyContent:"center"}}>
                        <Image
                            onClick={onClickExcluir}
                            style={{cursor:"pointer", height:40, width:40, objectFit:"cover"}}
                            src={window.location.origin+"/img/delete.png"}
                        />
                    </Row>
                </Col>
            </Row>
        </li>
    );
}