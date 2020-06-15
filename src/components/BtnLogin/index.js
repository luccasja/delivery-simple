import React from 'react'
import {Button, Image} from 'react-bootstrap'
import Login from '../../img/login.png'
import {useHistory} from 'react-router-dom'

function BtnLogin() {
    const history = useHistory()

    function handleLogin(){
        history.push('/login')
    }

    return (
        <Button 
            style={{
                background:'#FFF', 
                width:50, 
                height:40, 
                borderColor:'#e3e3e3'
            }} 
            onClick={handleLogin}>
            <p>
                <span>
                    <Image 
                        src={Login} 
                        style={{
                            height:20, 
                            width:20
                        }} 
                        alt='login' 
                    />
                </span>
            </p>
        </Button>
    )
}

export default BtnLogin