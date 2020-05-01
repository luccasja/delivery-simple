// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      database: 'deliverydb',
      user:     'deliverydb',
      password: 'deliveryapp',
      host:'mysql669.umbler.com',
      port:41890
    },
    pool: {
      min: 0,
      max: 25
    },
    migrations: {
      directory: './src/database/migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      database: 'deliverydb',
      user:     'deliverydb',
      password: 'deliveryapp',
      host:'mysql669.umbler.com',
      port:41890
    },
    pool: {
      min: 0,
      max: 25
    },
    migrations: {
      directory: './src/database/migrations'
    }
  }

};
