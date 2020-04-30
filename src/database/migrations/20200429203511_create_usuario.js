
exports.up = function(knex) {
    knex.schema.hasTable('usuario').then((exists)=>{
        if(!exists){
            return(knex.schema.createTable('usuario',(table)=>{
                table.increments('id').primary()
                table.string('nome').notNullable();
                table.string('user', 120).notNullable();
                table.double('pass').notNullable();
            }))
        }
    })
};

exports.down = function(knex) {
    return(knex.schema.dropTable('usuario'))
};
