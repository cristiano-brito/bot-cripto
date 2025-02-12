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
    } else {
        console.log('aguardar...');
    }
}

module.exports = { comprarBTC, venderBTC, verificarEExecutarOrdemBTC, isCompreiBTC };
