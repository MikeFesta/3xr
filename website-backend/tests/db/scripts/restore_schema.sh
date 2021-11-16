#!/usr/bin/env bash
echo "Restoring database schema"
psql -U postgres -c "CREATE DATABASE ${DBNAME}"
pg_restore -v -d ${DBNAME} /tmp/${FILE} > /tmp/log
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${DBNAME} TO postgres"
echo "Database restored successfully"