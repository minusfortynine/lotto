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

// set up http server
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(lotto(6, 45).toString()); // call lotto function with 6 aus 45 and output lucky numbers to web
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`); // log to console
});