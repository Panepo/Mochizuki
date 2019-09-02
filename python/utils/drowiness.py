import numpy as np

def eulicanDistance(pos1, pos2):
  x1 = np.asarray(pos1)
  x2 = np.asarray(pos2)
  return sum(pow(abs(x1 - x2), 2))

def eyeAspectRatio(eye_landmark):
  eyeWidth = eulicanDistance(eye_landmark[0], eye_landmark[3])
  eyeHeightA = eulicanDistance(eye_landmark[1], eye_landmark[5])
  eyeHeightB = eulicanDistance(eye_landmark[2], eye_landmark[4])
  return ((eyeHeightA + eyeHeightB) / (eyeWidth * 2))
