const { getApiUrl } = require('../../config/config');


describe('getApiUrl', () => {
  test('Deve retornar URL testnet para ambiente de teste', () => {
    const url = getApiUrl('teste');
    expect(url).toBe('https://testnet.binance.vision');
  });

  test('Deve retornar URL de produção para ambiente de produção', () => {
    const url = getApiUrl('producao');
    expect(url).toBe('https://api.binance.com');
  });

  test('Deve retornar URL de produção para ambiente desconhecido', () => {
    const url = getApiUrl('unknown');
    expect(url).toBe('https://api.binance.com');
  });
});
