// @flow

import * as faceapi from 'face-api.js'

export function calcBlink(landmarks: { x: number, y: number }[]): number {
  const eyeWidth = faceapi.euclideanDistance(
    [landmarks[0].x, landmarks[0].y],
    [landmarks[3].x, landmarks[3].y]
  )
  const eyeHeight = faceapi.euclideanDistance(
    [
      (landmarks[1].x + landmarks[2].x) / 2,
      (landmarks[1].y + landmarks[2].y) / 2
    ],
    [
      (landmarks[4].x + landmarks[5].x) / 2,
      (landmarks[4].y + landmarks[5].y) / 2
    ]
  )

  return eyeWidth / eyeHeight
}
