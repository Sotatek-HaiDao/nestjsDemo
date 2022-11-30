ps:
	docker-compose ps
build:
	docker-compose up -d --build
up:
	docker-compose up -d
down:
	docker-compose down -v
stop:
	docker-compose stop
node:
	docker-compose exec node bash
db:
	docker-compose exec db bash
install:
	docker-compose exec node npm i
dev:
	docker-compose exec node npm run start:dev
buildNest:
	docker-compose exec node npm run build
setup:
	make build
	docker-compose exec node npm i -g @nestjs/cli
	make install
migrationCreate:
	npm run migrate:create $(n)
migrationGen:
	docker-compose exec node npm run migrate:gen $(n)
migrate:
	docker-compose exec node npm run migrate:run
migrationRevert:
	docker-compose exec node npm run migrate:revert
seedConfig:
	docker-compose exec node npm run seed:config
seedRun:
	docker-compose exec node npm run seed:run
seedRunOne:
	docker-compose exec node npm run seed:runOne $(class)
ut:
	docker-compose exec node npm run test
e2e:
	docker-compose exec node npm run test:e2e

installPackageAndBuild:
	npm i && npm run build

startPm2:
	pm2 start npm --name "CFO-API" -- run "start:prod"

installRequire:
	npm i -g pm2 
	apt install curl 
	curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
	source ~/.profile 
	nvm install v13.14.0
	nvm use v13.14.0

pm2Deploy:
	make installRequire
	git pull
	make installPackageAndBuild
	make startPm2

updateSrc:
	git stash 
	git pull
	git stash pop

pm2UpdateSrc:
	make updateSrc
	make installPackageAndBuild
	pm2 restart CFO-API