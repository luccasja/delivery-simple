
exports.up = function(knex) {
    knex.schema.hasTable('produto').then((exists)=>{
        if(!exists){
            return(knex.schema.createTable('produto',(table)=>{
                table.increments('id').primary()
                table.string('nome').notNullable();
                table.string('descricao', 120).notNullable();
                table.double('valor_unitario').notNullable();
                table.string('dir_img');
            }))
        }
    })
};

exports.down = function(knex) {
    return(
        knex.schema.dropTable('produto')
    )
};
