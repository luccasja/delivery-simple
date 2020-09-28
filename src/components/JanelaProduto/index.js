import React, {useEffect, useState, useRef} from 'react'
import InputMask from 'react-input-mask';
import {Container, Row, Col, Image, Button, Modal, InputGroup, FormGroup, Spinner, FormControl} from 'react-bootstrap'
import {ModalConnection, ModalConfirm, ButtonCustom} from '../index'
import {Moeda} from '../../controllers/Tools'
import Api from '../../services/api'
import Config from '../../config/global'
import './style.css';

function JanelaProduto({hidden}) {
    const [produtos, setProdutos] = useState([])
    const [showModalCadPrd, setShowModalCadPrd] = useState(false)
    const [showModalConnection, setShowModalConnection] = useState(false)
    const [confirmShow, setConfirmShow] = useState(false)
    const [prd_titulo, setPrdTitulo] = useState('')
    const [prd_descricao, setPrdDescricao] = useState('')
    const [prd_img_dir, setPrdImgDir] = useState('')
    const [prd_valor_unitario, setPrdValorUnitario] = useState(0)
    const [prd_situacao, setPrdSituacao] = useState(0)
    const [prd_situacaoDisable, setPrdSituacaoDisable] = useState(true)
    const [prd_fracionado, setPrdFracionado] = useState(0)
    const [prd_id_categoria, setPrdIdCategoria] = useState(0)
    const [idProdutoSelecionado, setIdProdutoSelecionado] = useState(0)
    const [nomeProdutoSelecionado, setNomeProdutoSelecionado] = useState('')
    const [idVisible, setIdVisible] = useState(false)
    const [loadding, setLoadding] = useState(true)
    const [prdAtualizado, setPrdAtualizado] = useState(0)
    const [tituloModalCadPrd, setTituloModalCadPrd] = useState('')
    const [produtoLoading, setProdutoLoading] = useState(true)
    const [srcImgNovoProduto, setSrcImgNovoProduto] = useState(window.location.origin+"/img/img_indisponivel.png")
    const [imgFile, setImgFile] = useState(undefined)
    const [categorias, setCategorias] = useState([])
    const nomePrdRef = useRef()
    const descricaoPrdRef = useRef()
    const dirImgPrdRef = useRef()
    const valorUnitarioPrdRef = useRef()
    const situacaoPrdRef = useRef()
    const fracionadoPrdRef = useRef()
    const categoriaPrdRef = useRef()
    const btnNovoProduto = useRef()
    const listBtnAlterar = []

    useEffect(()=>{
        if(hidden){
            return
        }
        
        Api.get('produto').then(response =>{
            setProdutos(response.data)
            console.log(window.location.origin)
            setProdutoLoading(false)
        }).catch(error=>{
            console.log(error)
            setProdutoLoading(false)
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
    },[hidden, prdAtualizado])

    function CadastrarProduto(){
        if(nomePrdRef.current.value === "" || nomePrdRef.current.value.length < 3){
            alert('Campo nome obrigatorio')
            nomePrdRef.current.focus()
            return 
        }

        if(descricaoPrdRef.current.value === "" || descricaoPrdRef.current.value.length < 3){
            alert('Campo descrição obrigatorio')
            descricaoPrdRef.current.focus()
            return 
        }

        if(valorUnitarioPrdRef.current.value === '0' || valorUnitarioPrdRef.current.value === '' || valorUnitarioPrdRef.current.value === ','){
            alert('Campo valor obrigatorio')
            valorUnitarioPrdRef.current.focus()
            return 
        }

        if(prd_id_categoria === 0){
            alert('Campo categoria obrigatorio')
            categoriaPrdRef.current.focus()
            return
        }

        const produto = {
            nome: prd_titulo,
            descricao: prd_descricao,
            dir_img: prd_img_dir,
            valor_unitario: prd_valor_unitario,
            ativo: prd_situacao,
            fracionado: prd_fracionado,
            id_categoria: prd_id_categoria
        }

        const formData = new FormData()
        formData.append("file", imgFile)

        if(idVisible){
            setLoadding(true)
            Api.put(`produto/${idProdutoSelecionado}/update`, produto).then(response =>{
                if(response.status === 200){
                    //alert('Produto atualizado com sucesso!')
                    setIdProdutoSelecionado(0)
                    setIdVisible(false)
                    setPrdTitulo('')
                    setPrdDescricao('')
                    setPrdImgDir('')
                    setPrdValorUnitario(0)
                    setPrdFracionado(0)
                    setPrdIdCategoria(0)
                    setLoadding(false)
                    setShowModalCadPrd(false)
                    setPrdAtualizado(idProdutoSelecionado)
                }else{
                    alert('Falha na atualização do produto, tente novamente!')
                    setLoadding(false)
                }
            })
            Api.put('upload/'+idProdutoSelecionado, formData).then(response =>{
                if(response.status === 200){
                    alert('Produto atualizado com sucesso!')
                }
            })
            return
        }else{
            setLoadding(true)
            Api.post('produto', produto).then(response =>{
                if(response.status === 200){
                    //alert('Cadastro realizado com sucesso! ID:'+response.data.Ok)
                    setIdVisible(false)
                    setPrdTitulo('')
                    setPrdDescricao('')
                    setPrdImgDir('')
                    setPrdValorUnitario(0)
                    setPrdFracionado(0)
                    setPrdIdCategoria(0)
                    Api.post('upload/'+response.data.Ok.id, formData).then(response =>{
                        if(response.status === 200){
                            alert('Produto cadastrado com sucesso!')
                        }
                    })
                    setShowModalCadPrd(false)
                    setLoadding(false)
                    setPrdAtualizado(response.data.Ok.id)
                }else{
                    alert('Falha ao cadastrar o produto, tente novamente!')
                    setLoadding(false)
                }
            })
            
        }
    }

    function ConfirmarExclusao(){
        let idx = idProdutoSelecionado
        setLoadding(true)
        Api.delete('produto/'+idx).then(response =>{
            if(response.status === 200){
                if(response.data.Ok){
                    setProdutos(produtos.filter(item=> item.id !== idx))
                    setConfirmShow(false)
                    setLoadding(false)
                    setPrdAtualizado(idx)
                }else{
                    alert('Produto associado a pedidos não pode ser excluido')
                    setConfirmShow(false)
                    setLoadding(false)
                }
                
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
    }

    function DeleteShow(id_produto, nome_produto){
        setIdProdutoSelecionado(id_produto)
        setNomeProdutoSelecionado(nome_produto)
        setConfirmShow(true)
    }

    function EditarShow(id, nome, descricao, valorUnitario, ativo, dir_img, fracionado, idCategoria, idx){
        setTituloModalCadPrd('Alterar Cadastro de Produto')
        setLoadding(false)
        setIdProdutoSelecionado(id)
        setPrdTitulo(nome)
        setPrdDescricao(descricao)
        setPrdValorUnitario(valorUnitario)
        setPrdSituacao(ativo)
        setPrdFracionado(fracionado)
        setPrdIdCategoria(idCategoria)
        setPrdSituacaoDisable(false)
        setIdVisible(true)
        setShowModalCadPrd(true)
        
        if(dir_img !== null){
            setSrcImgNovoProduto(Config.repositorioImg+dir_img)
        }else{
            setSrcImgNovoProduto(window.location.origin+"/img/img_indisponivel.png")
        }
        //listBtnAlterar[idx].blur()
    }

    function NovoProdutoShow(){
        setTituloModalCadPrd('Novo Produto')
        setLoadding(false)
        setPrdTitulo('')
        setPrdDescricao('')
        setPrdValorUnitario(0)
        setIdProdutoSelecionado(0)
        setPrdSituacao(1)
        setPrdSituacaoDisable(true)
        setPrdFracionado(0)
        setPrdIdCategoria(0)
        setIdVisible(false)
        setShowModalCadPrd(true)
        setSrcImgNovoProduto(window.location.origin+"/img/img_indisponivel.png")
        setImgFile(undefined)
        btnNovoProduto.current.blur()
    }

    function BuscarProdutoPorPK(id){
        if(id === '' || id === undefined){
            Api.get('produto/').then(response =>{
                if(response.status === 200){
                    if(response.data.length === 0){
                        return
                    }
                    setProdutos(response.data)
                    return
                }
            }).catch(error=>{
                console.log(error)
                setShowModalConnection(true)
                return
            })
            return
        }
        setProdutoLoading(true)
        Api.get('produto/'+id).then(response =>{
            if(response.status === 200){
                if(response.data.length === 0){
                    setProdutoLoading(false)
                    return
                }else{
                    let result = []
                    result.push(response.data)
                    setProdutoLoading(false)
                    if(result.length > 0){
                        setProdutos(result)
                    }
                }
            }
        }).catch(error=>{
            console.log(error)
            setProdutoLoading(false)
            setShowModalConnection(true)
            return
        })
    }

    function BuscarProdutoPorNome(nome){
        if(nome === '' || nome === undefined){
            Api.get('produto/').then(response =>{
                if(response.status === 200){
                    if(response.data.length === 0){
                        return
                    }
                    setProdutos(response.data)
                    return
                }
            }).catch(error=>{
                console.log(error)
                setShowModalConnection(true)
                return
            })
            return
        }

        Api.get('produto/nome/'+nome).then(response =>{
            if(response.status === 200){
                if(response.data.length === 0){
                    return
                }
                setProdutos(response.data)
                return
            }
        }).catch(error=>{
            console.log(error)
            setShowModalConnection(true)
            return
        })
    }

    function OnChangeImg(value){
        console.log(value)
        let reader = new FileReader();
        let file = value;

        if(file.size > 2097152){
            alert("Tamanho da imagem superior a 2MB")
            setSrcImgNovoProduto(window.location.origin+"/img/img_indisponivel.png")
            setImgFile(undefined)
            return
        }

        reader.onloadend = () => {
            setSrcImgNovoProduto(reader.result)
            setImgFile(file)
        }
        reader.readAsDataURL(file)
    }

    return (
        <>
        <div 
            hidden={hidden} 
            className="container-janela-produto-cmp">
            <Row className="container-busca-janela-produto">
                <Col md='3' my-auto='true'>
                    <p>
                        <strong>ID</strong>
                        <InputMask 
                            mask='99999' 
                            maskChar={null} 
                            className="input-id-janela-prod" 
                            onChange={e => BuscarProdutoPorPK(e.target.value)} 
                            placeholder='99999'
                        />
                    </p>
                </Col>
                <Col md='7' my-auto='true'>
                    <p>
                        <strong>Nome</strong>
                        <input 
                            className="input-nome-janela-prod" 
                            onChange={e => BuscarProdutoPorNome(e.target.value)} 
                            maxLength="100" 
                            placeholder='Pastel...'
                        />
                    </p>
                </Col>
                <Col md='2' className="container-btn-new-prod-janela-prod">
                    <Button 
                        variant="info" 
                        ref={btnNovoProduto} 
                        onClick={NovoProdutoShow} 
                        className="btn-new-prod-janela-prod">
                        Novo
                    </Button>
                </Col>
            </Row>
            <Row style={{margin:0}}>
                <Col className="separador-busca-janela-produto"/>
            </Row>
            <Row
                hidden={!produtoLoading} 
                className="load-janela-produto-cmp">
                <Spinner 
                    animation="border" 
                    variant="info" 
                />
            </Row>
            {
                produtos.map((produto, idx) => (
                    <Row 
                        key={produto.id} 
                        style={{
                            justifyContent:'center', 
                            alignItems:'center',
                            padding:0, 
                            margin:0, 
                            borderBottomStyle:'solid', 
                            borderBottomColor:'#e3e3e3', 
                            borderBottomWidth:0.5, 
                            paddingTop:15, 
                            paddingBottom:15,
                        }}>
                        <Col 
                            xs='7' 
                            my-auto="true" 
                            style={{
                                textAlign:'start', 
                                padding:0, 
                                margin:0, 
                                paddingLeft:15
                            }}>
                            <p>
                                <strong style={{color:'#F97A7A'}}>
                                    ID: {produto.id}
                                </strong>
                                <strong> - {produto.nome}</strong>
                            </p>
                            <p style={{fontSize:13}}>
                                {produto.descricao}
                            </p>
                            <p style={{fontSize:20}}>
                                <strong>
                                    {Moeda(produto.valor_unitario)}
                                </strong>
                            </p>
                            {
                                !produto.ativo &&
                                <span style={{fontSize:13, height:30, background:'#F43d', color:'#FFF', padding:3, borderRadius:3, paddingLeft:10, paddingRight:10}}>
                                    Inativo
                                </span>
                            }
                        </Col>
                        <Col xs='5'>
                            <Row style={{margin:0, padding:0}}>
                                <Col md='6' style={{margin:0, padding:0}}>
                                    <Row style={{justifyContent:'center', alignItems:'center'}}> 
                                        <Image 
                                            src={
                                                produto.dir_img === null 
                                                ? window.location.origin+"/img/img_indisponivel.png" 
                                                : Config.repositorioImg+produto.dir_img
                                            } 
                                            roundedCircle 
                                            style={{height:100, width:100, borderStyle:'solid', borderColor:'#e3e3e3', borderWidth:1, objectFit: "cover"}} 
                                            alt='imagem do produto' 
                                        />
                                    </Row>
                                </Col>
                                <Col md='6' style={{margin:0, padding:0}}>
                                    <Row style={{justifyContent:'center'}}>
                                        <ButtonCustom
                                            variant="info"
                                            title="Alterar"
                                            width={100}
                                            onClick={()=>EditarShow(produto.id, produto.nome, produto.descricao, produto.valor_unitario, produto.ativo, produto.dir_img, produto.fracionado, produto.id_categoria, idx)}
                                        />
                                        
                                    </Row>
                                    <Row style={{justifyContent:'center'}}>
                                        <ButtonCustom
                                            variant="danger"
                                            title="Deletar"
                                            width={100}
                                            height={30}
                                            fontSize={13}
                                            onClick={()=>DeleteShow(produto.id, produto.nome)}
                                        />
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                ))
            }
        </div>
        <Modal show={showModalCadPrd} onHide={()=> setShowModalCadPrd(false)}>
            <Modal.Header closeButton>
                <strong>{tituloModalCadPrd}</strong>
            </Modal.Header>
            <Modal.Body>
                <Row style={{margin:0, padding:0, justifyContent:'center', alignItems:'center'}}>
                    <Col>
                    {
                        idVisible && <p><strong style={{color:'#F43d'}}>ID Produto: </strong>{idProdutoSelecionado}</p>
                    }
                    <p><strong>Titulo</strong></p>
                    <input ref={nomePrdRef} value={prd_titulo} onChange={e => setPrdTitulo(e.target.value)} placeholder='Ex: Pastel Misto' style={{width:'100%'}}/>
                    </Col>
                </Row>
                <Row style={{margin:0, padding:0, justifyContent:'center', alignItems:'center'}}>
                    <Col xs='7'>
                        <p><strong>Descrição</strong></p>
                        <InputGroup style={{height:120, width:'100%', marginBottom:10}}>
                            <FormControl ref={descricaoPrdRef} value={prd_descricao} onChange={e => setPrdDescricao(e.target.value)} as="textarea" aria-label="With textarea" maxLength={150} style={{resize: 'none' , margin:0, marginTop:0, background:'#F5F5F5', borderColor:'#E3E3E3'}}/>
                        </InputGroup>
                    </Col>
                    <Col my-auto='true' xs='5'>
                        <p><strong>Foto</strong></p>
                        <Col 
                            my-auto='true' 
                            style={{borderStyle:'solid', borderWidth:1, borderColor:'#e3e3e3', textAlign:'center', padding:5, borderRadius:8, height:120, width:'100%', marginBottom:10}}>
                            <label style={{cursor: 'pointer'}}>
                                <Image 
                                    src={srcImgNovoProduto} 
                                    roundedCircle 
                                    style={{height:100, width:100, borderStyle:'solid', borderColor:'#e3e3e3', borderWidth:1, objectFit: "cover"}} 
                                    alt='imagem do produto'/>
                                <input 
                                    type="file" 
                                    style={{display:'none'}} 
                                    accept=".jpg,.jpeg,.png,.pjpeg"
                                    onChange={e => OnChangeImg(e.target.files[0])}
                                />
                            </label>
                        </Col>
                    </Col>
                </Row>
                <Row  style={{margin:0, padding:0, justifyContent:'center', alignItems:'center'}}>
                    <Col xs='6'>
                        <p><strong>Valor</strong></p>
                        <input ref={valorUnitarioPrdRef} style={{width:'100%'}} value={prd_valor_unitario} onChange={e => setPrdValorUnitario(e.target.value)} placeholder='0,00' type='number'/>
                    </Col>
                    <Col xs='6'>
                        <p><strong>Situação</strong></p>
                        <select disabled={prd_situacaoDisable} value={prd_situacao} ref={situacaoPrdRef} onChange={e=> setPrdSituacao(e.target.value)} style={{width:'100%'}}>
                            <option value={1}>Ativo</option>
                            <option value={0}>Inativo</option>
                        </select>
                    </Col>
                </Row>
                <Row style={{margin:0, padding:0, justifyContent:'center', alignItems:'center'}}>
                    <Col xs='6'>
                        <p><strong>Categoria</strong></p>
                        <select value={prd_id_categoria} ref={categoriaPrdRef} onChange={e=> setPrdIdCategoria(e.target.value)} style={{width:'100%'}}>
                            <option value={0}></option>
                            {
                                categorias.map(categoria =>{
                                    return (
                                        categoria.ativo === 1 && <option key={categoria.id} value={categoria.id}>{categoria.descricao}</option>
                                    )
                                })
                            }
                        </select>
                    </Col>
                    <Col xs='6'>
                        <p><strong>Fracionado</strong></p>
                        <select value={prd_fracionado} ref={fracionadoPrdRef} onChange={e=> setPrdFracionado(e.target.value)} style={{width:'100%'}}>
                            <option value={1}>Sim</option>
                            <option value={0}>Não</option>
                        </select>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer style={{justifyContent:'center', alignItems:'center'}}>
                <Button onClick={CadastrarProduto} style={{background:'#F97A7A', width:200, borderColor:'#FFF'}}>
                <Spinner animation="border" hidden={!loadding} variant="light" style={{height:20, width:20, marginRight:10}}/>
                    Salvar
                </Button>
            </Modal.Footer>
        </Modal>
        <ModalConfirm 
            texto={"Deseja realmente excluir o produto: "+nomeProdutoSelecionado}
            titulo={nomeProdutoSelecionado} 
            show={confirmShow} 
            onHide={()=>setConfirmShow(false)}
            onClickNegacao={()=> setConfirmShow(false)}
            onClickConfirmacao={()=> ConfirmarExclusao()}
        />
        <ModalConnection 
            show={showModalConnection} 
            onHide={()=> setShowModalConnection(false)}
        /> 
        </>
    );
}

export default JanelaProduto;