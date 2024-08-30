// lotto function
function lotto(howMany, outOf) {
    // Create an array of numbers from 1 to outOf
    const numbers = Array.from({ length: outOf }, (_, i) => i + 1);

    // pick lucky numbers
    const luckyNumbers = [];
    for (let i = 1; i < (howMany + 1); i++) {
        const randomNumber = Math.floor(Math.random() * ((outOf + 1) - i));
        luckyNumbers.push(numbers[randomNumber]);
        numbers.splice(numbers.indexOf(numbers[randomNumber]), 1);
    }

    // Sort lucky numbers
    return luckyNumbers.sort((a, b) => a - b);
}

// set up http server
const http = require('http');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // Serve HTML
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>LOTTO PICKER</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 20px; 
                        text-align: center; 
                        background-color: #000000;
                        color: #FFA500; /* Orange */
                    }
                    #results { margin-top: 20px; }
                    #slider-container { 
                        display: flex; 
                        justify-content: center;
                        align-items: center; 
                        gap: 10px; 
                    }
                    .drum-pickers { 
                        display: flex; 
                        justify-content: center;
                        align-items: center; 
                        gap: 20px; 
                        margin-bottom: 20px; 
                    }
                    .drum-picker { 
                        display: flex; 
                        flex-direction: column; 
                        align-items: center; 
                    }
                    .drum-picker button { 
                        font-size: 20px; 
                        width: 30px; 
                        height: 30px; 
                        background-color: #FFA500; /* Orange */
                        color: #000000;
                        border: 1px solid #FFA500; /* Orange */
                        border-radius: 5px; /* This creates rounded corners */
                        cursor: pointer;
                    }
                    .drum-picker button:hover {
                        background-color: #FF8C00; /* Darker orange on hover */
                    }
                    .drum-picker-text {
                        font-size: 18px;
                        margin: 5px 0;
                    }
                    .from-text {
                        font-size: 18px;
                        align-self: center;
                    }
                    table {
                        margin: 0 auto;
                        border-collapse: collapse;
                    }
                    td {
                        border: 1px solid #FFA500; /* Orange */
                        padding: 8px;
                        text-align: center;
                        width: 30px;
                        height: 30px;
                    }
                    .drum-picker-text {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        font-size: 18px;
                    }
                    .drum-picker-text span {
                        min-width: 30px;
                    }
                    input[type="range"] {
                        -webkit-appearance: none;
                        width: 200px; // Doubled from 100px to 200px
                        height: 1px; // Changed to 1px for an extremely thin line
                        background: #CC7000; /* Dark orange */
                        outline: none;
                        opacity: 0.7;
                        -webkit-transition: .2s;
                        transition: opacity .2s;
                        border-radius: 0; // Removed border-radius for a straight line
                    }

                    input[type="range"]:hover {
                        opacity: 1;
                    }

                    input[type="range"]::-webkit-slider-runnable-track {
                        width: 100%;
                        height: 1px;
                        background: #CC7000;
                    }

                    input[type="range"]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 24px;  /* Increased from 20px to 24px (20% larger) */
                        height: 24px; /* Increased from 20px to 24px (20% larger) */
                        background: #FFA500; /* Bright orange for the thumb */
                        cursor: pointer;
                        border-radius: 50%;
                        margin-top: -11.5px; // Adjusted to center the thumb
                    }

                    input[type="range"]::-moz-range-track {
                        width: 100%;
                        height: 1px;
                        background: #CC7000;
                    }

                    input[type="range"]::-moz-range-thumb {
                        width: 24px;  /* Increased from 20px to 24px (20% larger) */
                        height: 24px; /* Increased from 20px to 24px (20% larger) */
                        background: #FFA500; /* Bright orange for the thumb */
                        cursor: pointer;
                        border-radius: 50%;
                        border: none; // Remove default border
                    }

                    input[type="range"]::-ms-track {
                        width: 100%;
                        height: 1px;
                        background: transparent;
                        border-color: transparent;
                        color: transparent;
                    }

                    input[type="range"]::-ms-fill-lower,
                    input[type="range"]::-ms-fill-upper {
                        background: #CC7000;
                    }

                    input[type="range"]::-ms-thumb {
                        width: 24px;
                        height: 24px;
                        background: #FFA500;
                        cursor: pointer;
                        border-radius: 50%;
                        border: none;
                    }

                    /* New rule to set the background to black in Firefox */
                    input[type="range"] {
                        background: #000000;
                    }

                    // ... remaining styles ...
                </style>
            </head>
            <body>
                <h1>LOTTO PICKER</h1>
                <div class="drum-pickers">
                    <div class="drum-picker">
                        <button onclick="updateHowMany(1)">+</button>
                        <div class="drum-picker-text">
                            <span id="howMany">6</span>
                        </div>
                        <button onclick="updateHowMany(-1)">-</button>
                    </div>
                    <span class="from-text">from</span>
                    <div class="drum-picker">
                        <button onclick="updateOutOf(1)">+</button>
                        <div class="drum-picker-text">
                            <span id="outOf">45</span>
                        </div>
                        <button onclick="updateOutOf(-1)">-</button>
                    </div>
                </div>
                <div id="slider-container">
                    <input type="range" id="count-slider" min="1" max="5" value="1">
                    <span id="count-value">1</span>
                </div>
                <div id="results"></div>
                <script>
                    const resultsDiv = document.getElementById('results');
                    const slider = document.getElementById('count-slider');
                    const countValue = document.getElementById('count-value');
                    const howManyElement = document.getElementById('howMany');
                    const outOfElement = document.getElementById('outOf');

                    function updateHowMany(change) {
                        let value = parseInt(howManyElement.textContent) + change;
                        value = Math.max(1, Math.min(value, parseInt(outOfElement.textContent) - 1));
                        howManyElement.textContent = value;
                        updateResults();
                    }

                    function updateOutOf(change) {
                        let value = parseInt(outOfElement.textContent) + change;
                        value = Math.max(parseInt(howManyElement.textContent) + 1, value);
                        outOfElement.textContent = value;
                        updateResults();
                    }

                    function updateResults() {
                        const count = slider.value;
                        const howMany = howManyElement.textContent;
                        const outOf = outOfElement.textContent;
                        countValue.textContent = count;
                        fetch(\`/getLotto?count=\${count}&howMany=\${howMany}&outOf=\${outOf}\`)
                            .then(response => response.json())
                            .then(data => {
                                const table = document.createElement('table');
                                
                                data.forEach((result) => {
                                    const row = table.insertRow();
                                    result.split(', ').forEach(number => {
                                        const cell = row.insertCell();
                                        cell.textContent = number;
                                    });
                                });
                                
                                resultsDiv.innerHTML = '';
                                resultsDiv.appendChild(table);
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                resultsDiv.innerHTML = 'Error fetching results';
                            });
                    }

                    slider.addEventListener('input', updateResults);
                    updateResults(); // Initial load
                </script>
            </body>
            </html>
        `);
    } else if (req.url.startsWith('/getLotto')) {
        // Handle lotto requests
        const url = new URL(req.url, `http://${req.headers.host}`);
        const count = parseInt(url.searchParams.get('count') || '1');
        const howMany = parseInt(url.searchParams.get('howMany') || '6');
        const outOf = parseInt(url.searchParams.get('outOf') || '45');
        const results = Array.from({ length: count }, () => lotto(howMany, outOf).join(', '));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`); // log to console
});