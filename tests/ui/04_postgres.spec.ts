import { test, expect } from '../../fixtures/base.fixture';

test.describe('PostgreSQL Database Tests', () => {
  test('TC01: should connect to PostgreSQL and execute a simple query', async ({ postgresDb }) => {
    // Verify connection
    const isConnected = await postgresDb.checkConnection();
    expect(isConnected).toBeTruthy();

    // Example: Execute a simple query
    const result = await postgresDb.query('SELECT NOW() as current_time');
    console.log('Current database time:', result.rows[0].current_time);

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].current_time).toBeDefined();
  });

  test('TC02: should query chargepoint table with parameters', async ({ postgresDb }) => {
    // Example with parameterized query
    const chargerId = 'WBAD39G261';
    const result = await postgresDb.query(
      'SELECT * FROM chargepoint WHERE serial_no = $1',
      [chargerId]
    );

    console.log('Charger data:', result.rows);

    // Add your assertions based on expected data
    if (result.rows.length > 0) {
      expect(result.rows[0]).toHaveProperty('id');
    }

    console.log('ID : '+result.rows[0].id);


  });

  test('TC03: should use client for complex operations', async ({ postgresDb }) => {
    // Get the pg client directly for advanced operations
    const client = postgresDb.getClient();

    // Example: Multiple queries
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    console.log('Available tables:', tables.rows.map(row => row.table_name));
    expect(tables.rows).toBeDefined();
  });
});
