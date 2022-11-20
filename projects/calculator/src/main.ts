import './style.css';
import Mexp from 'math-expression-evaluator';
import currency from './currency';

let equation: (string | number)[] = [];
let lastAnswer: string | undefined;
let isSolution = false;

const btnParent = document.querySelector<HTMLDivElement>('#calc-buttons');
const equationElem = document.querySelector<HTMLDivElement>('#equation');
const dummyElement = document.querySelector('#dummy-item');
const currencySelector = document.querySelector<HTMLSelectElement>('#currency-selector');

if (!btnParent || !equationElem || !dummyElement || !currencySelector) {
  throw new Error('Could not find required elements');
}

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

const htmlUnEscape = (str: string) => {
  // @ts-ignore
  return str.replace(/&[a-zA-Z#1-9]+;/g, m => htmlUnEscaped[m]);
};

const calc = (elem: HTMLDivElement) => {
  console.log(elem.innerHTML);
  let result = 'Error';
  isSolution = true;

  console.log(equation);

  const htmlEscapedEquation = equation.reduce((acc, curr) => {
    return acc + htmlUnEscape(curr.toString());
  }, '');
  try {
    result = Mexp.eval(htmlEscapedEquation.toString());
  } catch (e) {
    console.error(e);
  }
  elem.innerHTML = result;
  lastAnswer = result == 'Error' ? undefined : result;
};

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
  '&divide;', // ÷
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

const simpleOperators = ['&plus;', '&minus;', '&times;', '&divide;', '&Hat;'];

btns.forEach(btn => {
  const btnElem = document.createElement('button');
  btnElem.classList.add('calc-btn');
  btnParent.appendChild(btnElem);
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
        dummyElement.scrollIntoView();
      }
    });

    return;
  }
  btnElem.innerHTML = btn.toString();
  btnElem.addEventListener('click', () => {
    if (isSolution) {
      equation = [];
      isSolution = false;
      simpleOperators.includes(btn.toString()) && lastAnswer && equation.push(lastAnswer);
    }
    equation.push(btn);
    equationElem.innerHTML = equation.join('');
    dummyElement.scrollIntoView();
  });
});
