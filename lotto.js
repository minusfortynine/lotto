// lotto function
function lotto(howMany, outOf) {
    // assign all numbers from 1..outOf
    const numbers = [];
    for (i = 1; i < (outOf + 1); i++) {
    numbers.push(i);
    };

    // pick lucky numbers
    const luckyNumbers = [];
    for (i = 1; i < (howMany + 1); i++) {
    randomNumber = Math.floor(Math.random() *((outOf + 1)-i));
    luckyNumbers.push(numbers[randomNumber]);
    numbers.splice(numbers.indexOf(numbers[randomNumber]), 1);
    }

    // sort lucky numbers
    const luckyNumbersSorted = luckyNumbers.sort(function(a, b){return a - b});
    return luckyNumbersSorted; // output lucky numbers sorted
};

for (let j = 1; j < 4; j++) {
    console.log(lotto(6, 45)); // call lotto function with 6 aus 45
};