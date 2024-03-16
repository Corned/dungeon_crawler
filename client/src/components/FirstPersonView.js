import { useEffect, useRef } from "react"
import Vector from "../util/Vector"

const colors = [
  "0, 0, 0",
  "255, 255, 255",
  "255, 153, 153",
  "0, 179, 0",
  "0, 57, 230", 
  "255, 102, 0",
]

const raytrace = (map, position, dx, dy) => {
  const get = (x, y) => {
    x = Math.round(x)
    y = Math.round(y)
    
    return map[y * 10 + x]
  }

  const originX = position.x
  const originY = position.y

  let result
  let i = 0

  // if result === null, OOB
  while (true) {
    result = get(position.x, position.y)

    if (result !== 0) break

    position = position.add(new Vector(dx, dy))

    
    i++
    if (i > 1000) {
      break
    }
  }

  
  if (result === null) {
    return 99999
  }

  const distance = Math.sqrt((position.x - originX)**2 + (position.y - originY)**2)
  return { distance, result }
}

const render = (canvas, mapData, playerAngle, position) => {
  const ctx = canvas.getContext("2d")
  const width = canvas.width
  const height = canvas.height

  // Clear canvas
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, width, height)



  const raycastAngles = []
  for (let x = 0; x <= width; x++) {
    const angle = Math.atan( (x - width / 2) / width * 2 )
    raycastAngles.push(angle)
  }

/*   ctx.fillStyle = "rgba(50, 255, 100, 0.2)"
  ctx.fillRect(0, height / 2, width, height / 2) */


  for (const [ index, angle ] of raycastAngles.entries()) {
    const dir_x = Math.cos(angle + playerAngle)
    const dir_y = Math.sin(angle + playerAngle)

    let { distance, result } = raytrace(mapData, position, dir_x / 100, dir_y / 100)
    distance = distance * Math.cos(angle)
    
    const boxheight = height / 1.2 / distance
    const opacity = 1 - distance * 25 / 255

    ctx.fillStyle = `black`
    ctx.fillRect(index, (height - boxheight) / 2, 1, boxheight)

    ctx.fillStyle = `rgba(${colors[result]}, ${opacity})`
    ctx.fillRect(index, (height - boxheight) / 2, 1, boxheight)
    
    

  }
}


const FirstPersonView = ({ mapData, playerPosition, playerAngle, raycastData, setPlayer }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const mouseMove = (event) => {
      if (!document.pointerLockElement) return
  
      setPlayer(({ angle, position }) => {
        return {
          angle: angle + Math.max(Math.min(event.movementX, 100), -100) / 150,
          position
        }
      })
    }

    let interval
    if (canvasRef.current) {
      interval = setInterval(() => {
        render(canvasRef.current, mapData, playerAngle, playerPosition)
      })

      canvasRef.current.addEventListener("click", async () => {
        await canvasRef.current.requestPointerLock({
          //unadjustedMovement: true,
        })
      })

      canvasRef.current.addEventListener("mousemove", mouseMove)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
      canvasRef.current.removeEventListener("mousemove", mouseMove)
    }
  }, [ canvasRef, playerPosition, playerAngle ])


  return (
    <canvas ref={canvasRef} width={600} height={400}></canvas>
  )
}

export default FirstPersonView