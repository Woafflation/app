.PHONY : build dev test cache start sh

start:
	make build
	make dev
	echo "Let's start :) Open http://localhost:8000/"

build:
	docker-compose build frontend
	make cache

dev:
	docker-compose up -d frontend

test:
	docker-compose up --build test

sh:
	docker-compose run frontend sh

# Extracts node_modules from the image so it is cached in subsequent builds
cache:
	rm -rf .node_modules.tar.gz
	docker-compose run -d frontend sleep 10000
	docker-compose cp frontend:/opt/san/app/node_modules - | gzip -n > .node_modules.tar.gz
	docker-compose stop frontend
