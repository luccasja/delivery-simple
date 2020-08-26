import React from 'react';
import {Row, Col, Image, OverlayTrigger, Tooltip, Button} from 'react-bootstrap'
import {Switch} from '../index'
import './style.css';

function ItemConfig({
    titulo, 
    info, 
    input = false,
    valueInput,
    onChangeInput, 
    btnSwitch = false, 
    idSwitch, 
    onClickSwitch,
    onClickBtn, 
    valueSwitch,
    disabled,
    btnRef
}) {
    return (
        <Row style={{margin:0, padding:10, width:'100%', borderBottomStyle:'solid', borderBottomWidth:1, borderBottomColor:'#e3e3e3'}}>
            <Col md={btnSwitch ? 12 : 10} style={{margin:0, padding:0}}>
                <Row style={{margin:0, marginTop:5, padding:0}}>
                    <Col xs="7" style={{margin:0, padding:0, display:'flex', alignItems:'center'}}>
                        <p>{titulo}</p>
                    </Col>
                    <Col xs="1" style={{margin:0, padding:0, display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <OverlayTrigger
                            placement={'bottom'}
                            overlay={
                                <Tooltip id={`tooltip-bottom`}>
                                    {info}
                                </Tooltip>
                            }
                            >
                            <Image 
                                src={window.location.origin+"/img/questions.png"}
                                style={{height:25, width:25, objectFit: "cover"}}
                            />
                        </OverlayTrigger>
                    </Col>
                    <Col xs="4" style={{margin:0, padding:0, display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
                        {btnSwitch && 
                        <Switch
                            id={idSwitch} 
                            btnSize={26} 
                            lableHeight={30} 
                            offColor='#EF476F' 
                            isOn={valueSwitch}
                            disabled={disabled}
                            handleToggle={onClickSwitch}
                        />}
                        {input && 
                        <input
                            type="number" 
                            min="0" 
                            max="9999"
                            disabled={disabled}
                            value={valueInput}
                            onChange={onChangeInput}
                            style={{width:100, textAlign:"right", marginBottom:0}}
                        />}
                    </Col>
                </Row>
            </Col>
            {input && 
            <Col md="2" style={{margin:0, padding:0, display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
                <Row style={{margin:0, marginTop:5, padding:0}}>
                    <Button ref={btnRef} onClick={onClickBtn} variant="info">Editar</Button>   
                </Row>
            </Col>}
        </Row>
    );
}

export default ItemConfig;