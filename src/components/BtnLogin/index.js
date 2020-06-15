import React from 'react'
import {Button, Image} from 'react-bootstrap'
import Login from '../../img/login.png'
import {useHistory} from 'react-router-dom'
import './style.css'

export default function BtnLogin() {
    const history = useHistory()

    function handleLogin(){
        history.push('/login')
    }

    return (
        <Button
            variant="danger"
            className="btn-login"
            onClick={handleLogin}>
            <p>
                <span>
                    <Image
                        className="img-login" 
                        src={Login} 
                        alt="login" 
                    />
                </span>
            </p>
        </Button>
    )
}