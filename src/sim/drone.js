// Підкрутка "на відчуття". Не фізика ракет, а щоб дрон слухався.
// ROTATE_SPEED 5.5 — крутиться різкіше, ніж літак: FPV-дрон реагує майже миттєво.
// THRUST 600 — розгін відчутний швидко.
// DRAG 2.2 — без газу швидко гальмує й "висить", а не ковзає по інерції.
// MAX_SPEED 420 — не вилітає за межі реакції на 60 Hz кроці.
export const ROTATE_SPEED = 5.5
export const THRUST = 600
export const DRAG = 2.2
export const MAX_SPEED = 420

export function createDrone({ x = 0, y = 0, angle = -Math.PI / 2 } = {}) {
  return { x, y, vx: 0, vy: 0, angle, thrust: 0 }
}

export function cloneDrone(drone) {
  return {
    x: drone.x,
    y: drone.y,
    vx: drone.vx,
    vy: drone.vy,
    angle: drone.angle,
    thrust: drone.thrust,
  }
}

export function integrate(drone, input, dt) {
  const left = input.isDown('ArrowLeft') || input.isDown('KeyA')
  const right = input.isDown('ArrowRight') || input.isDown('KeyD')
  const thrusting = input.isDown('ArrowUp') || input.isDown('KeyW')

  if (left) drone.angle -= ROTATE_SPEED * dt
  if (right) drone.angle += ROTATE_SPEED * dt

  drone.thrust = thrusting ? THRUST : 0
  if (thrusting) {
    drone.vx += Math.cos(drone.angle) * THRUST * dt
    drone.vy += Math.sin(drone.angle) * THRUST * dt
  }

  const damp = Math.exp(-DRAG * dt)
  drone.vx *= damp
  drone.vy *= damp

  const speed = Math.hypot(drone.vx, drone.vy)
  if (speed > MAX_SPEED) {
    const scale = MAX_SPEED / speed
    drone.vx *= scale
    drone.vy *= scale
  }

  drone.x += drone.vx * dt
  drone.y += drone.vy * dt
}
