import { Client, QueryResult } from 'pg';

export class PostgresDbUtil {
  private client: Client;
  private connected: boolean = false;

  constructor() {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
    const database = process.env.DB_NAME;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;

    if (!host || !database || !user || !password) {
      throw new Error('Missing PostgreSQL configuration in environment variables.');
    }

    this.client = new Client({
      host,
      port,
      database,
      user,
      password,
    });
  }

  async connect() {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
    return this;
  }

  async disconnect() {
    if (this.connected) {
      await this.client.end();
      this.connected = false;
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.client.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('PostgreSQL connection failed:', error);
      return false;
    }
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    return await this.client.query(text, params);
  }

  getClient(): Client {
    return this.client;
  }
}

/*
Usage example:

import { PostgresDbUtil } from '../utils/postgresDbUtil';

const postgres = new PostgresDbUtil();
await postgres.connect();

// Simple query
const result = await postgres.query('SELECT * FROM users WHERE id = $1', [1]);
console.log(result.rows);

// Get client for advanced operations
const client = postgres.getClient();
const users = await client.query('SELECT * FROM users LIMIT 10');

await postgres.disconnect();
*/
