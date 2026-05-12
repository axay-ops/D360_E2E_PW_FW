import { authTest } from './auth.fixture';
import { mongodbTest } from './mongodb.fixture';
import { mergeTests, expect, APIResponse } from '@playwright/test';


// 1. Merge all specialized test extensions
export const test = mergeTests(authTest, mongodbTest);

// 2. Re-export expect from here
export { expect }; 

export type {APIResponse };