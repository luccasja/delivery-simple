// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: 'deliveryapp',
      user:     'deliveryapp',
      password: 'deliveryapp',
      host:'192.168.0.120',
      port:3306
    },
    pool: {
      min: 0,
      max: 100
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
  }

};
