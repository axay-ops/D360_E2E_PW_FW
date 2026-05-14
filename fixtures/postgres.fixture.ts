import { test as base } from '@playwright/test';
import { PostgresDbUtil } from '../utils/postgresDbUtil';

export const postgresTest = base.extend<{ postgresDb: PostgresDbUtil }>({
  postgresDb: async ({/* eslint-disable-line no-empty-pattern */}, use) => {
    const postgres = new PostgresDbUtil();
    await postgres.connect();
    if (await postgres.checkConnection()) {
      console.log('PostgreSQL Connection successful');
    }
    await use(postgres);
    await postgres.disconnect();
  },
});
