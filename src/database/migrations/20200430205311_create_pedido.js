exports.up = function(knex) {
    return knex.schema.hasTable('pedido').then((exists)=>{
        if(!exists){
            return(knex.schema.createTable('pedido',(table)=>{
                table.increments();
                table.string('nome_cliente').notNullable();
                table.string('telefone', 14).notNullable();
                table.string('endereco_entrega').notNullable();
                table.string('numero_entrega').notNullable();
                table.string('bairro_entrega').notNullable();
                table.string('complemento_entrega');
                table.string('frm_pagamento').notNullable();
                table.double('troco');
                table.double('valorTotal').notNullable();
                table.integer('qntd_item').notNullable();
                table.datetime('dt_pedido').notNullable();
                table.datetime('dt_finalizacao').notNullable();
                table.boolean('entregue');
            }))
        }
    })
};

exports.down = function(knex) {
    return(
        knex.schema.dropTable('pedido')
    )
};