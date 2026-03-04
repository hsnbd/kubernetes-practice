FROM postgres:16-alpine

# Copy initialization scripts
COPY schema.sql /docker-entrypoint-initdb.d/01-schema.sql
COPY seed.sql /docker-entrypoint-initdb.d/02-seed.sql
COPY 03-ads-schema.sql /docker-entrypoint-initdb.d/03-ads-schema.sql
COPY 04-ads-seed.sql /docker-entrypoint-initdb.d/04-ads-seed.sql

# Set default environment variables (can be overridden)
ENV POSTGRES_DB=tododb
ENV POSTGRES_USER=todouser
ENV POSTGRES_PASSWORD=todopass

EXPOSE 5432
