# Hai Web

# Getting Started

## Server Requirements

- Node.js (>= 10.13.0, except for v13)
- Mysql 8
- Redis (latest)

## Installing preparation

1. Default Application $BASEPATH : `/home/app.user/hai`

2. Copy the .env file from .env.example under $BASEPATH, fill your config in .env file instead of example config

# Build the app

## Installation

```bash
  npm install
```

## Migrate database
### Generate migration file
```bash
  npm run migrate:gen [migration_name]
```
### Run build the app
```bash
  npm run build
```
### Migrate
```bash
  npm run migrate:run
```

## Seed

```bash
# load configs
$ npm run seed:config

# run seed
$ npm run seed:run
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Build with Docker

## Setup

```bash
  make setup
```

## Migrate database

```bash
  make migrate
```

## Running the app (watch)

```bash
  make dev
```

## Running the test
1. Unit test
```bash
  npm run test
```
2. End-to-end testing
```bash
  npm run test:e2e
```

