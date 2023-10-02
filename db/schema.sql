-- SQL dump generated using DBML (dbml-lang.org)
-- Database: PostgreSQL
-- Generated at: 2023-10-02T07:29:46.324Z

CREATE TYPE "users_gender_enum" AS ENUM (
  'M',
  'W'
);

CREATE TABLE "users" (
  "user_id" SERIAL PRIMARY KEY NOT NULL,
  "email" varchar(50) NOT NULL,
  "hashed_password" varchar(255) NOT NULL,
  "salt" varchar(255) NOT NULL,
  "nickname" varchar(50) NOT NULL,
  "gender" users_gender_enum NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT (current_timestamp(6)),
  "updated_at" timestamp(6) NOT NULL DEFAULT (current_timestamp(6))
);

CREATE TABLE "sessions" (
  "session_id" char(36) PRIMARY KEY NOT NULL,
  "user_id" int(11) NOT NULL,
  "refresh_token" varchar(255) NOT NULL,
  "user_agent" varchar(255) NOT NULL,
  "client_ip" varchar(255) NOT NULL,
  "is_blocked" tinyint(1) NOT NULL DEFAULT 0,
  "created_at" timestamp(6) NOT NULL DEFAULT (current_timestamp(6))
);

CREATE UNIQUE INDEX "nickname" ON "users" ("nickname");

CREATE UNIQUE INDEX "email" ON "users" ("email");

CREATE INDEX "user_id" ON "sessions" ("user_id");

ALTER TABLE "sessions" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
