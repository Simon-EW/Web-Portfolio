let symbols: { [key: string]: string } = {};
let rates: { [key: string]: number } = {};
let lastUpdated = 0;
let baseCurrency: string;

const baseLink = 'https://api.apilayer.com/exchangerates_data/';
const headers = { apiKey: 'BuAuTBowDnl7VX3q7gX7c4Txpg69s6jj' };

const getCurrencySymbols = async () => {
  try {
    const data = await fetch(baseLink + 'symbols', { headers });
    const json = await data.json();
    if (!json.success) {
      throw new Error('Failed to get currency symbols');
    }
    return json.symbols;
  } catch (e) {
    throw new Error('Failed to get currency symbols');
  }
};

const getCurrencyRates = async () => {
  try {
    const data = await fetch(baseLink + `latest?base=${baseCurrency}`, { headers });
    const json = await data.json();
    if (!json.success) {
      throw new Error('Failed to get currency rates');
    }
    return json;
  } catch (e) {
    throw new Error('Failed to get currency rates');
  }
};

const getCurrencyFromCode = (code: string) => {
  return symbols[code] || code;
};

const getRatesFromCode = (code: string) => {
  return rates[code] || 1;
};

const getRates = () => {
  return rates;
};

const getSymbols = () => {
  return symbols;
};

const convert = (amount: number, from: string, to: string) => {
  if (from === to) {
    return amount;
  }
  if (from === baseCurrency) {
    return amount * rates[to];
  }
  if (to === baseCurrency) {
    return amount / getRatesFromCode(from);
  }
  return (amount * getRatesFromCode(to)) / getRatesFromCode(from);
};

const init = async (currency = 'USD') => {
  baseCurrency = currency;
  symbols = await getCurrencySymbols();
  const ratesData = await getCurrencyRates();
  rates = ratesData.rates;
  lastUpdated = ratesData.timestamp;
};

export default {
  init,
  convert,
  getCurrencyFromCode,
  getRatesFromCode,
  getRates,
  getSymbols,
};
