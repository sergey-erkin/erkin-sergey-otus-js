function sum(addendum) {
  this.amount = this.amount || 0;

  if (!addendum)
    return this.amount;

  this.amount += Number(addendum);
  return sum;
}

console.log(sum(1)(2)(3)(4)(5)(6)());