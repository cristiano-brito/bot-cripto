// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

const axios = require("axios");
const { API_URL, environment } = require('./config/config');
const { RSI } = require('./services/rsiCalculator');
const { verificarEExecutarOrdemBTC } = require('./services/tradingOperations');

const SYMBOL = 'BTCUSDT'; 
const PERIODO = 14;

async function start() {
    const { data } = await axios.get(`${API_URL}/api/v3/klines?symbol=${SYMBOL}&interval=15m&limit=100`);
    const vela = data[data.length - 1];
    const lastPrice = parseFloat(vela[4]);

    console.clear();
    console.log('Preco: ' + lastPrice);

    const prices = data.map(k => parseFloat(k[4]));
    const rsi = RSI(prices, PERIODO);
    console.log("RSI: " + rsi);

    verificarEExecutarOrdemBTC(rsi);
}

setInterval(start, 3000);
