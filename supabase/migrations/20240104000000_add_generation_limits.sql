alter table "public"."profiles" add column "daily_generation_count" integer not null default 0;

alter table "public"."profiles" add column "last_generation_date" date not null default CURRENT_DATE;
