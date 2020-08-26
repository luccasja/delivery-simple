import React from 'react';
import {Button, Row, Col} from 'react-bootstrap'
import './style.css';

export default function InputNumber({
    handleDecrement, 
    handleIncrement, 
    quantidade = 1,
    fracionado = false,
    onChangeInputQnt
}) {
    return (
        <Row className="container-input-number">
            <Col xs='2'/>
                <Col xs='2' className="col-input-number-component">
                    <Button variant="light" onClick={handleDecrement} className="btn-decrement-input-number">
                        -
                    </Button>
                </Col>
                <Col xs='4' className="col-input-number-component">
                    {fracionado 
                    ?<input
                        className="qnt-input-number-component"
                        style={{width:"100%", padding:"2.3%", borderRadius:0}}
                        value={quantidade}
                        onChange={onChangeInputQnt}
                        type="number"
                    />
                    : <p className="qnt-input-number-component">
                        {quantidade}
                    </p>
                    }
                </Col>
                <Col xs='2' className="col-input-number-component">
                    <Button variant="danger" onClick={handleIncrement} className="btn-increment-input-number">
                        +
                    </Button>
                </Col>
            <Col xs='2'/>
        </Row>
    )
}