-- Grant all privileges on database to admin user
GRANT ALL PRIVILEGES ON DATABASE postgres TO admin;

-- Grant usage and create privileges on schema public to admin user
GRANT USAGE, CREATE ON SCHEMA public TO admin;

-- Make admin the owner of the public schema
ALTER SCHEMA public OWNER TO admin;

-- Grant all privileges on all tables in public schema to admin user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;

-- Grant all privileges on all sequences in public schema to admin user
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

-- Set default privileges for admin user
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO admin;
