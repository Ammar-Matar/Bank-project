'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
const updateUI = (acc) => {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summery
  calcDisplaySummary(acc);
};

//////////////////////////////////////////////////
// Creating DOM Elements 🔴
const displayMovements = (movements, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov} JD</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// console.log(containerMovements.innerHTML);

/////////////////////////////////////////////////////
// The map Method 🔴

const createUserNames = (accs) =>
  accs.forEach(
    (acc) =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map((name) => name[0])
        .join(''))
  );
createUserNames(accounts);

// accounts.forEach((acc, i) => console.log(acc));

/////////////////////////////////////////////////
// The reduce Method 🔴
const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} JD`;
};

/////////////////////////////////////////////////
// The Magic of Chaining Methods 🔴

const calcDisplaySummary = (acc) => {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumIn.innerHTML = `${incomes} JD`;

  const outcomes = Math.abs(
    acc.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.innerHTML = `${outcomes} JD`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((mov, i, a) => {
      return mov >= 1;
    })
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.innerHTML = `${interest} JD`;
  return;
};

////////////////////////////////////////////////
// Implementing Login 🔴
let currentAccount;

btnLogin.addEventListener('click', (e) => {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Claer input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    // Update UI
    updateUI(currentAccount);
  }

  // console.log(currentAccount);
});

////////////////////////////////////////////////
// Implementing Transfers 🔴
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    currentAccount !== reciverAcc
  ) {
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    inputTransferAmount.value = inputTransferTo.value = '';

    // Update UI
    updateUI(currentAccount);
  }
});

//////////////////////////////////////////
// some and every 🔴
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
///////////////////////////////////////////
// The findIndex Method 🔴

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    // indexOf(23);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

////////////////////////////////////////////////
// sorting 🔴

let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount.movements, sorted);
});

/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

////////////////////////////////////////////////
// Simple Array Methods 🔴
// let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

// // SLICE
// console.log(arr.slice(2));
// console.log(arr.slice(2, 3));
// console.log(arr.slice(-3));
// console.log(arr.slice(-1));
// console.log(arr.slice(0, -2));
// console.log(arr.slice(0, -1));

// console.log(arr.slice());
// console.log([...arr]);

// // SPLICE // mutates the array
// // console.log(arr.splice(2));
// console.log(arr.splice(-1));
// console.log(arr);
// arr.splice(2, 2);
// console.log(arr);

// // REVERSE // mutates
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT
// const arr3 = ['k', 'l', 'm', 'n', 'o', 'p'];
// const letters = arr.concat(arr2, arr3);
// console.log(letters);
// console.log([...arr, ...arr2, ...arr3]);

// // JOIN
// console.log(letters.join(' - '));

///////////////////////////////////////////////////
// // The new at Method 🔴

// const arr = [23, 11, 42, 72];
// console.log(arr[0]);
// console.log(arr.at(0));

// // Getting last array element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log('Ammar'.at(2));

/////////////////////////////////////////////////////
// Looping Arrays: forEach 🔴

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   movement > 0
//     ? console.log(`Movement ${i + 1}: You deposited: ${Math.abs(movement)}`)
//     : console.log(`Movement ${i + 1}: You withdrew: ${Math.abs(movement)}`);
// }

// console.log(`----- forEach ------`);

// // can't use breakand continue
// movements.forEach(function (movement, index, array) {
//   movement > 0
//     ? console.log(`Movement ${index + 1}: You deposited: ${Math.abs(movement)}`)
//     : console.log(`Movement ${index + 1}: You withdrew: ${Math.abs(movement)}`);
// });

// // 0: function(200) (movements[0])
// // 1: function(450)
// // 2: function(-400)
// // ...

////////////////////////////////////////////////////
// forEach With Maps and Sets 🔴

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// // for (const [key, value] of currencies.entries()) {
// //   console.log(key, value);
// // }

// // FOREACH loop for (MAPS)
// console.log(`----------- forEach(Maps) -----------`);

// currencies.forEach((value, key, map) => {
//   console.log(`${key}: ${value}`);
// });

// // FOREACH loop for (SETS)
// console.log(`----------- forEach(Sets) ------------`);

// const currenciesUnique = new Set(['US', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach((value, _, set) => {
//   console.log(`${value}: ${_} `);
// });

////////////////////////////////////////////////////
// PROJECT: "Bankist" App 🔴
///////////////////////////////////////////////////
// Coding Challenge #1 🔴

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const juliaDogs1 = [3, 5, 2, 12, 7];
// const KateDogs1 = [4, 1, 15, 8, 3];

// const juliaDogs2 = [9, 16, 6, 8, 3];
// const KateDogs2 = [10, 5, 6, 1, 4];

// const checkDogs = (dogsJulia, dogsKate) => {
//   const dogsJuliaCopy = dogsJulia.slice();
//   dogsJuliaCopy.splice(0, 1);
//   dogsJuliaCopy.splice(-2);
//   const juliaAndKate = dogsJuliaCopy.concat(dogsKate);
//   console.log(juliaAndKate);
//   juliaAndKate.forEach((age, num, arr) => {
//     age >= 3
//       ? console.log(
//           `Dog number ${num + 1} is an adult, and is ${age} years old`
//         )
//       : console.log(`Dog number ${num + 1} is still a puppy 🐶`);
//   });
// };
// checkDogs(juliaDogs1, KateDogs1);
// checkDogs(juliaDogs2, KateDogs2);

/////////////////////////////////////////////////////
// The map Method 🔴

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;

// const movementsUsd = movements.map(
//   (mov, index, arr) => Math.trunc(mov * 1.1)
//   // return 23;
// );
// console.log(movements);
// console.log(movementsUsd);

// const movementsUSDFor = [];
// for (const mov of movements) movementsUSDFor.push(Math.trunc(mov * eurToUsd));
// console.log(movementsUSDFor);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrawal'}: ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescriptions);

///////////////////////////////////////////////////
// The filter Method 🔴
// const deposits = movements.filter(function (mov, i, arr) {
//   return mov > 0;
// });
// const withdrawals = movements.filter((mov, i, arr) => mov < 0);
// console.log(movements);
// console.log(deposits);
// console.log(withdrawals);

// // forEach method
// const withdrawalFor = [];
// const depositFor = [];
// for (const mov of movements) {
//   mov > 0 ? depositFor.push(mov) : withdrawalFor.push(mov);
// }
// console.log(withdrawalFor, depositFor);

/////////////////////////////////////////////////////
// // The reduce Method 🔴
// console.log(movements);
// // const balance = movements.reduce((accumulator, current, i, arr) => {
// //   console.log(`Iteration number ${i}: ${accumulator}`);
// //   return accumulator + current;
// // }, 0);

// const balance1 = movements.reduce((acc, mov, i, arr) => acc + mov);
// console.log(balance1);

// // for-of
// let balance2 = 0;
// for (let mov of movements) balance2 += mov;
// console.log(balance2);

// // Maximum value
// const max = movements.reduce((acc, mov) => (acc > mov ? acc : mov));
// console.log(max);

//////////////////////////////////////////////////
//// Coding Challenge #2 🔴

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const dogsAges = [5, 2, 4, 1, 15, 8, 3];

// const calcAverageHumanAge = (ages) => {
//   const ageDogToHuman = ages.map((age, i) =>
//     age <= 2 ? 2 * age : 16 + age * 4
//   );

//   const adultDogs = ageDogToHuman.filter((age, i) => age >= 18);

//   const avgDogsAge = adultDogs.reduce(
//     (acc, age) => acc + age / adultDogs.length,
//     0
//   );
//   return Math.trunc(avgDogsAge);
// };

// const calcAverageHumanAge = (ages) => {
//   const ageDogsToHuman = ages.map((dogAge) =>
//     dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4
//   );

//   const adultDogs = ageDogsToHuman.filter((dogAge) => dogAge >= 18);

//   const AVG = adultDogs.reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//   return Math.trunc(AVG);
// };

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

//////////////////////////////////////////////////
// // The Magic of Chaining Methods 🔴
// const eurToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter((mov) => mov > 0)
//   .map((deposit) => deposit * eurToUsd)
//   .reduce((acc, money) => acc + money, 0);

// // console.log(totalDepositsUSD);

/////////////////////////////////////////////
// Coding Challenge #3 🔴

// Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

// const calcAverageHumanAge2 = (dogsAge) => {
//   const AVG = dogsAge
//     .map((dogAge) => (dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4))
//     .filter((adults) => adults >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//   return Math.trunc(AVG);
// };
// console.log(calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]));

///////////////////////////////////////////////
// The find Method 🔴

// const firstWithdrawal = movements.find((mov) => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find((acc) => acc.owner === 'Steven Thomas Williams');

// console.log(account);

// let acc;
// for (const accs of accounts) {
//   if (accs.owner === 'Sarah Smith') {
//     acc = accs;
//   }
// }
// console.log(acc);

/////////////////////////////////////////////
// Implementing Login 🔴
////////////////////////////////////////////
// some and every 🔴
// console.log(movements);

// // EQUALITY
// console.log(movements.includes(-130));

// // SOME: CONDITION
// console.log(movements.some((mov) => mov === -130));
// const anyDeposits = movements.some((mov) => mov > 1500);
// console.log(anyDeposits);

// // EVERY
// console.log(movements.every((mov) => mov > 0));
// console.log(account4.movements.every((mov) => mov > 0));

// // Separate callback

// const deposit = (mov) => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

////////////////////////////////////////////////
// flat and flatMap 🔴

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// // Flat

// const overalBalance = accounts
//   .map((acc) => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// // FlatMap

// const overalBalance2 = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance2);

///////////////////////////////////////////////////
//  Sorting Arrays 🔴

// const owners = ['Ammar', 'Jonas', 'Adam', 'Martha', 'Zack'];

// // Strings
// console.log(owners.sort()); // Mutates the original arr
// console.log(owners);

// // Numbers
// console.log(movements);

// // return < 0, A, B (keep order)
// // return > 0, B, A (switch order)

// // Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// console.log(movements);

// movements.sort((a, b) => a - b);
// console.log(movements);
// // Descending
// movements.sort((a, b) => (a > b ? -1 : 1));
// console.log(movements);

// movements.sort((a, b) => b - a);
// console.log(movements);

///////////////////////////////////////////////////
// // More Ways of Creating and Filling Arrays 🔴
// const arr = [1, 2, 3, 4, 5, 6, 7, 8];
// // console.log(new Array(1, 2, 3, 4, 5, 6, 7, 8));

// // Empty Arrays
// const x = new Array(7);
// console.log(x);
// console.log(x.map(() => 5));

// // Fill Method
// // x.fill(5); // mutates
// x.fill(7, 3, 5);
// console.log(x);

// arr.fill(25, 1, 5);
// console.log(arr);

// // Array.from
// const y = Array.from({ length: 8 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 8 }, (_, i) => i + 1);
// console.log(z);

// const i = Array.from({ length: 100 }, () => Math.trunc(Math.random() * 6) + 1);
// console.log(i);

// labelBalance.addEventListener('click', () => {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value')
//   );
//   console.log(
//     movementsUI.map((el) => Number(el.textContent.replace('JD', '')))
//   );
// });

// labelBalance.addEventListener('click', () => {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     (el) => Number(el.textContent.replace('JD', ''))
//   );
//   console.log(movementsUI);

//   const movementUI2 = [...document.querySelectorAll('.movements__value')];
// });

///////////////////////////////////////////////
// Summary: Which Array Method to Use? 🔴

// const arr1 = [[1, 2], 3, 4, 5, 'Ammar', [7, 8, 9]];
// console.log(arr1);
// const arr2 = arr1.flat();
// console.log(arr2);
// const arr3 = arr2.slice(1, 3);
// console.log(arr3);
// console.log(arr2.findIndex((mov) => mov > 2));
// console.log(arr2.find((mov) => mov > 5));
// arr2.forEach((mov) => console.log(mov));

///////////////////////////////////////////////
// Array Methods Practice 🔴

// // 1.
// const bankDepositSum = accounts
//   .flatMap((acc) => acc.movements)
//   .filter((mov) => mov > 0)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(bankDepositSum);

// // 2.
// // const numDeposit1000 = accounts
// //   .flatMap((acc) => acc.movements)
// //   .filter((mov) => mov >= 1000).length;

// const numDeposit1000 = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

// console.log(numDeposit1000);

// // Prefixed ++ operator
// let a = 10;
// console.log(++a);

// // 3.
// const { deposits, withdrawals } = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

// // 4.
// // this is a nice title -> This Is a Nice Title
// const convertTitleCase = (title) => {
//   const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map((word) => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };
// console.log(convertTitleCase(`this is a nice title`));

// console.log(convertTitleCase(`this is a LONG title but not too long`));

// console.log(convertTitleCase(`and here is another title with an EXAMPLE`));

///////////////////////////////////////////////////
// Coding Challenge #4 🔴

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// dogs.forEach((dog) => {
//   // 1.
//   dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);

//   // console.log(dog);
// });

// // 2.

// const sarahsDog = dogs.find((dog) => dog.owners.includes('Sarah'));
// console.log(
//   `Sarah's dog is eating ${
//     sarahsDog.recommendedFood > sarahsDog.curFood ? 'less' : 'more'
//   } than the recommrnded amount of food.`
// );

// // 3.
// const ownersEatTooMuch = dogs
//   .filter((dog) => dog.recommendedFood < dog.curFood)
//   .flatMap((dogsEatTooMuch) => dogsEatTooMuch.owners);
// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//   .filter((dog) => dog.recommendedFood > dog.curFood)
//   .flatMap((dogsEatLittle) => dogsEatLittle.owners);

// console.log(ownersEatTooLittle);

// // 4.

// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// // 5.

// console.log(dogs.some((dog) => dog.curFood === dog.recommendedFood));

// // 6.

// console.log(
//   dogs.some(
//     (dog) =>
//       dog.curFood > dog.recommendedFood * 0.9 &&
//       dog.curFood < dog.recommendedFood * 1.1
//   )
// );

// // 7.

// const okayAmount = dogs.filter(
//   (dog) =>
//     dog.curFood > dog.recommendedFood * 0.9 &&
//     dog.curFood < dog.recommendedFood * 1.1
// );
// console.log(okayAmount);

// // 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

// const dogsSorted = dogs.slice();
// dogsSorted.sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(dogsSorted);

////////////////////////////////////////////////////
///////////////////////////////////////////////////
