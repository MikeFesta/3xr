# SPDX-License-Identifier: Apache-2.0
## 3xr.com

This is the code repository for the website 3xr.com, written in node.js

### Docker

This project is designed to be run from Docker.

Alpine is used for filesize and security.

Code Formatting:
Files in /app/ are written in TypeScript and compiled into JavaScript
Files in /views/ are written in PUG
Files in /sass/ are written in Sass (scss)

### Database

#### Migrations

https://sequelize.org/master/manual/migrations.html

##### Creating a new table

Run the following command:

```s
npm run migration:generate -- --name YourModelName
```

This will create a new migration file in `/migrations` folder, with `up` and `down` commands.
Once `up` command is defined (table model), run the following command to create a new table:

```s
npm run migrate:up
```

The `down` command should revert the changes introduced in `up` command.
In order to delete new table, run:

```s
npm run migrate:down
```

#### Updating an existing table

Create a new migration file:

```s
npm run migration:generate -- --name YourModelName
```

Add the `up` and `down` migrations, for example:

```js
module.exports = {
  up: function (queryInterface, Sequelize) {
    // add new column
    return queryInterface.addColumn('tableName', 'columnName', Sequelize.BOOLEAN);
  },

  down: function (queryInterface, Sequelize) {
    // reverting the changes introduced in up method
    return queryInterface.removeColumn('tableName', 'columnName');
  },
};
```

#### Create a seed

This command will create a seed file in seeders folder. File name will look something like `XXXXXXXXXXXXXX-fileName.js`. It follows the same up / down semantics as the migration files.

```s
npm run seed:generate -- --name fileName
```

Run the seed file:

```s
npm run seed:up
```

Undo changes with:

```s
npm run seed:down
```

### E2E Tests

## Setup

Run backend server, Redis and clean database using docker-compose:

```s
docker-compose -f ./docker-compose.e2e.yml up --build
```

During the container build process for `db` service, postgres instance is migrated using postgres schema dump (`/tests/db/scripts/schema.sql`) which creates all tables.

Once all containers have been started, navigate to `/tests/` and run:

```s
npm run seed:e2e
```

to seed the database with initial data (defined in `/tests/seeders/20201203135804-default-e2e.js`)

Before running tests, make sure to create `/tests/cypress.env.json` file with the following contents and appropriate port numbers:

```json
{
  "XR_FRONTEND_URL": "http://localhost:8080",
  "BC_FRONTEND_URL": "http://localhost:8081"
}
```

- If running 3XR frontend app locally, it might need enviroment variable updates to target local 3XR server running as a docker container (by default on port `8000`)
- `BC_SERVER` can be served locally through it's own `docker-compose` file, and `BC_FRONTEND` will need to have it's environment variable set up to point to that address

Once environment variables are set and applied, start cypress runner:

```s
npm run open
```

Cypress runner allows running individual and all test.
Other ways of running tests are defined in `package.json` scripts.
