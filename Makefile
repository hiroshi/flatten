up:
	docker-compose up -d

PSQL = docker-compose exec postgres psql -U postgres
psql:
	$(PSQL) $(ARGS)

init:
	$(PSQL) -c "CREATE DATABASE ci;"
