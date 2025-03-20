#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER hdstmevents WITH PASSWORD 'Passw0rd!';
	CREATE DATABASE hdstmevents;
	GRANT ALL PRIVILEGES ON DATABASE hdstmevents TO hdstmevents;
  ALTER DATABASE hdstmevents OWNER TO hdstmevents;

	CREATE USER openplanetsnake WITH PASSWORD 'Passw0rd!';
	CREATE DATABASE openplanetsnake;
	GRANT ALL PRIVILEGES ON DATABASE openplanetsnake TO openplanetsnake;
  ALTER DATABASE openplanetsnake OWNER TO openplanetsnake;

  CREATE USER tmapi WITH PASSWORD 'Passw0rd!';
	CREATE DATABASE tmapi;
	GRANT ALL PRIVILEGES ON DATABASE tmapi TO tmapi;
  ALTER DATABASE tmapi OWNER TO tmapi;

  CREATE USER tmmedals WITH PASSWORD 'Passw0rd!';
	CREATE DATABASE tmmedals;
	GRANT ALL PRIVILEGES ON DATABASE tmmedals TO tmmedals;
  ALTER DATABASE tmmedals OWNER TO tmmedals;
EOSQL
