# About

The service stores participants and provides methods to manipulate them.

# API

## Overview

| Method                    | Description             | Code |
| ------------------------- |:-----------------------:| ----:|
| POST /participants        | Create a participant    | 201  |
| GET /participants         | Get all participants    | 200  |
| GET /participants/:id     | Get some participant    | 200  |
| PATCH /participants/:id   | Update some participant | 200  |
| DELETE /participants/:id  | Delete a participant    | 200  |

## Model

### Participant

| Field                     | Type                    |
| ------------------------- |:-----------------------:|
| id                        | string                  |
| name                      | string                  |
| birthdate                 | Date                    |
| phoneNumber               | string                  |
| address                   | string                  |

Sample
```json
{
    "name": "Harry Potter",
    "birthdate": "2011-08-12T20:17:46.384Z",
    "phoneNumber": "+44 141 243 2640",
    "address": "44 Howard Street Merchant City, Glasgow G1 4EE Scotland"
}
```

# Start

1. Install [Docker](https://www.docker.com/) if you don't have it yet
2. Run mongo database: `docker-compose up -d`
3. Install `yarn` package manager if you don't have it yet:
    ```
    npm install --global yarn
    ```
   or any other alternative ways which are located on 
   [yarn's official page](https://classic.yarnpkg.com/en/docs/install/#mac-stable).
4. Install Nest.js client globally:
    ```
    yarn global add @nestjs/cli
    ```
5. Install all dependencies: `yarn install`  
6. Run app in the dev. mode: `yarn start:dev`. The app will start on `localhost:3000`.

# Testing

Current code-coverage: 95.89%\
Run tests: `yarn test`

# Design choices and trade-offs

1. Used NoSQL db instead of SQL-like:
    - We don't need complicated relational queries
    - Easier and faster in a testing (in particular, for this environment)
    - However, we have one drawback: we don't have types such as date without time, and we can't
    add additional restrictions like max. length of a property.

2. Model:
    - `id` in the required scenario should be able to support something like this: "KD-123"
    - `name` obviously should be a string
    - `birthdate` is represented as Date. It restricts incorrect input but contains time and timezone. 
    - `phone number` is a string. Because it's usually written in different ways (with -, space, pluses, etc.)
    - `address` - the same as previous

3. Database credentials:
    - Used default `admin` database in order to increase development speed. Not production decision.

4. Unique numbers allocator service should be replaced by a dedicated one. At the current moment, used just 
a temporary one (without easy-to-use identifiers).
    
# Why do we have these dependencies?

* `@nestjs/common` - application framework and related packages for Node.js.
* `@nestjs/core` - *
* `@nestjs/mongoose` - *
* `@nestjs/platform-express` - *
* `mongoose` - provides schema models for interacting with MongoDB.
* `reflect-metadata` - provides the opportunity to use decorators.

# Why do we have these dev dependencies?

* `@nestjs/testing` - provides infrastructure to work test nestjs.
* `@eigenspace/codestyle` - includes lint rules, config for typescript.
* `@eigenspace/common-types` - includes common types.
* `@eigenspace/commit-linter` - linter for commit messages.
* `eslint-plugin-eigenspace-script` - includes set of script linting rules and configuration for them.
* `@types/*` - contains type definitions for specific library.
* `jest` - testing framework to write unit specs (including snapshots).
* `ts-jest` - it lets you use Jest to test projects written in TypeScript.
* `typescript` - is a superset of JavaScript that have static type-checking and ECMAScript features.
    We need 3.8.x+ version because of `Promise.allSettled`.
* `husky` - used for configure git hooks.
* `lint-staged` - used for configure linters against staged git files.
* `cross-env` - used for switching environments between mocks and dev.
* `eslint` - it checks code for readability, maintainability, and functionality errors.
* `nodemon` - starts server with auto update.
* `ts-node` - to run without build typescript.
* `ts-jest` - it lets you use Jest to test projects written in TypeScript.
* `jest` - testing framework to write unit specs (including snapshots).
* `ts-loader` - it's used to load typescript code with webpack.
* `supertest` - provides comfortable API to test services.
* `mongodb-memory-server` - used for running mongodb during tests.
