'use strict';

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

function promiseReduce2(asyncFunctions = [], reduce, initialValue = 0) {
  let promise = Promise.resolve(initialValue);
  asyncFunctions.forEach(
    fun => promise = promise.then(
      async sum => {
        try {
          return reduce(sum, await fun());
        } catch (e) {
          console.warn(`${fun.name} failed with ${e}`);
          return sum;
        }
      }
    )
  );
  return promise;
}

async function promiseReduce3(asyncFunctions = [], reduce, initialValue = 0) {
  return asyncFunctions.reduce(
    (promise, fun) => promise.then(
      async sum => {
        try {
          return reduce(sum, await fun());
        } catch (e) {
          console.warn(`${fun.name} failed with ${e}`);
          return sum;
        }
      }
    ),
    Promise.resolve(initialValue)
  );
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
  throw new Error('Aaa');
});

const fn4 = () => new Promise(resolve => {
  console.log('fn4');
  setTimeout(() => resolve(5), 500);
});

promiseReduce3(
  [fn1, fn2, fn3, fn4],
  function(memo, value) {
    console.log('reduce');
    return memo * value;
  },
  4,
).then(console.log);