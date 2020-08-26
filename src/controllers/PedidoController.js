import {Moeda} from './Tools'

class PedidoController{
    SomarItens(lista){
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

    SomarDoubleItens(lista){
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

        return (total)
    }
}

export default PedidoController;