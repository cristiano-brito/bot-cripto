const axios = require('axios');
const crypto = require('crypto');
const { API_URL } = require('./../../config/config');
const { getKlines, createOrder } = require('../../services/api');

// Mock do axios
jest.mock('axios');
jest.mock('crypto');

describe('API Service', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getKlines', () => {
      test('Deve buscar dados de klines com parâmetros corretos', async () => {
        const symbol = 'BTCUSDT';
        const interval = '1d';
        const limit = 100;
        const mockData = [[1, 2, 3, 4, 5]];
  
        axios.get.mockResolvedValue({ data: mockData });
  
        const result = await getKlines(symbol, interval, limit);
        expect(result).toEqual(mockData);
        expect(axios.get).toHaveBeenCalledWith(`${API_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
      });
  
      test('Deve gerar um erro quando a busca de dados do klines falhar', async () => {
        const symbol = 'BTCUSDT';
        const interval = '1d';
        const limit = 100;
        const mockError = new Error('Network Error');
  
        axios.get.mockRejectedValue(mockError);
  
        await expect(getKlines(symbol, interval, limit)).rejects.toThrow('Network Error');
        expect(axios.get).toHaveBeenCalledWith(`${API_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
      });
    });
  
    describe('createOrder', () => {
      test('Deve criar pedido com parâmetros corretos', async () => {
        const order = { symbol: 'BTCUSDT', side: 'BUY', type: 'LIMIT', quantity: 1, price: 50000 };
        const apiKey = 'api-key';
        const secretKey = 'secret-key';
        const mockData = { orderId: 1 };
        const mockSignature = 'mock-signature';
        const orderQueryString = new URLSearchParams(order).toString();
  
        crypto.createHmac.mockReturnValue({
          update: jest.fn().mockReturnThis(),
          digest: jest.fn().mockReturnValue(mockSignature)
        });
  
        axios.post.mockResolvedValue({ data: mockData });
  
        const result = await createOrder(order, apiKey, secretKey);
        expect(result).toEqual(mockData);
        expect(crypto.createHmac).toHaveBeenCalledWith('sha256', secretKey);
        expect(axios.post).toHaveBeenCalledWith(
          `${API_URL}/api/v3/order`,
          expect.stringContaining(orderQueryString),
          {
            headers: { 'X-MBX-APIKEY': apiKey }
          }
        );
      });
  
      test('Deve gerar um erro quando a criação do pedido falha', async () => {
        const order = { symbol: 'BTCUSDT', side: 'BUY', type: 'LIMIT', quantity: 1, price: 50000 };
        const apiKey = 'api-key';
        const secretKey = 'secret-key';
        const mockError = new Error('Order Error');
        const mockSignature = 'mock-signature';
  
        crypto.createHmac.mockReturnValue({
          update: jest.fn().mockReturnThis(),
          digest: jest.fn().mockReturnValue(mockSignature)
        });
  
        axios.post.mockRejectedValue(mockError);
  
        await expect(createOrder(order, apiKey, secretKey)).rejects.toThrow('Order Error');
        expect(axios.post).toHaveBeenCalledWith(
          `${API_URL}/api/v3/order`,
          expect.any(String),
          {
            headers: { 'X-MBX-APIKEY': apiKey }
          }
        );
      });
    });
  });