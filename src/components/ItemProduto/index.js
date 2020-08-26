import React, {useEffect} from 'react';
import {Row, Col, Image} from 'react-bootstrap'
import {Moeda} from '../../controllers/Tools'
import './style.css';

export default function ItemProduto({nome, descricao, valorUnitario, onClick, dir_img}) {
    //const api_andress = "api."+window.location.origin.split("//")[1]
    const api_andress = "api.luccasalmeida.com"
    useEffect(()=>{
        console.log(api_andress)
    },[])

    return (
    <>
        <li 
            className="item-prod-component">
            <Row 
                onClick={onClick} 
                className="container-item-prod-component">
                <Col 
                    xs='2' 
                    my-auto="true">
                    <Image 
                        src={
                            dir_img === null 
                            ? window.location.origin+"/img/img_indisponivel.png" 
                            : "https://"+api_andress+"/public/img/"+dir_img
                        }  
                        roundedCircle 
                        className="img-item-prod-component" 
                        alt='imagem do produto' 
                    />
                </Col>
                <Col 
                    xs='6' 
                    my-auto="true" 
                    className="descricao-item-prod-component">
                    <p><strong>{nome}</strong></p>
                    <p style={{fontSize:13}}>{descricao}</p>
                </Col>
                <Col 
                    xs='3' 
                    my-auto="true" 
                    className="vl-unitario-item-prod-component">
                    <p style={{fontSize:20}}><strong>{Moeda(valorUnitario)}</strong></p>
                </Col>
                <Col 
                    xs='1' 
                    my-auto="true" 
                    className="container-add-item-prod-component">
                    <Image 
                        src={window.location.origin+"/img/add.png"} 
                        roundedCircle 
                        className="img-add-item-prod-component" 
                        alt='Adicionar' 
                    />
                </Col>
            </Row>
        </li>
    </>
    )
}