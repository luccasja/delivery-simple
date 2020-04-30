import Knex from 'knex'
import configuration from '../../knexfile'

const connection = Knex(configuration.development)

export default connection