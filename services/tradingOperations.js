require('dotenv').config();

const { createOrder } = require('./api');
const moment = require('moment');
const { SYMBOL, QUANTIDADE } = require('./../config/constants');

let isCompreiBTC = false;

async function newOrder(symbol, quantity, side) {
    const order = { symbol, quantity, side };
    order.type = "MARKET"; //Ordem a vista com preço atual de mercado
    order.timestamp = moment().valueOf(); // Obtém o horário atual usando moment.js

    try {
        const data = await createOrder(order, process.env.API_KEY, process.env.SECRET_KEY); 
        console.log(data);
    } 
    catch(err) {
        console.error(err.response.data);
    }
}

async function verificarEExecutarOrdemBTC(rsi) {
    if (rsi < 30 && isCompreiBTC === false) {
        console.log('sobrevendido, hora de comprar');
        isCompreiBTC = true;
        await newOrder(SYMBOL, QUANTIDADE, 'BUY');
    } 
    else if (rsi > 70 && isCompreiBTC === true) {
        console.log('sobrecomprado, hora de vender');
        await newOrder(SYMBOL, QUANTIDADE, 'SELL');
        isCompreiBTC = false;
    } 
    else 
        console.log('aguardar...');
    
}

module.exports = { newOrder, verificarEExecutarOrdemBTC, isCompreiBTC };
