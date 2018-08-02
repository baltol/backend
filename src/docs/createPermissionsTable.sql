-- Table: public."Permissions"

-- DROP TABLE public."Permissions";

CREATE TABLE public."Permissions"
(
    "CreateEvents" boolean NOT NULL DEFAULT false,
    "CreateSubEvents" boolean NOT NULL DEFAULT false,
    "CreateThreads" boolean NOT NULL DEFAULT false,
    "CreateOrganizers" boolean NOT NULL DEFAULT false,
    "CreateModerators" boolean NOT NULL DEFAULT false,
    "EditOrganizers" boolean NOT NULL DEFAULT false,
    "EditModerators" boolean NOT NULL DEFAULT false,
    "EditEvents" boolean NOT NULL DEFAULT false,
    "EditSubEvents" boolean NOT NULL DEFAULT false,
    "EditThreads" boolean NOT NULL DEFAULT false,
    "CloseEvents" boolean NOT NULL DEFAULT false,
    "CloseSubEvents" boolean NOT NULL DEFAULT false,
    "DeleteOrganizer" boolean NOT NULL DEFAULT false,
    "CloseThreads" boolean NOT NULL DEFAULT false,
    "DeleteOrganier" boolean NOT NULL DEFAULT false,
    "DeleteModerators" boolean NOT NULL DEFAULT false,
    "LockThreads" boolean NOT NULL DEFAULT false,
    "EditUsers" boolean NOT NULL DEFAULT false,
    "Role" character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'Regular'::character varying
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Permissions"
    OWNER to postgres;