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


const Minimap = ({ mapData, playerPosition, playerAngle, raycastData }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      const width = canvasRef.current.width
      const height = canvasRef.current.height

      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, width, height)

      const cellWidth = width / 10
      const cellHeight = height / 10

      for (let i = 0; i < 10 * 10; i++) {
        const x = i % 10
        const y = Math.floor(i / 10)

        ctx.fillStyle = `rgb(${colors[mapData[i]]})`
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight)

        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
        ctx.lineWidth = 1
        ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight)
      }

      // player
      ctx.strokeStyle = "red"
      ctx.lineWidth = 3
      ctx.fillStyle = "rgb(150, 0, 0)"
      ctx.beginPath()
      ctx.arc((playerPosition.x + 0.5) * cellWidth, (playerPosition.y + 0.5) * cellHeight, 5, 0, 360)
      ctx.stroke()
      ctx.fill()

      // view direction
      const dir = playerPosition.add(new Vector(1, 0).rotate(playerAngle).mul(0.4))

      ctx.strokeStyle = "red"
      ctx.lineWidth = 2
      ctx.moveTo((playerPosition.x + 0.5) * cellWidth, (playerPosition.y + 0.5) * cellHeight)
      ctx.lineTo((dir.x + 0.5) * cellWidth, (dir.y + 0.5) * cellWidth)
      ctx.stroke()

      // draw raycast
/*       ctx.lineWidth = 3
      ctx.moveTo(playerPosition.x * cellWidth, playerPosition.y * cellHeight)
      ctx.lineTo(raycastData.x * cellWidth, raycastData.y * cellWidth)
      ctx.stroke() */
    }
  }, [ canvasRef.current, playerPosition, playerAngle ])

  return (
    <canvas ref={canvasRef} width={400} height={400}></canvas>
  )
}

export default Minimap