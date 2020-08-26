function LimitarString(value = '', maxLength = 0){
    if(value.length > maxLength){
        return value.substring(0, maxLength)+'...'
    }
    return value
}

function Moeda(value){
    return Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value)
}

function SomarItens(lista){
    if(!lista){
        return 0
    }

    let list = lista
    let quant = 0.0
    let preco = 0.0
    let total = 0

    list.forEach(item => {
        quant = item.quantidade
        preco = item.valor_unitario
        total = total+(quant*preco)
    });

    return Moeda(total)
}

function ValidarTelefone(telefone){
    let expressao = /\([1-9]{1}[1-9]{1}\)\s[9]{1}\d{4}\-\d{4}/g
    let regex = new RegExp(expressao)
    return regex.test(telefone)
}

function ValidarCPF(strCPF){
    if(strCPF === '' || strCPF === undefined){
        return false
    }
    strCPF = strCPF.replace('.','')
    strCPF = strCPF.replace('.','')
    strCPF = strCPF.replace('-','')
    var soma;
    var resto;
    soma = 0;
    if (strCPF === "00000000000") return false;
    if (strCPF === "11111111111") return false;
    if (strCPF === "22222222222") return false;
    if (strCPF === "33333333333") return false;
    if (strCPF === "44444444444") return false;
    if (strCPF === "55555555555") return false;
    if (strCPF === "66666666666") return false;
    if (strCPF === "77777777777") return false;
    if (strCPF === "88888888888") return false;
    if (strCPF === "99999999999") return false;
    if (strCPF === "12345678901") return false;
    
    for (let i=1; i<=9; i++) soma = soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11))  resto = 0;
    if (resto !== parseInt(strCPF.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11))  resto = 0;
    if (resto !== parseInt(strCPF.substring(10, 11))) return false;
    return true;
}

function DataFormat(value){
    if(value === undefined){
        return
    }
    return Intl.DateTimeFormat('pt-BR', {year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'America/Sao_Paulo',
    hour12: false,}).format(new Date(value))
}

function GetFormattedDateIni() {
    var todayTime = new Date();
    var month = todayTime.getMonth() + 1;
    if(month < 10){
        month = '0'+month
    }
    var day = todayTime.getDate()
    if(day < 10){
        day = '0'+day
    }
    var year = todayTime.getFullYear()
    return year + "-" + month +  "-" + day +'T03:00:00.00Z' ;
}

function GetFormattedDateFim() {
    var todayTime = new Date();
    var month = todayTime.getMonth() + 1;
    if(month < 10){
        month = '0'+month
    }
    var day = todayTime.getDate()
    if(day < 9){
        day++
        day = '0'+day
    }
    if(day > 9){
        day++
    }
    var year = todayTime.getFullYear()
    return year + "-" + month +  "-" + day +'T03:00:00.00Z';
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

var parseQueryString = function() {
    var str = window.location.search;
    var objURL = {};

    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL;
};

export {
    LimitarString, 
    Moeda, 
    SomarItens, 
    ValidarTelefone, 
    ValidarCPF, 
    DataFormat, 
    GetFormattedDateIni, 
    GetFormattedDateFim,
    isFloat,
    isInt,
    parseQueryString
};