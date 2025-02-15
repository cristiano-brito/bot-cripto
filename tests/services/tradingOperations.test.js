jest.mock('../../services/api', () => ({
    createOrder: jest.fn(),
  }));
  
  const moment = require('moment');
  const { createOrder } = require('../../services/api');
  const { SYMBOL, QUANTIDADE } = require('../../config/constants');
  const tradingOperations = require('../../services/tradingOperations');
  const { newOrder, verificarEExecutarOrdemBTC, isCompreiBTC } = tradingOperations;
  
  describe('Trading Operations', () => {
    afterEach(() => {
      jest.clearAllMocks();
      tradingOperations.isCompreiBTC = false; // Reset isCompreiBTC after each test
    });
  
    describe('newOrder', () => {
      test('Deve criar um novo pedido com parâmetros corretos', async () => {
        const symbol = SYMBOL;
        const quantity = QUANTIDADE;
        const side = 'BUY';
        const mockData = { orderId: 1 };
        const currentTime = moment().valueOf();
        
        createOrder.mockResolvedValue(mockData);
        
        await newOrder(symbol, quantity, side);
        expect(createOrder).toHaveBeenCalledWith(
          {
            symbol,
            quantity,
            side,
            type: 'MARKET',
            timestamp: expect.any(Number), // Verificação do timestamp
          },
          process.env.API_KEY,
          process.env.SECRET_KEY
        );
      });
  
      test('Deve registrar um erro quando a criação do pedido falhar', async () => {
        const symbol = SYMBOL;
        const quantity = QUANTIDADE;
        const side = 'BUY';
        const mockError = { response: { data: 'Order Error' } };
  
        createOrder.mockRejectedValue(mockError);
  
        console.error = jest.fn();
  
        await newOrder(symbol, quantity, side);
        expect(console.error).toHaveBeenCalledWith('Order Error');
      });
    });
  
    describe('verificarEExecutarOrdemBTC', () => {
      test('Deve executar uma ordem de COMPRA quando o RSI estiver abaixo de 30 e isCompreiBTC for falso', async () => {
        const rsi = 25;
        createOrder.mockResolvedValue({ orderId: 1 });
  
        await verificarEExecutarOrdemBTC(rsi);
        expect(createOrder).toHaveBeenCalledWith(
          {
            symbol: SYMBOL,
            quantity: QUANTIDADE,
            side: 'BUY',
            type: 'MARKET',
            timestamp: expect.any(Number), // Verificação do timestamp
          },
          process.env.API_KEY,
          process.env.SECRET_KEY
        );
        expect(tradingOperations.isCompreiBTC).toBe(false); // Verificação de isCompreiBTC
      });
  
      test('Deve executar uma ordem de VENDA quando o RSI estiver acima de 70 e isCompreiBTC for verdadeiro', async () => {
        const rsi = 75;
        tradingOperations.isCompreiBTC = true; // Ajuste para isCompreiBTC
        createOrder.mockResolvedValue({ orderId: 1 });
  
        await verificarEExecutarOrdemBTC(rsi);
        expect(createOrder).toHaveBeenCalledWith(
          {
            symbol: SYMBOL,
            quantity: QUANTIDADE,
            side: 'SELL',
            type: 'MARKET',
            timestamp: expect.any(Number), // Verificação do timestamp
          },
          process.env.API_KEY,
          process.env.SECRET_KEY
        );
        expect(tradingOperations.isCompreiBTC).toBe(true); // Verificação de isCompreiBTC
      });
  
      test('Não deve executar nenhuma ordem quando o RSI estiver entre 30 e 70', async () => {
        const rsi = 50;
        console.log = jest.fn();
  
        await verificarEExecutarOrdemBTC(rsi);
        expect(createOrder).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('aguardar...');
      });
    });
  });
  