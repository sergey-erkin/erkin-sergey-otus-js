"use strict";

async function promiseReduce(asyncFunctions = [], reduce, initialValue = 0) {
  let result = initialValue;
  for (let i = 0; i < asyncFunctions.length; i++)
    try {
      result = reduce(result, await asyncFunctions[i]());
    } catch (e) {
      console.warn(`${asyncFunctions[i].name} failed with ${e}`);
    }
  return Promise.resolve(result);
}


// Test ---------------------

const fn1 = () => {
  console.log('fn1');
  return Promise.resolve(1);
};

const fn2 = () => new Promise(resolve => {
  console.log('fn2');
  setTimeout(() => resolve(2), 500);
});

const fn3 = () => new Promise(() => {
  console.log('fn3');
  throw new Error("Aaa");
});

promiseReduce(
  [fn1, fn2, fn3],
  function(memo, value) {
    console.log('reduce');
    return memo * value;
  },
  4,
).then(console.log);