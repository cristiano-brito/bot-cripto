// Função para obter a URL da API com base no ambiente
function getApiUrl(env) {
    const urls = {
      teste: "https://testnet.binance.vision",
      producao: "https://api.binance.com"
    };
  
    return urls[env] || urls.producao;
  }
  
  // Definindo o ambiente a partir de uma variável de ambiente ou padrão
  const environment = process.env.NODE_ENV || "producao";
  const API_URL = getApiUrl(environment);
  
  module.exports = { API_URL, environment, getApiUrl };
  