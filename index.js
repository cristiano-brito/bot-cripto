const axios = require("axios");

const SYMBOL = 'BTCUSDT'; 
const PRECO_COMPRA = 34160;
const PRECO_VENDA = 34501;

const API_URL = "https://testnet.binance.vision"; //https://api.binance.com

let isCompreiBTC = false;

async function comprarBTC() {
    console.log("comprar");
}

async function venderBTC() {
    console.log("vender");
}

async function verificarEExecutarOrdemBTC(price) {
    if (price <= PRECO_COMPRA && isCompreiBTC === false) {
        await comprarBTC();
        isCompreiBTC = true;
    } else if (price >= PRECO_VENDA && isCompreiBTC === true) {
        await venderBTC();
        isCompreiBTC = false;
    } else
        console.log('aguardar...');
}

async function start() {
    const {data} = await axios.get(`${API_URL}/api/v3/klines?symbol=${SYMBOL}&interval=1m&limit=21`);
    const vela = data[data.length - 1];
    const price = parseFloat(vela[4]);

    console.clear();
    console.log('Preco: ' + price);

    verificarEExecutarOrdemBTC(price);
}

setInterval(start, 3000);

