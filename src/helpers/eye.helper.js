// @flow

import * as faceapi from 'face-api.js'

export function calcEAR(landmarks: { x: number, y: number }[]): number {
  const eyeWidth = faceapi.euclideanDistance(
    [landmarks[0].x, landmarks[0].y],
    [landmarks[3].x, landmarks[3].y]
  )
  const eyeHeightA = faceapi.euclideanDistance(
    [landmarks[1].x, landmarks[1].y],
    [landmarks[5].x, landmarks[5].y]
  )
  const eyeHeightB = faceapi.euclideanDistance(
    [landmarks[2].x, landmarks[2].y],
    [landmarks[4].x, landmarks[4].y]
  )
  const EAR = (eyeHeightA + eyeHeightB) / (eyeWidth * 2)

  return Math.floor(EAR * 100)
}
