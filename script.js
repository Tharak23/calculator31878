const display = document.getElementById('display');
let current = '0';
let operator = null;
let operand = null;
let resetNext = false;
let history = [];
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

function updateDisplay() {
    display.textContent = current;
}

function updateHistory() {
    historyList.innerHTML = '';
    if (history.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No history';
        li.style.color = '#888';
        historyList.appendChild(li);
        return;
    }
    history.slice().reverse().forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

function addToHistory(expression, result) {
    history.push(`${expression} = ${result}`);
    if (history.length > 10) history.shift();
    updateHistory();
}

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', function() {
        history = [];
        updateHistory();
    });
}

function inputNumber(num) {
    if (resetNext) {
        current = num;
        resetNext = false;
    } else {
        if (current === '0') {
            current = num;
        } else {
            current += num;
        }
    }
    updateDisplay();
}

function inputDot() {
    if (resetNext) {
        current = '0.';
        resetNext = false;
    } else if (!current.includes('.')) {
        current += '.';
    }
    updateDisplay();
}

function clearAll() {
    current = '0';
    operator = null;
    operand = null;
    resetNext = false;
    updateDisplay();
}

function backspace() {
    if (resetNext) return;
    if (current.length > 1) {
        current = current.slice(0, -1);
    } else {
        current = '0';
    }
    updateDisplay();
}

function inputOperator(op) {
    if (operator && !resetNext) {
        calculate();
    }
    operand = parseFloat(current);
    operator = op;
    resetNext = true;
}

function calculate() {
    if (operator === null || resetNext) return;
    let result;
    const curr = parseFloat(current);
    let expression = `${operand} ${operator} ${curr}`;
    switch (operator) {
        case '+':
            result = operand + curr;
            break;
        case '-':
            result = operand - curr;
            break;
        case '*':
            result = operand * curr;
            break;
        case '/':
            result = curr === 0 ? 'Error' : operand / curr;
            break;
        default:
            return;
    }
    current = result.toString();
    operator = null;
    operand = null;
    resetNext = true;
    updateDisplay();
    if (result !== 'Error') addToHistory(expression.replace('*', '×').replace('/', '÷'), current);
}

function percent() {
    current = (parseFloat(current) / 100).toString();
    updateDisplay();
}

function handleButton(e) {
    const action = e.target.getAttribute('data-action');
    if (!action) return;
    if (!isNaN(action)) {
        inputNumber(action);
    } else if (action === 'dot') {
        inputDot();
    } else if (action === 'clear') {
        clearAll();
    } else if (action === 'backspace') {
        backspace();
    } else if (action === 'percent') {
        percent();
    } else if (action === 'add') {
        inputOperator('+');
    } else if (action === 'subtract') {
        inputOperator('-');
    } else if (action === 'multiply') {
        inputOperator('*');
    } else if (action === 'divide') {
        inputOperator('/');
    } else if (action === 'equals') {
        calculate();
    }
}

document.querySelector('.buttons').addEventListener('click', handleButton);
updateDisplay();
window.addEventListener('DOMContentLoaded', updateHistory);