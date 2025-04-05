'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { fetchMockStock, mockStockData } from '@/lib/mock-stock'
import { Bell, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface PricePoint {
  time: string
  price: number
}

export default function StockChartPage() {
  const allSymbols = Object.keys(mockStockData)

  const [symbol, setSymbol] = useState('AAPL')
  const [inputValue, setInputValue] = useState('AAPL')
  const [suggestions, setSuggestions] = useState<string[]>([])

  const [companyName, setCompanyName] = useState('Apple Inc.')
  const [basePrice, setBasePrice] = useState(173.45)
  const [price, setPrice] = useState(173.45)
  const [change, setChange] = useState(1.35)
  const [data, setData] = useState<PricePoint[]>([])
  const [notFound, setNotFound] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)


  // 🔁 symbol 변경 시 더미 데이터 갱신
  useEffect(() => {
    try {
      const data = fetchMockStock(symbol)
      setCompanyName(data.name)
      setBasePrice(data.price)
      setPrice(data.price)
      setChange(data.change)
      setData([])
      setNotFound(false)
    } catch (e) {
      setCompanyName('Unknown')
      setBasePrice(0)
      setPrice(0)
      setChange(0)
      setData([])
      setNotFound(true)
    }
  }, [symbol])

  // ⏱️ 1초마다 가격 변화 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const offset = Math.random() - 0.5
      const nextPrice = +(basePrice + offset).toFixed(2)

      const nextPoint = {
        time: now.toLocaleTimeString(),
        price: nextPrice,
      }

      setPrice(nextPrice)
      setData((prev) => [...prev.slice(-19), nextPoint])
    }, 1000)

    return () => clearInterval(interval)
  }, [basePrice])

  return (
    <div className="min-h-screen p-4 bg-gray-100 text-gray-900">
      {/* 상단 헤더 */}
      <header className="flex items-start justify-between mb-4">
  <h1 className="text-xl font-bold">📈 RealStock</h1>

  <div className="relative max-w-xs w-full">
  <Input
  placeholder="Search symbol (e.g. TSLA)"
  value={inputValue}
  onChange={(e) => {
    const val = e.target.value.toUpperCase()
  setInputValue(val)

  const filtered = allSymbols.filter((s) => s.startsWith(val))
  setSuggestions(filtered)
  setHighlightedIndex(null) // 방향키 선택 초기화
  }}
  onKeyDown={(e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => {
        if (!suggestions.length) return null
        const next = prev === null ? 0 : (prev + 1) % suggestions.length
        return next
      })
    }
  
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => {
        if (!suggestions.length) return null
        const next =
          prev === null
            ? suggestions.length - 1
            : (prev - 1 + suggestions.length) % suggestions.length
        return next
      })
    }
  
    if (e.key === 'Enter') {
      if (highlightedIndex !== null) {
        const selected = suggestions[highlightedIndex]
        setSymbol(selected)
        setInputValue(selected)
      } else {
        setSymbol(inputValue)
      }
      setSuggestions([])
      setHighlightedIndex(null)
    }
  }}
/>

{inputValue.length > 0 && suggestions.length > 0 && inputValue !== symbol && (
  <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow text-sm">
    {suggestions.map((s, idx) => (
      <li
        key={s}
        className={`px-4 py-2 cursor-pointer ${
          idx === highlightedIndex ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'
        }`}
        onMouseEnter={() => setHighlightedIndex(idx)}
        onClick={() => {
          setSymbol(s)
          setInputValue(s)
          setSuggestions([])
          setHighlightedIndex(null)
        }}
      >
        {s}
      </li>
    ))}
  </ul>
)}

  </div>
</header>


      {/* ❗ 오류 메시지 */}
      {notFound && (
        <div className="text-red-600 text-sm mb-2">
          입력하신 심볼 "{symbol}"에 해당하는 종목을 찾을 수 없습니다.
        </div>
      )}

      {/* 종목 요약 */}
      {!notFound && (
        <Card className="mb-4">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-semibold">
                {companyName} ({symbol})
              </div>
              <div className="text-2xl font-bold">
                ${price.toFixed(2)}
                <span
                  className={`ml-2 text-sm font-medium ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {change >= 0 ? '+' : ''}
                  {change}%
                </span>
              </div>
            </div>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Star className="w-6 h-6 cursor-pointer" />
              <Bell className="w-6 h-6 cursor-pointer" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 차트 */}
      {!notFound && (
        <div className="bg-white rounded-2xl shadow p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
