-- Database: s3c_db_dev

-- DROP DATABASE s3c_db_dev;

CREATE DATABASE s3c_db_dev
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE s3c_db_dev
    IS 'Syna3C development postgres database';