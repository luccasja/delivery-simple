import React from 'react';
import {Row, Col, Image} from 'react-bootstrap'
import './style.css';

export default function HeaderCustom({titulo, subtitulo, srcLogo}) {

	return (
		<>
		<Row>
			<Col xs='2' >
			<Image 
				src={srcLogo}
				roundedCircle
				className="img-header-custom-component" 
				alt='logo' 
			/>
			</Col>
			<Col xs='8'>
			<p><strong>{titulo}</strong></p>
			<p>{subtitulo}</p>
			</Col>
			<Col xs='2'></Col>
		</Row>
		<Row>
			<Col className="separator-header-custom-component"/>
		</Row>
		</>
	)
}