jest.mock('../services/api', () => ({
  getKlines: jest.fn(),
}));

jest.mock('../services/rsiCalculator', () => ({
  RSI: jest.fn(),
}));

jest.mock('../services/tradingOperations', () => ({
  verificarEExecutarOrdemBTC: jest.fn(),
}));

const { getKlines } = require('../services/api');
const { RSI } = require('../services/rsiCalculator');
const { verificarEExecutarOrdemBTC } = require('../services/tradingOperations');
const { SYMBOL, PERIODO, INTERVAL, LIMIT } = require('../config/constants');
const { start, stopInterval } = require('../index');

describe('start', () => {
  let intervalId;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    intervalId = jest.spyOn(global, 'setInterval').mockImplementation((fn, interval) => {
      fn();
      return 1; // Simula um ID de intervalo
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    stopInterval(); // Para o intervalo após cada teste
    jest.useRealTimers();
  });

  test('Deve chamar getKlines com parâmetros corretos', async () => {
    getKlines.mockResolvedValue([
      [
        1739598300000,
        '97640.97000000',
        '97640.97000000',
        '97547.14000000',
        '97611.17000000',
        '17.15748000',
        1739599199999,
        '1674353.65311570',
        647,
        '8.34781000',
        '814614.71565090',
        '0'
      ],
      [
        1739599200000,
        '97611.18000000',
        '97611.39000000',
        '97518.97000000',
        '97545.61000000',
        '7.29116000',
        1739600099999,
        '711378.85284820',
        426,
        '5.55341000',
        '541819.61790990',
        '0'
      ]
    ]);

    await start();
    jest.runOnlyPendingTimers(); // Executa os timers pendentes

    expect(getKlines).toHaveBeenCalledWith(SYMBOL, INTERVAL, LIMIT);
  });

  test('Deve chamar o RSI com parâmetros corretos', async () => {
    const mockData = [
      [
        1739598300000,
        '97640.97000000',
        '97640.97000000',
        '97547.14000000',
        '97611.17000000',
        '17.15748000',
        1739599199999,
        '1674353.65311570',
        647,
        '8.34781000',
        '814614.71565090',
        '0'
      ],
      [
        1739599200000,
        '97611.18000000',
        '97611.39000000',
        '97518.97000000',
        '97545.61000000',
        '7.29116000',
        1739600099999,
        '711378.85284820',
        426,
        '5.55341000',
        '541819.61790990',
        '0'
      ]
    ];
    getKlines.mockResolvedValue(mockData);

    await start();
    jest.runOnlyPendingTimers(); // Executa os timers pendentes

    const expectedPrices = mockData.map(k => parseFloat(k[4])); // Posição 4 para o preço
    expect(RSI).toHaveBeenCalledWith(expectedPrices, PERIODO);
  });

  test('Deve chamar verificarEExecutarOrdemBTC com valor RSI correto', async () => {
    getKlines.mockResolvedValue([
      [
        1739598300000,
        '97640.97000000',
        '97640.97000000',
        '97547.14000000',
        '97611.17000000',
        '17.15748000',
        1739599199999,
        '1674353.65311570',
        647,
        '8.34781000',
        '814614.71565090',
        '0'
      ],
      [
        1739599200000,
        '97611.18000000',
        '97611.39000000',
        '97518.97000000',
        '97545.61000000',
        '7.29116000',
        1739600099999,
        '711378.85284820',
        426,
        '5.55341000',
        '541819.61790990',
        '0'
      ]
    ]);
    RSI.mockReturnValue(49.10074840611913);

    await start();
    jest.runOnlyPendingTimers(); // Executa os timers pendentes

    expect(verificarEExecutarOrdemBTC).toHaveBeenCalledWith(49.10074840611913);
  });
});
