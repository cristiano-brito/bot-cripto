const { RSI } = require('../../services/rsiCalculator');

describe('RSI Calculator', () => {
    test('Deve calcular o valor correto do RSI para determinados preços e período', () => {
      const prices = [
        45.33, 46.12, 46.25, 46.28, 46.60,
        46.45, 46.38, 46.75, 46.78, 47.00,
        46.55, 46.25, 45.75, 45.32, 44.56
      ];
      const periodo = 14;
      const expectedRSI = 28.564448794560718; // Valor esperado de RSI para validação
      const calculatedRSI = RSI(prices, periodo);
      expect(calculatedRSI).toBeCloseTo(expectedRSI, 5); // Usa uma precisão de 5 casas decimais
    });
  
    test('Deve lidar com casos onde a matriz de preços é menor que o período', () => {
        const prices = [45.33, 46.12, 46.25];
        const periodo = 14;
        const calculatedRSI = RSI(prices, periodo);
        expect(calculatedRSI).toBe(100); // Deve retornar 100 quando o array de preços é menor que o período
      });
  
    test('Deve retornar 100 quando mediasDePerdas for zero', () => {
      const prices = [
        45.33, 46.33, 47.33, 48.33, 49.33,
        50.33, 51.33, 52.33, 53.33, 54.33,
        55.33, 56.33, 57.33, 58.33, 59.33
      ];
      const periodo = 14;
      const expectedRSI = 100;
      const calculatedRSI = RSI(prices, periodo);
      expect(calculatedRSI).toBe(expectedRSI); // Deve retornar 100 quando não há perdas
    });
  });
