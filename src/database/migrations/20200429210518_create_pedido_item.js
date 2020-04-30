
exports.up = function(knex) {
    knex.schema.hasTable('pedido_item').then((exists)=>{
        if(!exists){
            return(knex.schema.createTable('pedido_item',(table)=>{
                table.increments('id').primary()
                table.integer('id_produto').notNullable();
                table.integer('id_pedido').notNullable();
                table.double('valor_unitario').notNullable();
                table.double('valor_total').notNullable();
                table.integer('quantidade').notNullable();
                table.integer('posicao').notNullable();
                table.string('observacoes',150);
                table.foreign('id_produto').references('produto.id');
                table.foreign('id_pedido').references('pedido.id');
            }))
        }
    })
};

exports.down = function(knex) {
    return(
        knex.schema.dropTable('pedido_item')
    )
};
