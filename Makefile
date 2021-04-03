DOCKER_COMPOSE:=`which docker-compose`
DB_SERVICE:=db
MIGRATION_SERVICE:=skeema
DATABASE_NAME:=cheme_reservation_system

mysql/client:
	${DOCKER_COMPOSE} exec ${DB_SERVICE} mysql -uroot -ppassword ${DATABASE_NAME}

SKEEMA_CMDS:= \
	skeema/push \
	skeema/diff \
	skeema/pull

${SKEEMA_CMDS}:
	${DOCKER_COMPOSE} run --rm ${MIGRATION_SERVICE} skeema -ppassword ${@F} development
