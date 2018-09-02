-- Table: public."Users"

-- DROP TABLE public."Users";

CREATE TABLE public."Users"
(
    "userId" SERIAL PRIMARY KEY,
    "username" character varying(50) NOT NULL COLLATE pg_catalog."default",
    "email" character varying(50) NOT NULL COLLATE pg_catalog."default",
    "lastName" character varying(50) COLLATE pg_catalog."default",
    "firstName" character varying(50) COLLATE pg_catalog."default",
    "companyId" integer,
    "aboutMe" character varying(300) COLLATE pg_catalog."default",
    "roleId" integer NOT NULL,
    "password" character varying(100) NOT NULL COLLATE pg_catalog."default",
    FOREIGN KEY ("roleId") REFERENCES public."Roles" ("roleId")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Users"
    OWNER to postgres;