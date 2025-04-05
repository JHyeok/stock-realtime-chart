export const mockStockData = {
  AAPL: {
    name: 'Apple Inc.',
    price: 173.45,
    change: 1.35,
  },
  TSLA: {
    name: 'Tesla Inc.',
    price: 254.66,
    change: -0.87,
  },
  MSFT: {
    name: 'Microsoft Corp.',
    price: 321.12,
    change: 0.42,
  },
  GOOGL: {
    name: 'Alphabet Inc.',
    price: 138.73,
    change: 1.12,
  },
} as const

export type StockSymbol = keyof typeof mockStockData

export function fetchMockStock(symbol: string) {
  const stock = mockStockData[symbol as StockSymbol]
  if (!stock) throw new Error('Symbol not found')
  return stock
}
