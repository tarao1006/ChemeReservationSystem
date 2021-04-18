DOCKER_COMPOSE:=`which docker-compose`
DB_SERVICE:=db
MIGRATION_SERVICE:=skeema
DATABASE_NAME:=cheme_reservation_system

ENV_TEST_FILE:=.env.test
ENV_TEST:=${shell cat ${ENV_TEST_FILE}}

env:
	cp -i .env.sample .env

test:
	cd backend && ${ENV_TEST} go test ./... -v

ping:
	curl http://localhost:8000/ping

mysql/client:
	${DOCKER_COMPOSE} exec ${DB_SERVICE} mysql -uroot -ppassword ${DATABASE_NAME}

mysql/bash:
	${DOCKER_COMPOSE} exec ${DB_SERVICE} /bin/bash

mysql/reset:
	${DOCKER_COMPOSE} exec ${DB_SERVICE} /reset

SKEEMA_CMDS:= \
	skeema/push \
	skeema/diff \
	skeema/pull

skeema/init:
	${DOCKER_COMPOSE} run --rm ${MIGRATION_SERVICE} skeema init -h ${DB_SERVICE} -uroot -ppassword -d db

${SKEEMA_CMDS}:
	${DOCKER_COMPOSE} run --rm ${MIGRATION_SERVICE} skeema -ppassword ${@F} development

skeema/push/unsafe:
	${DOCKER_COMPOSE} run --rm ${MIGRATION_SERVICE} skeema -ppassword push --allow-unsafe development
