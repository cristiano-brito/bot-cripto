require('dotenv').config();

const axios = require("axios");
const { API_URL, environment } = require('./config/config');

const SYMBOL = 'BTCUSDT'; 
const PERIODO = 14;

let isCompreiBTC = false;

async function comprarBTC() {
    console.log("comprar");
}

async function venderBTC() {
    console.log("vender");
}

function verificarEExecutarOrdemBTC(rsi) {
    if (rsi < 30 && isCompreiBTC === false) {
        console.log('sobrevendido, hora de comprar');
        comprarBTC();
        isCompreiBTC = true;
    } else if (rsi > 70 && isCompreiBTC === true) {
        console.log('sobrecomprado, hora de vender');
        venderBTC();
        isCompreiBTC = false;
    } else
        console.log('aguardar...');
}

function medias(prices, periodo, startIndex) {
    let ganhos = 0, perdas = 0;

    for (let i = 0; i < periodo && (i + startIndex) < prices.length; i++) {
        const diferenca = prices[i + startIndex] - prices[i + startIndex - 1];

        if(diferenca >= 0)
            ganhos += diferenca;
        else
        perdas += Math.abs(diferenca);
    }
    
    let mediasDeGanhos = ganhos / periodo;
    let mediasDePerdas = perdas / periodo;
    return { mediasDeGanhos, mediasDePerdas }
}

function RSI(prices, periodo) {
    let mediasDeGanhos = 0, mediasDePerdas = 0;

    for (let i = 1; i < prices.length; i++) {
        let novasMedias = medias(prices, periodo, i);
        
        if(i === 1) {
            mediasDeGanhos = novasMedias.mediasDeGanhos;
            mediasDePerdas = novasMedias.mediasDePerdas;
            continue;
        }

        mediasDeGanhos = (mediasDeGanhos * (periodo - 1) + novasMedias.mediasDeGanhos) / periodo;
        mediasDePerdas = (mediasDePerdas * (periodo - 1) + novasMedias.mediasDePerdas) / periodo;
    }

    const rs = mediasDeGanhos / mediasDePerdas;
    return 100 - (100 / (1 + rs));
}

async function start() {
    const {data} = await axios.get(`${API_URL}/api/v3/klines?symbol=${SYMBOL}&interval=15m&limit=100`);
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

