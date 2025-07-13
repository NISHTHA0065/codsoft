// Get the display element
const display = document.getElementById('display');
// Get all calculator buttons
const buttons = document.querySelectorAll('.button');

// Variables to store current input and calculation state
let currentInput = '0';
let previousInput = '';
let operator = null;
let waitingForSecondOperand = false;

// Function to update the display
function updateDisplay() {
    display.textContent = currentInput;
}

// Function to clear all input
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

// Function to handle number input
function inputNumber(num) {
    // If waiting for a second operand or display is '0', replace it with the new number
    if (waitingForSecondOperand) {
        currentInput = num;
        waitingForSecondOperand = false;
    } else {
        // Otherwise, append the number to the current input
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

// Function to handle decimal point input
function inputDecimal(dot) {
    // If waiting for a second operand, start a new number '0.'
    if (waitingForSecondOperand) {
        currentInput = '0.';
        waitingForSecondOperand = false;
        updateDisplay();
        return;
    }
    // Only add decimal if it's not already present
    if (!currentInput.includes(dot)) {
        currentInput += dot;
    }
    updateDisplay();
}

// Function to handle operator input
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    // If an operator is already set and we are not waiting for a second operand,
    // it means the user pressed an operator multiple times consecutively.
    // In this case, just update the operator.
    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    // If previous input is null, set current input as previous input
    if (previousInput === '') {
        previousInput = inputValue;
    } else if (operator) {
        // If there's a previous input and an operator, perform the calculation
        const result = calculate(previousInput, inputValue, operator);
        currentInput = String(parseFloat(result.toFixed(7))); // Fix floating point issues and convert to string
        previousInput = result; // Store result as previous input for chaining operations
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
    updateDisplay();
}

// Function to perform the calculation
function calculate(firstOperand, secondOperand, op) {
    if (op === '+') return firstOperand + secondOperand;
    if (op === '-') return firstOperand - secondOperand;
    if (op === '*') return firstOperand * secondOperand;
    if (op === '/') {
        if (secondOperand === 0) {
            // Handle division by zero
            return 'Error';
        }
        return firstOperand / secondOperand;
    }
    return secondOperand; // For cases like initial "=" press without operator
}

// Function to handle equals button
function handleEquals() {
    if (operator === null || waitingForSecondOperand) {
        // If no operator or waiting for second operand, do nothing
        return;
    }

    const inputValue = parseFloat(currentInput);
    let result;
    if (previousInput === 'Error') {
         result = 'Error'; // Propagate error
    } else {
        result = calculate(previousInput, inputValue, operator);
    }


    // Handle specific errors like division by zero
    if (result === 'Error') {
        currentInput = 'Error';
    } else {
        currentInput = String(parseFloat(result.toFixed(7))); // Fix floating point issues and convert to string
    }

    previousInput = ''; // Reset previous input
    operator = null; // Reset operator
    waitingForSecondOperand = false; // Not waiting for operand anymore
    updateDisplay();
}

// Function to toggle positive/negative
function negateNumber() {
    if (currentInput === '0' || currentInput === 'Error') return; // Cannot negate 0 or Error
    currentInput = String(parseFloat(currentInput) * -1);
    updateDisplay();
}

// Add event listeners to all buttons
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        const { value } = event.target.dataset; // For numbers and decimal
        const { action } = event.target.dataset; // For actions like clear, operator, equals

        if (action) {
            // Handle action buttons (clear, operator, equals, negate)
            switch (action) {
                case 'clear':
                    clearAll();
                    break;
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                    handleOperator(action === 'add' ? '+' : action === 'subtract' ? '-' : action === 'multiply' ? '*' : '/');
                    break;
                case 'equals':
                    handleEquals();
                    break;
                case 'negate':
                    negateNumber();
                    break;
            }
        } else if (value) {
            // Handle number and decimal buttons
            if (value === '.') {
                inputDecimal(value);
            } else {
                inputNumber(value);
            }
        }
    });
});

// Initialize display
updateDisplay();
