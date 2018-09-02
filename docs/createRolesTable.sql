-- Table: public."Roles"

-- DROP TABLE public."Roles";

CREATE TABLE public."Roles"
(
  "roleId" SERIAL PRIMARY KEY,
  "roleName" character varying(50) NOT NULL DEFAULT 'Regular'::character varying,
  "createEvents" boolean NOT NULL DEFAULT false,
  "createSubEvents" boolean NOT NULL DEFAULT false,
  "createThreads" boolean NOT NULL DEFAULT false,
  "createOrganizers" boolean NOT NULL DEFAULT false,
  "createModerators" boolean NOT NULL DEFAULT false,
  "editOrganizers" boolean NOT NULL DEFAULT false,
  "editModerators" boolean NOT NULL DEFAULT false,
  "editEvents" boolean NOT NULL DEFAULT false,
  "editSubEvents" boolean NOT NULL DEFAULT false,
  "editThreads" boolean NOT NULL DEFAULT false,
  "closeEvents" boolean NOT NULL DEFAULT false,
  "closeSubEvents" boolean NOT NULL DEFAULT false,
  "deleteOrganizer" boolean NOT NULL DEFAULT false,
  "closeThreads" boolean NOT NULL DEFAULT false,
  "deleteModerators" boolean NOT NULL DEFAULT false,
  "lockThreads" boolean NOT NULL DEFAULT false,
  "editUsers" boolean NOT NULL DEFAULT false
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."Roles"
  OWNER TO postgres;

-- Insert a Regular user by default
INSERT INTO public."Roles"("roleName", "createThreads")
    VALUES ('Regular', true);
