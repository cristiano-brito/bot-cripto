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
    return { mediasDeGanhos, mediasDePerdas };
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

module.exports = { RSI };
