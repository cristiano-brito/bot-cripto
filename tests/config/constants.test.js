const { SYMBOL, PERIODO, QUANTIDADE, INTERVAL, LIMIT } = require('../../config/constants');

test('Deve exportar constantes corretas', () => {
  expect(SYMBOL).toBe('BTCUSDT');
  expect(PERIODO).toBe(14);
  expect(QUANTIDADE).toBe("0.001");
  expect(INTERVAL).toBe("15m");
  expect(LIMIT).toBe(100);
});
