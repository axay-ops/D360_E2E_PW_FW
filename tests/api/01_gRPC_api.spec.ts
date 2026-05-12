import { test, expect } from '@playwright/test';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// 1. Load the proto file
        //const PROTO_PATH = path.resolve(__dirname, './service.proto');
        const PROTO_PATH = path.resolve("", './service.proto');
        const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
                });

        const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
        const MyService = protoDescriptor.User;

test.describe('gRPC API Tests', () => {
  let client: any;

  test.beforeAll(() => {
            client = new MyService('localhost:50051', grpc.credentials.createInsecure());   // 2. Initialize the client
        });

  test('TC01: gRPC Unary Call: service should return a successful response', async () => {
    const makeRequest = (payload: object) => {
      return new Promise((resolve, reject) => {
        client.CreateUser(payload, (error: any, response: any) => {
          if (error) reject(error);
          else resolve(response);
        });
      });
    };

    const response: any = await makeRequest({ userId: '12345' });

    // 4. Assertions using Playwright's expect
    expect(response).toBeDefined();
    expect(response.name).toBe('John Doe');
    expect(response.active).toBeTruthy();
  });




test('TC02: gRPC Server Streaming Call: should return a successful response', async () => {
    
    const stream = client.listObstacles({ areaId: 'intersection_1' });

    stream.on('data', (obstacle: any) => {
            expect(obstacle.distance).toBeLessThan(100);    //  Validate each obstacle as it arrives in real-time
        });

    stream.on('end', () => {
            console.log('Stream finished.');
        });

})


test('Validate obstacle stream within range', async () => {
         const stream = client.listObstacles({ areaId: 'intersection_1' });
         let obstacleCount = 0;

    // Wrap the entire stream lifecycle in a Promise
    await new Promise<void>((resolve, reject) => {
        
        // 1. Triggered every time a new message arrives
        stream.on('data', (obstacle: any) => {
                obstacleCount++;
                console.log(`Validating obstacle: ${obstacle.id}`);
                
                // Perform your assertions here
                expect(obstacle.distance).toBeLessThan(100);
                expect(obstacle.type).toBeDefined();
        });

        // 2. Triggered if the connection fails or proto validation fails
        stream.on('error', (err:any) => {
                reject(new Error(`Stream failed: ${err.message}`));
        });

        // 3. Triggered when the server is done sending data
        stream.on('end', () => {
                console.log(`Stream ended. Total obstacles validated: ${obstacleCount}`);
        
            // Optional: Ensure we actually received data
                 if (obstacleCount === 0) {
                    reject(new Error("Stream ended without sending any data!"));
                }
                resolve();
                });
    });
});


}); 

