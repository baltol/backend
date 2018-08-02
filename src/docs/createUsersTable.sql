-- Table: public."Users"

-- DROP TABLE public."Users";

CREATE TABLE public."Users"
(
    "UserId" integer NOT NULL DEFAULT nextval('"Users_User_Id_seq"'::regclass),
    "Username" character varying(50) COLLATE pg_catalog."default",
    "Email" character varying(50) COLLATE pg_catalog."default",
    "LastName" character varying(50) COLLATE pg_catalog."default",
    "FirstName" character varying(50) COLLATE pg_catalog."default",
    "CompanyId" integer,
    "AboutMe" character varying(300) COLLATE pg_catalog."default",
    "Role" character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'Regular'::character varying,
    "Password" character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT "Users_pkey" PRIMARY KEY ("UserId")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Users"
    OWNER to postgres;

COMMENT ON COLUMN public."Users"."UserId"
    IS 'An auto incrementing numeric value for the unique id of the user';