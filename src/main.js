import './style.css'
import { createLoop } from './loop.js'
import { createInput } from './input.js'
import { cloneDrone, createDrone, integrate } from './sim/drone.js'
import { hideWrapForLerp, wrap } from './sim/arena.js'
import { createCanvas } from './render/canvas.js'
import {
  createStarfield,
  drawBackground,
  drawGrid,
  drawHud,
  drawDrone,
  drawStarfield,
  interpolateDrone,
} from './render/draw.js'

const input = createInput(window)
const drone = createDrone()
let previous = cloneDrone(drone)
let stars = []

const { ctx, size } = createCanvas(document.querySelector('#game'), {
  onResize({ w, h }) {
    wrap(drone, w, h)
    stars = createStarfield(w, h)
  },
})

drone.x = size.w / 2
drone.y = size.h / 2
previous = cloneDrone(drone)

function simulate(dt) {
  previous = cloneDrone(drone)
  integrate(drone, input, dt)
  wrap(drone, size.w, size.h)
  hideWrapForLerp(previous, drone, size.w, size.h)
  input.consume()
}

function render(alpha, stats) {
  drawBackground(ctx, size.w, size.h)
  drawGrid(ctx, size.w, size.h)
  drawStarfield(ctx, stars)
  drawDrone(ctx, interpolateDrone(previous, drone, alpha))
  drawHud(ctx, stats)
}

const loop = createLoop({ simulate, render })
loop.start()

window.addEventListener('keydown', (e) => {
  if (e.code !== 'Space') return
  e.preventDefault()
  if (loop.isRunning()) loop.stop()
  else loop.start()
})
