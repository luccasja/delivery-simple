exports.up = function(knex) {
    return knex.schema.hasTable('usuario').then((exists)=>{
        if(!exists){
            return(knex.schema.createTable('usuario',(table)=>{
                table.increments('id').primary()
                table.string('nome').notNullable();
                table.string('user', 120).notNullable();
                table.string('pass').notNullable();
            }))
        }
    })
};

exports.down = function(knex) {
    return(knex.schema.dropTable('usuario'))
};