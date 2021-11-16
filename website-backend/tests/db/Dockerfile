FROM postgres:latest
VOLUME /tmp

COPY ${FILE} /tmp/${FILE}

COPY scripts/restore_schema.sh /docker-entrypoint-initdb.d/restore_schema.sh
RUN sed -i 's/\r$//g' /docker-entrypoint-initdb.d/restore_schema.sh
RUN chmod 777 /docker-entrypoint-initdb.d/restore_schema.sh

EXPOSE 5432