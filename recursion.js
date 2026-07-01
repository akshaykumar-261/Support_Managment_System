// let balance = 1000;
// let lock = Promise.resolve();
// function withdraw(amount) {
//     lock = lock.then(async () => {
//         let currentBalance = balance;
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         balance = currentBalance - amount;
//         console.log(`Withdraw ${amount}, Balance: ${balance}`);
//     });
//     return lock;
// }
// async function main() {
//     await Promise.all([
//         withdraw(100),
//         withdraw(200),
//         withdraw(300),
//     ]);
//     console.log("Final Balance:", balance);
// }
// main();
// for controlling the rase condition we can use 
// Queue / Lock
// Database Transaction
// Atomic Update
// Mutex

import { Mutex } from "async-mutex";
const mutex = new Mutex;
let balance = 1000;
async function withdrow(amount) {
    await mutex.runExclusive(async () => {
        let currentBalance = balance;
        await new Promise(resolve => setTimeout(resolve, 2000));
        balance = currentBalance - amount;
        console.log(`Withdraw ${amount}, Balance: ${balance}`);
    })
}
async function main() {
    await Promise.all([
        withdraw(100),
        withdraw(200),
        withdraw(300),
    ]);
    console.log("Final Balance:", balance);
}

main();