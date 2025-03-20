const { defineConfig } = require("cypress");
const pgp = require("pg-promise")

const connectionString = `postgres://hdstmevents:Passw0rd!@localhost:5432/hdstmevents?pool_max_conns=10`
const db = pgp()(connectionString)

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        db({ query, values }) {
          return db.any(query, values);
        },
      });
    },
    baseUrl: 'http://localhost:8081'
  },
});
