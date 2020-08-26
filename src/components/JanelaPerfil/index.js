import React, {useState, useRef, useEffect} from 'react'
import {Col, Row, Image, InputGroup, FormControl, Spinner} from "react-bootstrap"
import InputMask from "react-input-mask"
import {ButtonCustom} from '../index'
import Api from '../../services/api'
import Config from '../../config/global' 
import './style.css'

function JanelaPerfil({hidden}) {
    const [srcImgNovo, setSrcImgNovo] = useState(window.location.origin+"/img/img_indisponivel.png")
    const [imgFile, setImgFile] = useState(undefined)
    const [logo, setLogo] = useState('')
    const [idEstabelecimento, setIdEstabelecimento] = useState(0)
    const [nomeEstabelecimento, setNomeEstabelecimento] = useState('')
    const [docResponsavel, setDocResponsavel] = useState('')
    const [contatoEstabelecimento, setContatoEstabelecimento] = useState('')
    const [enderecoEstabelecimento, setEnderecoEstabelecimento] = useState('')
    const [numeroEstabelecimento, setNumeroEstabelecimento] = useState('')
    const [bairroEstabelecimento, setBairroEstabelecimento] = useState('')
    const [cepEstabelecimento, setCepEstabelecimento] = useState('')
    const [complementoEstabelecimento, setComplementoEstabelecimento] = useState('')
    const [mensagemSaudacao, setMensagemSaudacao] = useState("")
    const [mensagemAgradecimento, setMensagemAgradecimento] = useState("")
    const [mensagemLjFechada, setMensagemLjFechada] = useState("")
    const [btnModificarDisabled, setBtnModificarDisabled] = useState(false)
    const [btnSalvarDisabled, setBtnSalvarDisabled] = useState(true)
    const [btnDesfazerDisabled, setBtnDesfazerDisabled] = useState(true)
    const [disabledCampos, setDisabledCampos] = useState(true)
    const [btnDesfazerVisible, setBtnDesfazerVisible] = useState(false)
    const [btnSalvarVisible, setBtnSalvarVisible] = useState(false)
    const [btnModificarVisible, setBtnModificarVisible] = useState(true)
    const [dadosTemp, setDadosTemp] = useState({})
    const maskCPF = "999.999.999-999"
    const maskCNPJ = "99.999.999/9999-99"
    const [maskInputDoc, setMaskInputDoc] = useState(maskCPF)
    const nomeEstabelecimentoRef = useRef()
    const docResponsavelRef = useRef()
    const contatoEstabelecimentoRef = useRef()
    const enderecoEstabelecimentoRef = useRef()
    const numeroEstabelecimentoRef = useRef()
    const bairroEstabelecimentoRef = useRef()
    const cepEstabelecimentoRef = useRef()
    const complementoEstabelecimentoRef = useRef()
    const msgSaudacaoRef = useRef()
    const msgAgradecimentoRef = useRef()
    const msgLjFechadaRef = useRef()
    

    useEffect(()=>{
        if(!hidden){
            return
        }

        Api.get('licenciada').then(response =>{
            if(response.status === 200){
                setIdEstabelecimento(response.data[0].id)
                if(response.data[0].logo.length > 0){
                    setSrcImgNovo(Config.repositorioImg+response.data[0].logo)
                    setLogo(response.data[0].logo)
                }else{
                    setSrcImgNovo(window.location.origin+"/img/img_indisponivel.png")
                }
                setNomeEstabelecimento(response.data[0].nome_fantasia)
                let docToMask
                if(response.data[0].doc.length <= 11){
                    docToMask = response.data[0].doc.substring(0,3)+'.'
                    docToMask += response.data[0].doc.substring(3,6)+'.'
                    docToMask += response.data[0].doc.substring(6,9)+'-'
                    docToMask += response.data[0].doc.substring(9,11)
                    setMaskInputDoc(maskCPF)
                    setDocResponsavel(docToMask)
                }else{
                    docToMask = response.data[0].doc.substring(0,2)+'.'
                    docToMask += response.data[0].doc.substring(2,5)+'.'
                    docToMask += response.data[0].doc.substring(5,8)+'/'
                    docToMask += response.data[0].doc.substring(8,12)+'-'
                    docToMask += response.data[0].doc.substring(12,14)
                    setMaskInputDoc(maskCNPJ)
                    setDocResponsavel(docToMask)
                }
                
                let contatoToMask = "("+response.data[0].contato.substring(0,2)+") "
                contatoToMask += response.data[0].contato.substring(2,7)+"-"
                contatoToMask += response.data[0].contato.substring(7,11)
                setContatoEstabelecimento(contatoToMask)

                setEnderecoEstabelecimento(response.data[0].endereco)
                setNumeroEstabelecimento(response.data[0].numero)
                setBairroEstabelecimento(response.data[0].bairro)

                let cepToMask = response.data[0].cep.substring(0,5)+"-"
                cepToMask += response.data[0].cep.substring(5,8)
                setCepEstabelecimento(cepToMask)

                setComplementoEstabelecimento(response.data[0].complemento)
                setMensagemSaudacao(response.data[0].msg_saudacao)
                setMensagemAgradecimento(response.data[0].msg_agradecimento)
                setMensagemLjFechada(response.data[0].msg_loja_fechada)
            }
        })

    },[hidden])
    

    function OnChangeImg(value){
        console.log(value)
        let reader = new FileReader();
        let file = value;

        if(file.size > 2097152){
            alert("Tamanho da imagem superior a 2MB")
            setSrcImgNovo(window.location.origin+"/img/img_indisponivel.png")
            setImgFile(undefined)
            return
        }

        reader.onloadend = () => {
            setSrcImgNovo(reader.result)
            setImgFile(file)
        }
        reader.readAsDataURL(file)
    }

    function HabilitarEdicao(){
        setDadosTemp({
            nomeEstabelecimento,
            docResponsavel,
            contatoEstabelecimento,
            enderecoEstabelecimento,
            numeroEstabelecimento,
            bairroEstabelecimento,
            cepEstabelecimento,
            complementoEstabelecimento,
            mensagemAgradecimento,
            mensagemSaudacao,
            mensagemLjFechada,
            logo
        })
        setDisabledCampos(false)
        setBtnModificarDisabled(true)
        setBtnSalvarDisabled(false)
        setBtnSalvarVisible(true)
        setBtnModificarVisible(false)
        setBtnDesfazerVisible(true)
        setBtnDesfazerDisabled(false)
    }

    function DesfazerAlteracao(){
        setNomeEstabelecimento(dadosTemp.nomeEstabelecimento)
        setDocResponsavel(dadosTemp.docResponsavel)
        setContatoEstabelecimento(dadosTemp.contatoEstabelecimento)
        setEnderecoEstabelecimento(dadosTemp.enderecoEstabelecimento)
        setNumeroEstabelecimento(dadosTemp.numeroEstabelecimento)
        setBairroEstabelecimento(dadosTemp.bairroEstabelecimento)
        setCepEstabelecimento(dadosTemp.cepEstabelecimento)
        setComplementoEstabelecimento(dadosTemp.complementoEstabelecimento)
        setMensagemSaudacao(dadosTemp.mensagemSaudacao)
        setMensagemAgradecimento(dadosTemp.mensagemAgradecimento)
        setMensagemLjFechada(dadosTemp.mensagemLjFechada)
        setLogo(dadosTemp.logo)
        setDisabledCampos(true)
        setBtnModificarDisabled(false)
        setBtnSalvarDisabled(true)
        setBtnSalvarVisible(false)
        setBtnModificarVisible(true)
        setBtnDesfazerVisible(false)
        setBtnDesfazerDisabled(true)
    }

    function SalvarModificacao(){
        if(Validacao()){
            setDisabledCampos(true)
            setBtnModificarDisabled(false)
            setBtnSalvarDisabled(true)
            setBtnModificarVisible(true)
            setBtnDesfazerVisible(false)
            setBtnDesfazerDisabled(true)
            let docfilter = docResponsavel.replace('.','')
            docfilter = docfilter.replace('.','')
            docfilter = docfilter.replace('-','')
            docfilter = docfilter.replace('/','')
            let cepfilter = cepEstabelecimento.replace('-','')
            let contatofilter = contatoEstabelecimento.replace('-','')
            contatofilter = contatofilter.replace('(','')
            contatofilter = contatofilter.replace(')','')
            contatofilter = contatofilter.replace(' ','')

            const formData = new FormData()
            formData.append("file", imgFile)
            formData.append("body", JSON.stringify({
                nome_fantasia: nomeEstabelecimento,
                doc: docfilter,
                contato: contatofilter,
                endereco: enderecoEstabelecimento,
                numero: numeroEstabelecimento,
                bairro: bairroEstabelecimento,
                cep: cepfilter,
                complemento: complementoEstabelecimento,
                msg_saudacao: mensagemSaudacao,
                msg_agradecimento: mensagemAgradecimento,
                msg_loja_fechada: mensagemLjFechada,
                logo
            }))

            if(idEstabelecimento > 0){
                Api.put('licenciada/'+idEstabelecimento, formData).then(response =>{
                    if(response.status === 200){
                        setBtnSalvarVisible(false)
                        alert("licenciada atualizada com sucesso!")
                        return
                    }
                }).catch(erro =>{
                    alert("Erro ao atualizar licenciada: "+erro.message)
                    setDisabledCampos(false)
                    setBtnModificarDisabled(true)
                    setBtnModificarVisible(false)
                    setBtnDesfazerVisible(true)
                    setBtnDesfazerDisabled(false)
                    setBtnSalvarDisabled(false)
                    setBtnSalvarVisible(true)
                })
            }else{
                Api.post('licenciada', formData).then(response =>{
                    if(response.status === 200){
                        setBtnSalvarVisible(false)
                        alert("licenciada criada com sucesso!")
                        return
                    }
                }).catch(erro =>{
                    alert("Falha ao criar licenciada: "+ erro.message)
                    setDisabledCampos(false)
                    setBtnModificarDisabled(true)
                    setBtnModificarVisible(false)
                    setBtnDesfazerVisible(true)
                    setBtnDesfazerDisabled(false)
                    setBtnSalvarDisabled(false)
                    setBtnSalvarVisible(true)
                })
            }
        }
    }

    function onChangeDoc(value){
        setDocResponsavel(value)
        if(value === ""){
            return
        }
        if(value.length > 14){
            setMaskInputDoc(maskCNPJ)
        }else{
            setMaskInputDoc(maskCPF)
        }
    }

    function Validacao(){
        if(nomeEstabelecimento === "" | nomeEstabelecimento.length < 4){
            alert("Dê um nome ao estabelecimento válido!")
            nomeEstabelecimentoRef.current.focus()
            return false
        }
        if(docResponsavel === "" | docResponsavel.length < 14){
            if(docResponsavel.length > 11 || docResponsavel.length < 14){
                alert("Informe um CPF ou CNPJ válido!")
                docResponsavelRef.current.getInputDOMNode().focus()
                return false
            }
            alert("Informe um CPF ou CNPJ válido!")
            docResponsavelRef.current.getInputDOMNode().focus()
            return false
        }
        if(contatoEstabelecimento === "" | contatoEstabelecimento.length < 15){
            alert("Informe um numero de contato válido!")
            contatoEstabelecimentoRef.current.getInputDOMNode().focus()
            return false
        }
        if(enderecoEstabelecimento === "" | enderecoEstabelecimento.length < 4){
            alert("Preencha o campo de endereço com uma informação válida!")
            enderecoEstabelecimentoRef.current.focus()
            return false
        }
        if(numeroEstabelecimento === "" | numeroEstabelecimento.length < 2){
            alert("Preencha o campo de numero!")
            numeroEstabelecimentoRef.current.focus()
            return false
        }
        if(bairroEstabelecimento === "" | bairroEstabelecimento.length < 3){
            alert("Preencha o campo de bairro!")
            bairroEstabelecimentoRef.current.focus()
            return false
        }
        if(cepEstabelecimento === "" | cepEstabelecimento.length < 9){
            alert("Preencha o campo de CEP!")
            cepEstabelecimentoRef.current.getInputDOMNode().focus()
            return false
        }
        if(mensagemSaudacao === "" | mensagemSaudacao.length < 5){
            alert("Mensagem de Saudação muito curta!")
            msgSaudacaoRef.current.focus()
            return false
        }
        if(mensagemAgradecimento === "" | mensagemAgradecimento.length < 5){
            alert("Mensagem de Agradecimento muito curta!")
            msgAgradecimentoRef.current.focus()
            return false
        }
        return true
    }

    return(
    <>
        <div hidden={hidden} className="container-janela-perfil-cmp">
            <Row style={{margin:0, padding:0}}>
                <Col md="6" style={{margin:0, padding:15}}>
                    <p><strong>Logo do Estabelecimento</strong></p>
                    <Col 
                        style={{borderStyle:'solid', borderWidth:1, borderColor:'#e3e3e3', textAlign:'center', padding:5, borderRadius:8, height:205, width:'100%', marginBottom:10}}>
                        <label style={{cursor: 'pointer'}}>
                            <Image 
                                src={srcImgNovo} 
                                roundedCircle 
                                style={{height:190, width:190, borderStyle:'solid', borderColor:'#e3e3e3', borderWidth:1, objectFit: "cover"}} 
                                alt='imagem do produto'/>
                            <input 
                                disabled={disabledCampos}
                                type="file" 
                                style={{display:'none'}} 
                                accept=".jpg,.jpeg,.png,.pjpeg"
                                onChange={e => OnChangeImg(e.target.files[0])}
                            />
                        </label>
                    </Col>
                </Col>
                <Col md="6" style={{margin:0, padding:15}}>
                    <Row style={{width:"100%", padding:0, margin:0}}>
                        <label style={{width:"100%"}}>
                            <p><strong>Nome Fantasia</strong></p>
                            <input
                                ref={nomeEstabelecimentoRef}
                                value={nomeEstabelecimento} 
                                disabled={disabledCampos}
                                onChange={e => setNomeEstabelecimento(e.target.value)} 
                                style={{width:"100%"}} 
                                placeholder="Nome do estabelecimento"
                                maxLength={50}
                            />
                        </label>
                    </Row>
                    <Row style={{width:"100%", padding:0, margin:0}}>
                        <label style={{width:"100%"}}>
                            <p><strong>CNPJ/CPF Responsável</strong></p>
                            <InputMask 
                                ref={docResponsavelRef}
                                value={docResponsavel}
                                disabled={disabledCampos}
                                mask={maskInputDoc}
                                style={{width:"100%"}} 
                                maskChar={null} 
                                onChange={e => onChangeDoc(e.target.value)} 
                            />
                        </label>
                    </Row>
                    <Row style={{width:"100%", padding:0, margin:0}}>
                        <label style={{width:"100%"}}>
                            <p><strong>Contato</strong></p>
                            <InputMask 
                                ref={contatoEstabelecimentoRef}
                                value={contatoEstabelecimento}
                                disabled={disabledCampos}
                                mask='(99) 99999-9999'
                                style={{width:"100%"}} 
                                maskChar={null} 
                                onChange={e => setContatoEstabelecimento(e.target.value)} 
                            />
                        </label>
                    </Row>
                </Col>
            </Row>
            <Row style={{margin:0, padding:0}}>
                <Col md="6" style={{margin:0, padding:15}}>
                    <label style={{width:"100%"}}>
                        <p><strong>Endereço</strong></p>
                        <input
                            ref={enderecoEstabelecimentoRef} 
                            value={enderecoEstabelecimento} 
                            disabled={disabledCampos}
                            style={{width:"100%"}}
                            onChange={e => setEnderecoEstabelecimento(e.target.value)} 
                            maxLength={80} 
                            placeholder='Rua'
                        />
                    </label>
                    <label style={{width:"100%"}}>
                        <input
                            ref={numeroEstabelecimentoRef} 
                            value={numeroEstabelecimento} 
                            disabled={disabledCampos} 
                            style={{width:"100%"}}
                            onChange={e => setNumeroEstabelecimento(e.target.value)} 
                            maxLength={20} 
                            placeholder='Número' 
                        />
                    </label>
                    <label style={{width:"100%"}}>
                        <input
                            ref={bairroEstabelecimentoRef} 
                            value={bairroEstabelecimento} 
                            disabled={disabledCampos} 
                            style={{width:"100%"}}
                            onChange={e => setBairroEstabelecimento(e.target.value)} 
                            maxLength={20} 
                            placeholder='Bairro' 
                        />
                    </label>
                    
                </Col>
                <Col md="6" style={{margin:0, padding:15}}>
                    <label style={{width:"100%"}}>
                        <p><strong>CEP</strong></p>
                        <InputMask 
                            ref={cepEstabelecimentoRef}
                            value={cepEstabelecimento}
                            disabled={disabledCampos}
                            mask='99999-999' 
                            maskChar={null} 
                            style={{width:"100%"}}
                            onChange={e => setCepEstabelecimento(e.target.value)} 
                        />
                    </label>
                    <label style={{width:"100%"}}>
                        <input
                            ref={complementoEstabelecimentoRef} 
                            value={complementoEstabelecimento} 
                            disabled={disabledCampos}
                            style={{width:"100%"}}
                            onChange={e => setComplementoEstabelecimento(e.target.value)} 
                            maxLength={80} 
                            placeholder='Referência' 
                        />
                    </label>
                </Col>
            </Row>
            <Row style={{margin:0, padding:0, marginBottom:10}}>
                <Col md="6" style={{marginBottom:10}}>
                    <p><strong>Mensagem de Saudações</strong></p>
                    <InputGroup style={{height:130}}>
                        <FormControl
                            ref={msgSaudacaoRef}
                            value={mensagemSaudacao}
                            disabled={disabledCampos} 
                            onChange={e => setMensagemSaudacao(e.target.value)} 
                            as="textarea" 
                            aria-label="With textarea" 
                            maxLength={160} 
                            height={130} 
                            style={{
                                resize: "none", 
                                margin:0, 
                                marginTop:0, 
                                background: "#F5F5F5", 
                                borderColor: "#E3E3E3"
                            }} 
                        />
                    </InputGroup>
                </Col>
                <Col md="6">
                    <p><strong>Mensagem de Agradecimento</strong></p>
                    <InputGroup style={{height:130}}>
                        <FormControl
                            ref={msgAgradecimentoRef} 
                            value={mensagemAgradecimento}
                            disabled={disabledCampos}
                            onChange={e => setMensagemAgradecimento(e.target.value)} 
                            as="textarea" 
                            aria-label="With textarea" 
                            maxLength={160} 
                            height={130}
                            style={{
                                resize: "none", 
                                margin:0, 
                                marginTop:0, 
                                background: "#F5F5F5", 
                                borderColor: "#E3E3E3"
                            }} 
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Row style={{margin:0, padding:0}}>
                <Col style={{margin:15, padding:0}}>
                    <p><strong>Mensagem para Estabelecimento Fechado</strong></p>
                    <InputGroup style={{height:130}}>
                        <FormControl
                            ref={msgLjFechadaRef} 
                            value={mensagemLjFechada}
                            disabled={disabledCampos}
                            onChange={e => setMensagemLjFechada(e.target.value)} 
                            as="textarea" 
                            aria-label="With textarea" 
                            maxLength={160} 
                            height={130}
                            style={{
                                resize: "none", 
                                margin:0, 
                                marginTop:0, 
                                background: "#F5F5F5", 
                                borderColor: "#E3E3E3"
                            }} 
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Row style={{textAlign:"right", margin:0, padding:0}}>
                <Col style={{margin:0, padding:15}}>
                    <ButtonCustom
                        hidden={!btnDesfazerVisible} 
                        disabled={btnDesfazerDisabled}
                        onClick={DesfazerAlteracao}
                        title="Desfazer"
                        variant="outline-danger"
                        width={100}
                        style={{marginRight:10}}
                    />
                    <ButtonCustom
                        hidden={!btnModificarVisible} 
                        disabled={btnModificarDisabled}
                        onClick={HabilitarEdicao}
                        title="Modificar"
                        variant="info"
                        width={100}
                        style={{marginRight:10}}
                    />
                    <ButtonCustom
                        hidden={!btnSalvarVisible}
                        disabled={btnSalvarDisabled}
                        onClick={SalvarModificacao}
                        title="Salvar"
                        variant="success"
                        width={100} 
                    />
                </Col>
            </Row>
        </div>
    </>
    )
}

export default JanelaPerfil;