import React from 'react';
import {Button} from 'react-bootstrap'
import './style.css';

export default function ButtonCustom({
        onClick, 
        hidden, 
        title, 
        variant = "light", 
        width = '100%', 
        height = 45,
        fontSize,
        disabled
    }) {

    return (
        <Button
            disabled={disabled}
            variant={variant} 
            hidden={hidden}
            style={{width, height, margin:5, fontSize}} 
            className="btn-custom-component" 
            onClick={onClick}>
            {title}
        </Button>
    )
}