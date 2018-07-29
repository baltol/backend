  export const config = {
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'YOUR_secret_key',
    port: process.env.PORT || 4001,
    postgresUri: process.env.POSTGRES_URI ||
      process.env.POSTGRES_HOST ||
      'postgres://' + (process.env.IP || 'localhost') + ':' +
      (process.env.POSTGRES_PORT || '5423') +
      '/s3c_db_dev'
  };
