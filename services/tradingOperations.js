require('dotenv').config();

const axios = require("axios");
const crypto =require("crypto");
const { URLSearchParams } = require('url');
const moment = require('moment');
const { API_URL, environment } = require('./../config/config');
const { SYMBOL, QUANTIDADE } = require('./../config/constants');

let isCompreiBTC = false;

async function newOrder(symbol, quantity, side) {
    const order = { symbol, quantity, side };
    order.type = "MARKET"; //Ordem a vista com preço atual de mercado
    order.timestamp = moment().valueOf(); // Obtém o horário atual usando moment.js

    const orderQueryString = new URLSearchParams(order).toString();

    const signature = crypto
        .createHmac("sha256", process.env.SECRET_KEY)
        .update(orderQueryString)
        .digest("hex");

    order.signature = signature;

    try {
        const {data} = await axios.post(
            `${API_URL}/api/v3/order`, 
            new URLSearchParams(order).toString(), 
            {
                headers: { "X-MBX-APIKEY": process.env.API_KEY }
            }
        ); 

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
