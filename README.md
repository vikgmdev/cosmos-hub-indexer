# Cosmos Hub Gaia Indexer

The purpose of this project is to store and index Cosmos Hub Gaia data for all transactions after of a block. This data will then be served on an HTTP endpoint as a JSON payload.

- It must serve a `/block/:height` endpoint
- It must serve a `/transaction/:hash` endpoint
- It must serve a `/addresses/:address/txs` endpoint

### Technology Stack

- TypeScript
- NodeJS
- Express
- Knex
- Postgres

### Clone the project

1. Clone the repository:

   ```shell
   git clone https://github.com/vikgmdev/cosmos-hub-indexer.git
   ```

1. Move into the newly created folder:

   ```shell
   cd cosmos-hub-indexer
   ```

### Run the Bitcoin Mainnet Node

1. Build and Run the container:

   ```shell
   cd node
   chmod +x build.sh
   chmod +x mkcontainer.sh
   ./build.sh
   ./mkcontainer.sh
   ```

1. Check the node is running and syncing:

   ```shell
   docker logs -f cosmos-1.0
   ```

1. Download the node and extract to the docker volume

Check more at https://quicksync.io/networks/cosmos.html

### Run the Postgres database

```sh
docker-compose -f docker/docker-compose.yml up -d
```

Verify the DB is running:

```sh
docker ps | grep 'cosmos-db'
docker logs -f exodus-db
```

### Run the API service

Open a terminal and follow the next steps to install the project:

1. Install the project dependencies:

   ```shell
   npm install
   ```

1. [Optional] Create a local `.env` file. This can be used to point the server and set local variables.

   To use `.env.sample` as a starting place, you can copy it to `.env` with the following command:

   ```shell
   cp .env.sample .env
   ```

1. Run Migrations

   ```shell
   npm run db:migrate:latest
   ```

1. Run the service. It auto-updates the
   application as you make changes in the code. To run the project in
   development mode, use the following command:

   ```shell
   npm start
   ```

To verify that the project is running, your terminal should display:

```js
➜ npm run start

> cosmos-hub-indexer@0.0.0 start
> export ENV=dev && npm run serve


> cosmos-hub-indexer@0.0.0 serve
> nodemon -r ts-node/register/transpile-only src/index.ts | pino-pretty

[nodemon] 2.0.22
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts,json
[nodemon] starting `node -r ts-node/register/transpile-only src/index.ts`
[2023-06-09 03:58:14] INFO (API Server/129114): 🚀 API Server up and running in development @ http://localhost:3000
[2023-06-09 03:58:14] DEBUG (API Server/129114): Block indexing starting...
[2023-06-09 03:58:14] INFO (API Server/129114): Indexed block 15643052
[2023-06-09 03:58:14] DEBUG (API Server/129114): Block indexing starting...
[2023-06-09 03:58:14] INFO (API Server/129114): Indexed block 15643053
[2023-06-09 03:58:14] DEBUG (API Server/129114): Block indexing starting...
[2023-06-09 03:58:14] INFO (API Server/129114): Indexed block 15643054
[2023-06-09 03:58:14] DEBUG (API Server/129114): Block indexing starting...
[2023-06-09 03:58:14] INFO (API Server/129114): Indexed block 15643055
```

## API Endpoints

**Query a Block by Height `localhost:3000/block/:height`**

Example:

```shell
curl --location --request GET 'localhost:3000/block/:height
```

Respose:

```json
{
    "height": 15643215,
    "hash": "54138FCD57C52EC7197BB264435205AB0C73AA50E65E5830EA26FC94820A34BD",
    "transactions": [
        {
            "hash": "635EC3AE74881B562DBC2906724AE17FFD2B9531A6A64F7FC02E3D680A4D4D9D",
            "fromAddress": "cosmos1t5u0jfg3ljsjrh2m9e47d4ny2hea7eehxrzdgd",
            "toAddress": "cosmos1s2ew9pkf46smv68d0ustnj0mmhzexectcjhk4d",
            "asset": "uatom",
            "amount": "20175538",
            "memo": null,
            "blockHeight": "15643215"
        }
    ]
}
```

**Query a Transaction by Hash `localhost:3000/transaction/:hash`**

Example:

```shell
curl --location --request GET 'localhost:3000/transaction/:hash
```

Respose:

```json
{
    "hash": "635EC3AE74881B562DBC2906724AE17FFD2B9531A6A64F7FC02E3D680A4D4D9D",
    "fromAddress": "cosmos1t5u0jfg3ljsjrh2m9e47d4ny2hea7eehxrzdgd",
    "toAddress": "cosmos1s2ew9pkf46smv68d0ustnj0mmhzexectcjhk4d",
    "asset": "uatom",
    "amount": "20175538",
    "memo": null,
    "blockHeight": "15643215"
}
```

**Query Transactions by Address `localhost:3000/addresses/:address/txs`**

Example:

```shell
curl --location --request GET 'localhost:3000/addresses/:address/txs
```

Respose:

```json
[
    {
        "hash": "C217B918617F53FBA48A11C882BF2047A4B175D4E3E110C7ABE495B2403F8EC0",
        "fromAddress": "cosmos1t5u0jfg3ljsjrh2m9e47d4ny2hea7eehxrzdgd",
        "toAddress": "cosmos1t5jhugl7w2tlgt3lchwd49l6lzmna03pr322l0",
        "asset": "uatom",
        "amount": 1000000,
        "memo": null,
        "blockHeight": "15639358"
    },
    {
        "hash": "D53FEA55110E540794A8D4E9FC1B624DEC5388BF9076F12061AA41DC5D1052D5",
        "fromAddress": "cosmos1lwcwh3sx4k03hvezvf6xqcf4j94kn6whmk9dr3",
        "toAddress": "cosmos1t5u0jfg3ljsjrh2m9e47d4ny2hea7eehxrzdgd",
        "asset": "uatom",
        "amount": 40997500,
        "memo": null,
        "blockHeight": "15639369"
    },
    ...
]
```

## Scripts

### Database

##### Create a new migration

```bash
npx knex migrate:make [name of migration] --knexfile src/db/knexfile.js
```

##### Migrate to latest

```bash
npm run db:migrate:latest
```

##### Rollback

```bash
npm run db:migrate:rollback
```

## Coding Styles

This project uses TypeScript. While developing, use ESLint and follow the
Airbnb JavaScript Styling Guide. To run the linter and the static type checker,
execute:

```shell
npm run lint
```