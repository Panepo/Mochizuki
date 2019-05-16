// @flow

export function drawFPS(
  canvas: HTMLCanvasElement,
  text: string,
  color: string,
  location: { x: number, y: number }
) {
  const ctx = canvas.getContext('2d')
  ctx.font = '30px Comic Sans MS'
  ctx.fillStyle = color
  ctx.fillText(text, location.x, location.y)
}

export function extractData(
  input: string,
  rect: { x: number, y: number, width: number, height: number }
): ImageData | null {
  const image = document.getElementById(input)
  if (image instanceof HTMLCanvasElement) {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    return ctx.getImageData(rect.x, rect.y, rect.width, rect.height)
  }
  return null
}
