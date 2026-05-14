import { authTest } from './auth.fixture';
import { mongodbTest } from './mongodb.fixture';
import { postgresTest } from './postgres.fixture';
import { mergeTests, expect, APIResponse } from '@playwright/test';


// 1. Merge all specialized test extensions
export const test = mergeTests(authTest, mongodbTest, postgresTest);

// 2. Re-export expect from here
export { expect }; 

export type {APIResponse };