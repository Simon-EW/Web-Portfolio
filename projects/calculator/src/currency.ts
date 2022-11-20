let symbols: { [key: string]: string } = {};
let rates: { [key: string]: number } = {};
let baseCurrency: string;

// Link to the api
const baseLink = 'https://api.apilayer.com/exchangerates_data/';
// API key
const headers = { apiKey: 'BuAuTBowDnl7VX3q7gX7c4Txpg69s6jj' };

// Fetch the currency symbols from the api
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

// Fetch the rates from the api
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

const getRatesFromCode = (code: string) => {
  return rates[code] || 1;
};

const getRates = () => {
  return rates;
};

const getSymbols = () => {
  return symbols;
};

// Convert the amount from one currency to another
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

// Function to initialize the currency converter with the base currency
// which fetches the symbols and rates and returns the functions available to use
export const init = async (currency = 'USD') => {
  baseCurrency = currency;
  symbols = await getCurrencySymbols();
  const ratesData = await getCurrencyRates();
  rates = ratesData.rates;

  return {
    convert,
    getRatesFromCode,
    getRates,
    getSymbols,
  };
};
