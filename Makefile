up:
	docker-compose up -d

PSQL = docker-compose exec postgres psql -U postgres
psql:
	$(PSQL) $(ARGS)

init:
	$(PSQL) -c "CREATE DATABASE ci;"
	docker exec -i $(docker-compose ps -q postgres) psql -U postgres ci < schema.sql

dev-server:
	yarn run webpack-dev-server client.js bundle.js
