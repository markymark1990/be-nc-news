const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

console.log(`Loading environment variables for ${ENV} environment`);

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

console.log(`PGDATABASE: ${process.env.PGDATABASE}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

const config = {};

if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2; 
}

console.log(`Database configuration: ${JSON.stringify(config)}`);

module.exports = new Pool(config);
