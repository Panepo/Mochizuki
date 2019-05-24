class EnvironmentValues {
  title = 'Mochizuki'

  urlDev = '/'
  urlProd = '/'

  GoogleAnalyticsID = 'UA-106126363-3'

  // Video options
  videoCanvas = {
    width: 640,
    height: 360
  }

  // TinyFaceDetector options
  tinyInputSize = 160
  tinyThreshold = 0.5

  // Blink detection options
  blinkEARThreshold = 0.4
  blinkTimeThreshold = 500
}

// Export as singleton
const environmentValuesLoader = new EnvironmentValues()
Object.freeze(environmentValuesLoader)
export { environmentValuesLoader as environment }
