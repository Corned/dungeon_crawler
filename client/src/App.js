import { useEffect, useRef, useState } from "react"

import Vector from "./util/Vector"


import "./App.css"
import Minimap from "./components/Minimap"
import FirstPersonView from "./components/FirstPersonView"

const mapWidth = 10
const mapHeight = 10
const map = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 4, 0, 0, 0, 0, 5, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 2, 3, 0, 0, 0, 1,
  1, 0, 0, 0, 5, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 3, 0, 0, 0, 0, 2, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]

const locationX = 2
const locationY = 4.5

const raycast = (start, direction) => {
  const step = (a, b) => {
    return a.add(b.mul(0.02))
  }

  let current = start
  let i = 0

  while (i < 500) {
    i++
    current = step(current, direction)

    const x = Math.floor(current.x)
    const y = Math.floor(current.y)
    const cell = map[y * mapWidth + x]

    if (y * mapWidth + x < 0 || y * mapWidth + x > map.length) {
      console.log("OOB")
      break
    }

    if (cell !== 0) break

  }

  return current
}

function App() {
  const [ player, setPlayer ] = useState({
    angle: -Math.PI/2,
    position: new Vector(locationX, locationY)
  })

  const [ raycastData, setRaycastData ] = useState([])

  useEffect(() => {
    const heldKeys = {}
    const onKeyDown = ({ key }) => heldKeys[key] = true
    const onKeyUp = ({ key }) => heldKeys[key] = null

    const interval = setInterval(() => {
      let deltaAngle = 0
      let deltaPosition = new Vector(0, 0)
      
      if (heldKeys["q"]) deltaAngle -= Math.PI / 50
      if (heldKeys["e"]) deltaAngle += Math.PI / 50

      if (heldKeys["w"]) deltaPosition = deltaPosition.add(new Vector(0, 1))
      if (heldKeys["s"]) deltaPosition = deltaPosition.sub(new Vector(0, 1))
      if (heldKeys["a"]) deltaPosition = deltaPosition.add(new Vector(1, 0))
      if (heldKeys["d"]) deltaPosition = deltaPosition.sub(new Vector(1, 0))

      if (deltaPosition.magnitude > 0) {
        deltaPosition = deltaPosition.unit.mul(0.075)
      }

      setPlayer(({ angle, position }) => {
        return {
          angle: angle + deltaAngle,
          position: position.add(deltaPosition.rotate(angle - Math.PI / 2))
        }
      })

    }, 1000 / 60)

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("keyup", onKeyUp)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("keyup", onKeyUp)
      clearInterval(interval)
    }
  }, [ ])

  useEffect(() => {
    setRaycastData( raycast(player.position, new Vector(1, 0).rotate(player.angle)) )
  }, [ player.angle, player.position ])

  return (
    <div className="App">
      <div>
        <h1>Dungeon_Crawler</h1>
      </div>
      <div className="game-view">
        <Minimap
          mapData={map}
          playerAngle={player.angle}
          playerPosition={player.position}
          raycastData={raycastData}
        />
        <FirstPersonView
          mapData={map}
          playerAngle={player.angle}
          playerPosition={player.position}
          raycastData={raycastData}
          setPlayer={setPlayer}
        />
      </div>
      <div className="instructions">
        <p>W/A/S/D to move, Q/E to turn</p>
        <p>Click 3D view to turn with mouse, press ESC to unlock mouse</p>
      </div>

      <footer><a href="https://github.com/corned" target="_blank">made with 🥳</a></footer>
    </div>
  )
}

export default App
