const axios = require("axios");
const crypto = require("crypto");
const { API_URL } = require('./../config/config');

async function getKlines(symbol, interval, limit) {
    try {
        const response = await axios.get(`${API_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao obter dados de candles:", error.message);
        throw error;
    }
}

async function createOrder(order, apiKey, secretKey) {
    try {
        const orderQueryString = new URLSearchParams(order).toString();
        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(orderQueryString)
            .digest("hex");

        order.signature = signature;

        const { data } = await axios.post(
            `${API_URL}/api/v3/order`, 
            orderQueryString, 
            {
                headers: { "X-MBX-APIKEY": apiKey }
            }
        );

        return data;
    } catch (error) {
        console.error("Erro ao criar ordem:", error.message);
        throw error;
    }
}

module.exports = { createOrder, getKlines };
