-- Table: public."Events"

-- DROP TABLE public."Events";

CREATE TABLE public."Events"
(
  "eventId" SERIAL PRIMARY KEY,
  "name" character varying(50) NOT NULL COLLATE pg_catalog."default",
  "description" character varying(200) COLLATE pg_catalog."default",
  "address" character varying(50) NOT NULL COLLATE pg_catalog."default",
  "address2" character varying(50) COLLATE pg_catalog."default",
  "city" character varying(50) NOT NULL COLLATE pg_catalog."default",
  "state" character varying(50) NOT NULL COLLATE pg_catalog."default",
  "zip" character varying(50) NOT NULL COLLATE pg_catalog."default",
  "country" character varying(50) NOT NULL COLLATE pg_catalog."default",
  "gpsLocation" GEOGRAPHY,
  "startDate" timestamp with time zone NOT NULL,
  "endDate" timestamp with time zone NOT NULL,
  "status" character varying(10) COLLATE pg_catalog."default",
  "createdBy" integer NOT NULL,
  "createdOn" timestamp with time zone NOT NULL,
  "lastUpdated" timestamp with time zone NOT NULL,
  FOREIGN KEY ("createdBy") REFERENCES public."Users" ("userId")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."Events"
  OWNER TO "postgres";