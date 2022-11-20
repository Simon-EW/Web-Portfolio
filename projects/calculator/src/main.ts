import './style.css';
import Mexp from 'math-expression-evaluator';
import { init } from './currency';

let equation: (string | number)[] = [];
let lastAnswer: string | undefined;
let isSolution = false;

const btnParent = document.querySelector<HTMLDivElement>('#calc-buttons');
const equationElem = document.querySelector<HTMLDivElement>('#equation');

// Checks if the elements required for the calculator to work are present
if (!btnParent || !equationElem) {
  throw new Error('Could not find required elements');
}

// Map of html entities to their unescaped values for use in the calc function
// where html entries cannot be used due to the math evaluator.
const htmlUnEscaped = {
  '&minus;': '-',
  '&plus;': '+',
  '&times;': '*',
  '&divide;': '/',
  '&equals;': '=',
  '&Sqrt;': 'root',
  '&pi;': 'pi',
  '&Hat;': '^',
  '&#178;': '^2',
};

/**
 * Converts html entities to their unescaped values
 * @param str The string to unescape
 * @returns The unescaped html
 * @example
 * htmlUnEscape('&minus;') // returns '-'
 */
const htmlUnEscape = (str: string) => {
  // @ts-ignore
  // Regex will match html entities ex. &minus; by checking for the & and ; characters
  return str.replace(/&[a-zA-Z#1-9]+;/g, m => htmlUnEscaped[m]);
};

/**
 * Calculates the result of the equation using the library math-expression-evaluator
 * from the equation array.
 * @param elem The element to set the result to
 */
const calc = (elem: HTMLDivElement) => {
  let result = 'Error';
  isSolution = true;

  // Convert the equation array to a string with the html entities unescaped by using
  // reduce to iterate over the array and concat the values to a string.
  const htmlEscapedEquation = equation.reduce((acc, curr) => {
    return acc + htmlUnEscape(curr.toString());
  }, '');

  try {
    result = Mexp.eval(htmlEscapedEquation.toString());
  } catch (e) {
    console.error(e);
  }

  // Set the result to the element
  elem.innerHTML = result;

  // Set the variable last answer to the result if its not an error
  lastAnswer = result == 'Error' ? undefined : result;
};

// All the buttons to be added to the calculator
// Please note that the order of the buttons is important
// as it is used to determine the order of the buttons in the calculator.
// Plain strings will just get added to the equation array when clicked
// while objects "run" function will be called when the button is clicked
// and the value key is what gets displayed on the button.
const btns = [
  '10&Hat;', // 10^
  'e&Hat;', // e^
  'asin ',
  'acos ',
  'atan ',
  'log ',
  'ln ',
  'sin ',
  'cos ',
  'tan ',
  '(',
  ')',
  { value: 'x&#178;', run: () => equation.push('&#178;') }, // x^2
  '&Sqrt;',
  '&pi;',
  7,
  8,
  9,
  {
    value: 'DEL',
    run: () => equation.pop(),
  },
  {
    value: 'C',
    run: () => (equation = []),
  },
  4,
  5,
  6,
  '&times;',
  '&divide;',
  1,
  2,
  3,
  '&plus;',
  '&minus;',
  {
    value: '(-)',
    run: () => {
      equation.push('-');
    },
  },
  0,
  '.',
  '&Hat;',
  { value: '&equals;', run: calc },
];

// List of simple operators that will avoid removing the answer from the equation window
// but instead att the operator after it. These are just picked from personal preference.
const simpleOperators = ['&plus;', '&minus;', '&times;', '&divide;', '&Hat;'];

// Add the buttons to the calculator by iterating over the btns array
btns.forEach(btn => {
  // Create a new button element with class calc-btn and add it to the parent element
  const btnElem = document.createElement('button');
  btnElem.classList.add('calc-btn');
  btnParent.appendChild(btnElem);

  // If the button is a object then add the value key to the button and an event listener which calls the run function
  if (typeof btn === 'object') {
    btnElem.innerHTML = btn.value;

    btnElem.addEventListener('click', () => {
      if (isSolution) {
        equation = [];
        isSolution = false;
      }

      btn.run(equationElem);

      if (!isSolution) {
        equationElem.innerHTML = equation.join('');
        // Scroll to the end of the equation by setting the scrollLeft to the scrollWidth
        equationElem.scrollLeft = equationElem.scrollWidth;
      }
    });

    return;
  }
  btnElem.innerHTML = btn.toString();
  btnElem.addEventListener('click', () => {
    if (isSolution) {
      equation = [];
      isSolution = false;
      // If the last answer is defined and the button is a simple operator then add the last answer to the start of the equation
      simpleOperators.includes(btn.toString()) && lastAnswer && equation.push(lastAnswer);
    }
    equation.push(btn);
    equationElem.innerHTML = equation.join('');
    equationElem.scrollLeft = equationElem.scrollWidth;
  });
});

// Initialize the currency converter
const setupCurrency = async () => {
  const currencyForm = document.querySelector<HTMLFormElement>('.currency-select');
  const currencyFromSelector = currencyForm?.querySelector<HTMLSelectElement>('#currency-from-selector');
  const currencyToSelector = currencyForm?.querySelector<HTMLSelectElement>('#currency-to-selector');

  const currency = await init('SEK');

  // Adds an event listener to the form which will convert the currency
  currencyForm?.addEventListener('submit', e => {
    // Prevent the form from submitting and refreshing the page
    e.preventDefault();

    const currencyFrom = currencyForm.querySelector<HTMLSelectElement>('#currency-from-selector')?.value;
    const currencyTo = currencyForm.querySelector<HTMLSelectElement>('#currency-to-selector')?.value;

    let amount;
    // Check if the current string in equation is a solution and if so set it to the amount
    // otherwise calculate the result of the equation and set it to the amount
    if (isSolution && lastAnswer) {
      amount = lastAnswer;
    } else {
      calc(equationElem);
      // If the last answer is undefined then the equation is invalid and we should not convert
      // so set to a which will return later since its not a number
      amount = lastAnswer || 'a';
    }

    // If the amount is not a number then return
    try {
      amount = Number(amount);
    } catch (e) {
      console.error(e);
      return;
    }

    if (!currencyFrom || !currencyTo || !amount) {
      console.error('Could not find currency or amount');
      return;
    }

    const result = currency.convert(amount, currencyFrom, currencyTo);
    equationElem.innerHTML = result.toString();
    // Set last answer to the result so that we can use it later when calculating
    lastAnswer = result.toString();
  });

  // Add the currencies to the select elements as options
  for (const [code, name] of Object.entries(currency.getSymbols())) {
    const option = document.createElement('option');

    option.value = code;
    option.innerHTML = `${code} - ${name}`;

    currencyFromSelector?.appendChild(option);
    // Clone the option and append it to the other select element since we want the same currencies in both
    currencyToSelector?.appendChild(option.cloneNode(true));
  }
};

setupCurrency();
