import { useMemo, useState } from 'react'
import './App.css'

const SECTORS_COUNT = 37

function App() {
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)

  const sectors = useMemo(() => {
    const items = [
      {
        value: '0',
        shortValue: '0',
        color: '#0b8f45',
      },
    ]

    for (let i = 1; i < SECTORS_COUNT; i++) {
      const shouldGo = i % 2 === 1

      items.push({
        value: shouldGo
          ? 'Пойти на пары к Юрию'
          : 'Не пойти на пары к Юрию',

        shortValue: shouldGo ? 'Пойти' : 'Не идти',

        color: shouldGo ? '#b91c1c' : '#18181b',
      })
    }

    return items
  }, [])

  const sectorAngle = 360 / sectors.length

  const wheelBackground = useMemo(() => {
    const halfSector = sectorAngle / 2

    const parts = sectors.map((sector, index) => {
      const start = index * sectorAngle - halfSector
      const end = start + sectorAngle

      return `${sector.color} ${start}deg ${end}deg`
    })

    return `conic-gradient(${parts.join(', ')})`
  }, [sectors, sectorAngle])

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setResult('')

    const randomIndex = Math.floor(Math.random() * sectors.length)

    const currentPosition = ((rotation % 360) + 360) % 360

    const targetPosition =
      (360 - randomIndex * sectorAngle) % 360

    const distance =
      (targetPosition - currentPosition + 360) % 360

    const newRotation =
      rotation +
      5 * 360 +
      distance

    setRotation(newRotation)

    setTimeout(() => {
      setResult(sectors[randomIndex].value)
      setIsSpinning(false)
    }, 4000)
  }

  return (
    <main className="game">
      <h1 className="game__title">
        Пойти на пары, не пойти или зеро?
      </h1>

      <p className="game__subtitle">
        Судьба решит за тебя
      </p>

      <div className="roulette">
        <div className="roulette__pointer"></div>

        <div
          className="roulette__wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            background: wheelBackground,
          }}
        >
          {sectors.map((sector, index) => {
            const angle = index * sectorAngle

            return (
              <div
                className="roulette__label"
                key={index}
                style={{
                  transform: `
                    translate(-50%, -50%)
                    rotate(${angle}deg)
                    translateY(-157px)
                  `,
                }}
              >
                <span>{sector.shortValue}</span>
              </div>
            )
          })}

          <div className="roulette__inner-ring"></div>

          <div className="roulette__center">
            <div className="roulette__center-dot"></div>
          </div>
        </div>
      </div>

      <button
        className="spin-button"
        onClick={spinWheel}
        disabled={isSpinning}
      >
        {isSpinning ? 'Барабан крутится...' : 'Крутить'}
      </button>

      <div className="result">
        {result && (
          <>
            <span className="result__caption">Выпало:</span>
            <strong>{result}</strong>
          </>
        )}
      </div>
    </main>
  )
}

export default App