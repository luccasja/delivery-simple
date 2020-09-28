import React, {useEffect, useState} from 'react';
import {Card, Accordion, Table, Image, Button, Modal, Row, Col} from 'react-bootstrap'
import Config from '../../config/global'
import Api from '../../services/api'
import {Moeda} from '../../controllers/Tools'
import {
    ModalConnection,
    ModalConfirm
} from '../../components'

import './style.css';

function JanelaCadastros({hidden}) {
    const [inputBuscaBairro, setInputBuscaBairro] = useState("")
    const [idBairroSelecionado, setIdBairroSelecionado] = useState(0)
    const [idxBairroSelecionado, setIdxBairroSelecionado] = useState(0)
    const [descricaoBairroSelecionado, setDescricaoBairroSelecionado] = useState("")
    const [showModalCadBairro, setShowModalCadBairro] = useState(false)
    const [confirmCategoriaShow, setConfirmCategoriaShow] = useState(false)
    const [bairros, setBairros] = useState([])
    const [descricaoBairro, setDescricaoBairro] = useState("")
    const [descricaoBairroDisabled, setDescricaoBairroDisabled] = useState(false)
    const [freteBairro, setFreteBairro] = useState("")
    const [showModalConnection, setShowModalConnection] = useState(false)
    const [confirmShow, setConfirmShow] = useState(false)
    const [categorias, setCategorias] = useState([])
    const [inputBuscaCategoria, setInputBuscaCategoria] = useState("")
    const [idCategoriaSelecionada, setIdCategoriaSelecionada] = useState(0)
    const [idxCategoriaSelecionada, setIdxCategoriaSelecionada] = useState(0)
    const [descricaoCategoriaSelecionada, setDescricaoCategoriaSelecionada] = useState("")
    const [showModalCadCategoria, setShowModalCadCategoria] = useState(false)
    const [descricaoCategoria, setDescricaoCategoria] = useState("")

    useEffect(()=>{
        if(hidden){
            return
        }

        Api.get('bairro').then(response=>{
            if(response.status === 200){
                setBairros(response.data)
            }
        }).catch(error =>{
            console.log(error)
            setShowModalConnection(true)
            return
        })

        Api.get('categoria').then(response=>{
            if(response.status === 200){
                setCategorias(response.data)
            }
        }).catch(error =>{
            console.log(error)
            setShowModalConnection(true)
            return
        })

    },[hidden])
    
    function OnChangeSearchBairro(value){
        let valueFilter = value.replace('/',"")
        valueFilter = valueFilter.replace('-',"")
        valueFilter = valueFilter.replace('%',"")
        valueFilter = valueFilter.replace('&',"")
        valueFilter = valueFilter.replace('*',"")
        valueFilter = valueFilter.replace('#',"")
        valueFilter = valueFilter.replace('@',"")
        valueFilter = valueFilter.replace('!',"")
        valueFilter = valueFilter.replace('$',"")
        valueFilter = valueFilter.replace('(',"")
        valueFilter = valueFilter.replace(')',"")
        setInputBuscaBairro(valueFilter)
        if(valueFilter === ''){
            Api.get('bairro').then(response =>{
                setBairros(response.data)
            }).catch(error=>{
                console.log(error)
                setShowModalConnection(true)
                return
            })
            return
        }

        Api.get('bairro/nome/'+valueFilter).then(response=>{
            if(response.status === 200){
                setBairros(response.data)
            }
        }).catch(error =>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
    }

    function OnChangeSearchCategoria(value){
        let valueFilter = value.replace('/',"")
        valueFilter = valueFilter.replace('-',"")
        valueFilter = valueFilter.replace('%',"")
        valueFilter = valueFilter.replace('&',"")
        valueFilter = valueFilter.replace('*',"")
        valueFilter = valueFilter.replace('#',"")
        valueFilter = valueFilter.replace('@',"")
        valueFilter = valueFilter.replace('!',"")
        valueFilter = valueFilter.replace('$',"")
        valueFilter = valueFilter.replace('(',"")
        valueFilter = valueFilter.replace(')',"")
        setInputBuscaCategoria(valueFilter)
        if(valueFilter === ''){
            Api.get('categoria').then(response =>{
                setCategorias(response.data)
            }).catch(error=>{
                console.log(error)
                setShowModalConnection(true)
                return
            })
            return
        }

        Api.get('categoria/nome/'+valueFilter).then(response=>{
            if(response.status === 200){
                setCategorias(response.data)
            }
        }).catch(error =>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
    }

    function NovoBairro(){
        if(idBairroSelecionado > 0){
            AtualizarBairro()
        }else{
            Api.post("bairro",{
                descricao: descricaoBairro,
                frete: freteBairro,
                ativo: 1
            }).then(response=>{
                if(response.status === 200){
                    alert("Bairro "+descricaoBairro+" cadastrado com sucesso!")
                    let listaBairros = []
                    listaBairros = bairros
                    listaBairros.push({
                        id:response.data.ok,
                        descricao: descricaoBairro,
                        frete: freteBairro,
                        ativo: 1
                    })
                    setBairros(listaBairros)
                    setFreteBairro(0)
                    setDescricaoBairro("")
                    setShowModalCadBairro(false)
                }
            }).catch(error =>{
                console.log(error)
                alert("Falha ao cadastrar bairro!")
                return
            })
        }
    }

    function NovaCategoria(){
        if(idCategoriaSelecionada > 0){
            AtualizarCategoria()
        }else{
            Api.post("categoria",{
                descricao: descricaoCategoria,
                ativo: 1
            }).then(response=>{
                if(response.status === 200){
                    alert("Categoria "+descricaoCategoria+" cadastrada com sucesso!")
                    let listaCategorias = []
                    listaCategorias = categorias
                    listaCategorias.push({
                        id:response.data.ok,
                        descricao: descricaoCategoria,
                        ativo: 1
                    })
                    setCategorias(listaCategorias)
                    setDescricaoCategoria("")
                    setShowModalCadCategoria(false)
                }
            }).catch(error =>{
                console.log(error)
                alert("Falha ao cadastrar Categoria!")
                return
            })
        }
    }

    function ApagarBairro(id){
        Api.delete('bairro/'+id).then(response=>{
            if(response.status === 200){
                let idx = idxBairroSelecionado
                let lista = []
                let listaBairros = bairros

                for (let i = 0; i < listaBairros.length; i++) {
                    if(i !== idx){
                        lista.push(listaBairros[i])
                    }
                }

                setBairros(lista)
                setIdxBairroSelecionado(0)
                setIdBairroSelecionado(0)
                setDescricaoBairroSelecionado(0)
                setConfirmShow(false)
                alert("bairro apagado com sucesso!")
                return true
            }
        }).catch(error =>{
            console.log(error)
            setConfirmShow(false)
            alert("falha ao apagar bairro!")
            return false
        })
    }

    function ApagarCategoria(id){
        Api.delete('categoria/'+id).then(response=>{
            if(response.status === 200){
                let idx = idxCategoriaSelecionada
                let lista = []
                let listaCategorias = categorias

                for (let i = 0; i < listaCategorias.length; i++) {
                    if(i !== idx){
                        lista.push(listaCategorias[i])
                    }
                }

                setCategorias(lista)
                setIdxCategoriaSelecionada(0)
                setIdCategoriaSelecionada(0)
                setDescricaoCategoriaSelecionada("")
                setConfirmShow(false)
                alert("Categoria excluida com sucesso!")
                return true
            }
        }).catch(error =>{
            console.log(error)
            setConfirmShow(false)
            alert("falha ao apagar Categoria!")
            return false
        })
    }

    function ConfirmarExclusao(){
        ApagarBairro(idBairroSelecionado)
    }

    function ConfirmarExclusaoCategoria(){
        ApagarCategoria(idCategoriaSelecionada)
    }

    function AtualizarBairro(){
        Api.put("bairro/"+idBairroSelecionado,{
            descricao: descricaoBairro,
            frete: freteBairro,
            ativo: 1
        }).then(response =>{
            if(response.status === 200){
                let bairrolista = bairros
                for (let i = 0; i < bairrolista.length; i++) {
                    if(bairrolista[i].id === idBairroSelecionado){
                        bairrolista[i].frete = freteBairro
                        break
                    }
                    
                }
                setBairros(bairrolista)
                setIdxBairroSelecionado(0)
                setIdBairroSelecionado(0)
                setDescricaoBairroSelecionado(0)
                setDescricaoBairroDisabled(false)
                setShowModalCadBairro(false)
            }
        }).catch(error =>{
            console.log(error)
            alert("falha ao atualizar bairro!")
            return false
        })
    }

    function AtualizarCategoria(){
        Api.put("categoria/"+idCategoriaSelecionada,{
            descricao: descricaoCategoria,
            ativo: 1
        }).then(response =>{
            if(response.status === 200){
                let categorialista = categorias
                for (let i = 0; i < categorialista.length; i++) {
                    if(categorialista[i].id === idCategoriaSelecionada){
                        categorialista[i].descricao = descricaoCategoria
                        break
                    }
                    
                }
                setCategorias(categorialista)
                setIdxCategoriaSelecionada(0)
                setIdCategoriaSelecionada(0)
                setDescricaoCategoriaSelecionada("")
                setShowModalCadCategoria(false)
            }
        }).catch(error =>{
            console.log(error)
            alert("Falha ao atualizar Categoria!")
            return false
        })
    }

    return(
        <div hidden={hidden}>
            <Accordion defaultActiveKey="0">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        <p>
                            <strong>
                                Bairros
                            </strong>
                        </p>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body style={{padding:0, overflow:"auto", maxHeight:500}}>
                            <Row style={{margin:0, padding:0}}>
                                <Col xs="10" style={{margin:0, padding:0, display:"flex", justifyContent: "center", alignItems:"center"}}>
                                    <label style={{width:'100%', margin:10}}>
                                        <input 
                                            style={{width:'90%', marginBottom:5}} 
                                            placeholder="Informe aqui a sua busca"
                                            value={inputBuscaBairro}
                                            onChange={e => OnChangeSearchBairro(e.target.value)}
                                            maxLength={40}
                                        />
                                        <Image 
                                            style={{height:40, width:'10%', objectFit:'contain'}} 
                                            src={window.location.origin+"/img/search.png"}
                                        />
                                    </label>
                                </Col>
                                <Col xs="2" style={{margin:0, padding:0, display:"flex", justifyContent: "center", alignItems:"center"}}>
                                    <Button 
                                        variant="info"
                                        onClick={()=> {
                                            setShowModalCadBairro(true);
                                            setDescricaoBairroDisabled(false); 
                                            setIdxBairroSelecionado(0);
                                            setIdBairroSelecionado(0);
                                            setDescricaoBairro("")
                                            setFreteBairro("")
                                        }}>
                                            Novo
                                    </Button>
                                </Col>
                            </Row>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Bairro</th>
                                        <th>Frete</th>
                                        <th>Alterar</th>
                                        <th>Apagar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        bairros.map((bairro, idx) =>{
                                            return (
                                                <tr key={idx}>
                                                    <td>{bairro.id}</td>
                                                    <td>{bairro.descricao}</td>
                                                    <td>{Moeda(bairro.frete)}</td>
                                                    <td>
                                                        <Image 
                                                            style={{height:30, cursor:'pointer'}} 
                                                            src={window.location.origin+"/img/edit.png"}
                                                            onClick={()=>{
                                                                setDescricaoBairroDisabled(true);
                                                                setIdBairroSelecionado(bairro.id);
                                                                setDescricaoBairro(bairro.descricao)
                                                                setFreteBairro(bairro.frete)
                                                                setShowModalCadBairro(true)
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Image 
                                                            style={{height:30, cursor:'pointer'}} 
                                                            onClick={()=> {
                                                                setConfirmShow(true); 
                                                                setIdBairroSelecionado(bairro.id);
                                                                setDescricaoBairroSelecionado(bairro.descricao) 
                                                                setIdxBairroSelecionado(idx)
                                                            }}
                                                            src={window.location.origin+"/img/delete.png"}
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        <p>
                            <strong>
                                Categorias
                            </strong>
                        </p>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body style={{padding:0, overflow:"auto", maxHeight:500}}>
                            <Row style={{margin:0, padding:0}}>
                                <Col xs="10" style={{margin:0, padding:0, display:"flex", justifyContent: "center", alignItems:"center"}}>
                                    <label style={{width:'100%', margin:10}}>
                                        <input 
                                            style={{width:'90%', marginBottom:5}} 
                                            placeholder="Informe aqui a sua busca"
                                            value={inputBuscaCategoria}
                                            onChange={e => OnChangeSearchCategoria(e.target.value)}
                                            maxLength={40}
                                        />
                                        <Image 
                                            style={{height:40, width:'10%', objectFit:'contain'}} 
                                            src={window.location.origin+"/img/search.png"}
                                        />
                                    </label>
                                </Col>
                                <Col xs="2" style={{margin:0, padding:0, display:"flex", justifyContent: "center", alignItems:"center"}}>
                                    <Button 
                                        variant="info"
                                        onClick={()=> {
                                            setShowModalCadCategoria(true);
                                            setIdxCategoriaSelecionada(0);
                                            setIdCategoriaSelecionada(0);
                                            setDescricaoCategoria("")
                                        }}>
                                            Novo
                                    </Button>
                                </Col>
                            </Row>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Categoria</th>
                                        <th>Alterar</th>
                                        <th>Apagar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        categorias.map((categoria, idx) =>{
                                            return (
                                                <tr key={idx}>
                                                    <td>{categoria.id}</td>
                                                    <td>{categoria.descricao}</td>
                                                    <td>
                                                        <Image 
                                                            style={{height:30, cursor:'pointer'}} 
                                                            src={window.location.origin+"/img/edit.png"}
                                                            onClick={()=>{
                                                                setIdCategoriaSelecionada(categoria.id);
                                                                setDescricaoCategoria(categoria.descricao)
                                                                setShowModalCadCategoria(true)
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Image 
                                                            style={{height:30, cursor:'pointer'}} 
                                                            onClick={()=> {
                                                                setConfirmCategoriaShow(true); 
                                                                setIdCategoriaSelecionada(categoria.id);
                                                                setDescricaoCategoriaSelecionada(categoria.descricao) 
                                                                setIdxCategoriaSelecionada(idx)
                                                            }}
                                                            src={window.location.origin+"/img/delete.png"}
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        <p>
                            <strong>
                                Complementos
                            </strong>
                        </p>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                    <Card.Body style={{padding:0}}>
                        
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <ModalConnection 
                show={showModalConnection} 
                onHide={()=> setShowModalConnection(false)}
            />
            <ModalConfirm 
                show={confirmShow} 
                onHide={()=>setConfirmShow(false)}
                titulo={descricaoBairroSelecionado}
                texto={"Deseja realmente apagar o bairro "+descricaoBairroSelecionado}
                onClickNegacao={()=> setConfirmShow(false)} 
                onClickConfirmacao={ConfirmarExclusao}
            />
            <ModalConfirm 
                show={confirmCategoriaShow} 
                onHide={()=>setConfirmCategoriaShow(false)}
                titulo={descricaoCategoriaSelecionada}
                texto={"Deseja realmente apagar a categoria "+descricaoCategoriaSelecionada}
                onClickNegacao={()=> setConfirmCategoriaShow(false)} 
                onClickConfirmacao={ConfirmarExclusaoCategoria}
            />
            <Modal show={showModalCadBairro} onHide={()=>setShowModalCadBairro(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Bairro
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding:15}}>
                    <Row style={{padding:0, margin:0, justifyContent:'center'}}>
                        <label>
                            <p>Descição</p>
                            <input
                                disabled={descricaoBairroDisabled} 
                                maxLength={80} 
                                style={{width:250}}
                                value={descricaoBairro}
                                onChange={e => setDescricaoBairro(e.target.value)}
                            />
                        </label>
                    </Row>
                    <Row style={{padding:0, margin:0, justifyContent:'center'}}>
                        <label>
                            <p>Valor do Frete</p>
                            <input 
                                maxLength={5} 
                                type="number" 
                                style={{width:250}}
                                value={freteBairro}
                                onChange={e => setFreteBairro(e.target.value)}
                            />
                        </label>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={{justifyContent:'center'}}>
                    <Button 
                        variant="danger" 
                        onClick={()=> setShowModalCadBairro(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="info"
                        onClick={NovoBairro}
                        style={{width:150}}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModalCadCategoria} onHide={()=>setShowModalCadCategoria(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Categoria
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding:15}}>
                    <Row style={{padding:0, margin:0, justifyContent:'center'}}>
                        <label>
                            <p>Descição</p>
                            <input
                                maxLength={80} 
                                style={{width:250}}
                                value={descricaoCategoria}
                                onChange={e => setDescricaoCategoria(e.target.value)}
                            />
                        </label>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={{justifyContent:'center'}}>
                    <Button 
                        variant="danger" 
                        onClick={()=> setShowModalCadCategoria(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="info"
                        onClick={NovaCategoria}
                        style={{width:150}}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    ) 
}

export default JanelaCadastros;