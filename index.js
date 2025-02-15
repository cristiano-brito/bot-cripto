// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

const { getKlines } = require('./services/api');
const { RSI } = require('./services/rsiCalculator');
const { verificarEExecutarOrdemBTC } = require('./services/tradingOperations');
const { SYMBOL, PERIODO, INTERVAL, LIMIT } = require('./config/constants');

async function start() {
    const data = await getKlines(SYMBOL, INTERVAL, LIMIT);
    const vela = data[data.length - 1];
    const lastPrice = parseFloat(vela[4]);

    console.clear();
    console.log('Preco: ' + lastPrice);

    const prices = data.map(k => parseFloat(k[4]));
    const rsi = RSI(prices, PERIODO);
    console.log("RSI: " + rsi);

    verificarEExecutarOrdemBTC(rsi);
}

const pararSetInterval = setInterval(start, 3000);

function stopInterval() {
    clearInterval(pararSetInterval);
    console.log('Intervalo parado.');
}

module.exports = { start, stopInterval };
