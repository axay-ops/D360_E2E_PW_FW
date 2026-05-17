import { test } from '@playwright/test';

test ('Program: Add two Arrays', async() => {

    let num1: number[] = [4, 2, 3, -3, -6, 0, -1];
    let num2: number[] = [4, 2, 3, -3, -6, 0, -1];


})


test ('Remove duplicates from two arrays', async() => {

    let listA: number[] = [-4, 2, 3, -3, -6, 0, -5];
    let listB: number[] = [4, 2, 3, -1, -2, 0, -4];

    
    const uniqueFruits = [...new Set([...listA, ...listB])];
    console.log(uniqueFruits);
    
})
