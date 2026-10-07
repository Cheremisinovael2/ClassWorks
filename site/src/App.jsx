import { useEffect, useRef } from 'react'
import './App.css'

const projects = [
  {
    id: 1,
    title: 'Random Number Generator',
    description: 'Генератор случайных чисел',
    image: `${import.meta.env.BASE_URL}covers/random-number-generator.png`,
    link: `${import.meta.env.BASE_URL}random-number-generator/index.html`,
  },
  {
    id: 2,
    title: 'Wheel of Fortune',
    description: 'Пойти на пары, не пойти или зеро?',
    image: `${import.meta.env.BASE_URL}covers/wheel-of-fortune.png`,
    link: `${import.meta.env.BASE_URL}wheel-of-fortune/index.html`,
  },
]

function App() {
  const worldRef = useRef(null)
  const chromeRef = useRef(null)
  const cardRefs = useRef([])
  const faceRefs = useRef([])

  const rotation = useRef(0)
  const velocity = useRef(0)

  const zoom = useRef(1)
  const zoomTarget = useRef(1)

  const position = useRef({ x: 0, y: 0 })
  const positionTarget = useRef({ x: 0, y: 0 })

  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  })

  const didDrag = useRef(false)

  const handlePointerDown = (event) => {
    if (event.button !== 0) return

    drag.current.active = true
    didDrag.current = false

    drag.current.startX = event.clientX
    drag.current.startY = event.clientY

    drag.current.originX = positionTarget.current.x
    drag.current.originY = positionTarget.current.y

    document.body.classList.add('is-dragging')
  }

  const handleProjectClick = (event) => {
    if (didDrag.current) {
      event.preventDefault()
    }
  }

  useEffect(() => {
    let animationFrame

    const radiusBase = 520

    const handleWheel = (event) => {
      event.preventDefault()

      if (event.ctrlKey) {
        zoomTarget.current += event.deltaY * -0.0015
        zoomTarget.current = Math.max(0.7, Math.min(1.8, zoomTarget.current))
        return
      }

      velocity.current += event.deltaY * 0.003
      velocity.current = Math.max(-4, Math.min(4, velocity.current))
    }

    const handlePointerMove = (event) => {
      if (!drag.current.active) return

      const deltaX = event.clientX - drag.current.startX
      const deltaY = event.clientY - drag.current.startY

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        didDrag.current = true
      }

      positionTarget.current.x = drag.current.originX + deltaX
      positionTarget.current.y = drag.current.originY + deltaY
    }

    const handlePointerUp = () => {
      drag.current.active = false
      document.body.classList.remove('is-dragging')
    }

    const animate = () => {
      rotation.current += velocity.current
      velocity.current *= 0.94

      zoom.current += (zoomTarget.current - zoom.current) * 0.1

      position.current.x += (positionTarget.current.x - position.current.x) * 0.12
      position.current.y += (positionTarget.current.y - position.current.y) * 0.12

      if (worldRef.current) {
        worldRef.current.style.transform = `
          translate3d(${position.current.x}px, ${position.current.y}px, 0)
        `
      }

      const radius = radiusBase * zoom.current
      const count = projects.length

      cardRefs.current.forEach((card, index) => {
        if (!card) return

        const angle = rotation.current + (360 / count) * index

        card.style.transform = `
          translate(-50%, -50%)
          rotateY(${angle}deg)
          translateZ(${radius}px)
        `

        const face = faceRefs.current[index]

        if (face) {
          face.style.transform = `rotateY(${-angle}deg)`
        }
      })

      if (chromeRef.current) {
        chromeRef.current.style.transform = `
          scale(${zoom.current})
          rotateY(${rotation.current * -0.22}deg)
          rotateX(-10deg)
        `
      }

      animationFrame = requestAnimationFrame(animate)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    animationFrame = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <main className="page">
      <div className="background-grid"></div>

      <header className="header">
        <div className="brand">ClassWorks</div>

        <div className="controls">
          <span>Scroll — rotate</span>
          <span>Ctrl + scroll — zoom</span>
          <span>Drag — move</span>
        </div>
      </header>

      <section className="scene" onPointerDown={handlePointerDown}>
        <div className="world" ref={worldRef}>
          {projects.map((project, index) => (
            <a
              key={project.id}
              href={project.link}
              className="project"
              ref={(element) => {
                cardRefs.current[index] = element
              }}
              onClick={handleProjectClick}
              draggable="false"
            >
              <div
                className="project__face"
                ref={(element) => {
                  faceRefs.current[index] = element
                }}
              >
                <div className="project__content">
                  <img
                    src={project.image}
                    alt={project.title}
                    draggable="false"
                  />

                  <div className="project__overlay">
                    <span className="project__number">
                      {String(project.id).padStart(2, '0')}
                    </span>

                    <div className="project__info">
                      <h2>{project.title}</h2>
                      <p>{project.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}

          <div className="chrome-object" ref={chromeRef}>
            <div className="chrome-object__ring ring-1"></div>
            <div className="chrome-object__ring ring-2"></div>
            <div className="chrome-object__ring ring-3"></div>
            <div className="chrome-object__ring ring-4"></div>

            <svg className="chrome-object__title" viewBox="0 0 360 360">
              <defs>
                <path
                  id="title-arc"
                  d="M 40 185 A 145 110 0 0 1 320 185"
                />
              </defs>

              <text>
                <textPath href="#title-arc" startOffset="50%" textAnchor="middle">
                  CLASSWORKS
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>{projects.length} projects</span>
        <span>Interactive portfolio</span>
      </footer>
    </main>
  )
}

export default App