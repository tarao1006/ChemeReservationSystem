DOCKER_COMPOSE:=`which docker-compose`
DB_SERVICE:=db
MIGRATION_SERVICE:=skeema
DATABASE_NAME:=cheme_reservation_system

ping:
	curl http://localhost:8000/ping

mysql/client:
	${DOCKER_COMPOSE} exec ${DB_SERVICE} mysql -uroot -ppassword ${DATABASE_NAME}

SKEEMA_CMDS:= \
	skeema/push \
	skeema/diff \
	skeema/pull

skeema/init:
	${DOCKER_COMPOSE} run --rm ${MIGRATION_SERVICE} skeema init -h ${DB_SERVICE} -uroot -ppassword -d db

${SKEEMA_CMDS}:
	${DOCKER_COMPOSE} run --rm ${MIGRATION_SERVICE} skeema -ppassword ${@F} development
