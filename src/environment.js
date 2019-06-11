class EnvironmentValues {
  title = 'Mochizuki'

  urlDev = '/'
  urlProd = 'https://panepo.github.io/Mochizuki/'
  GoogleAnalyticsID = 'UA-106126363-3'
  ColorMenuIcon = '#ff6699'
  ColorRibbon = 'linear-gradient(165deg, #ff5722 30%, #ffff00, #cddc39)'

  // Video options
  videoCanvas = {
    width: 640,
    height: 360
  }

  valiOriginal = false

  useTinyFaceDetector = true
  useTinyLandmark = true

  // TinyFaceDetector options
  tinyInputSize = 160
  tinyThreshold = 0.5

  // SSD Mobilenet v1 options
  ssdMinConfidence = 0.5
  ssdMaxResults = 10

  // Blink detection options
  blinkEARThreshold = 0.4
  blinkTimeThreshold = 500
}

// Export as singleton
const environmentValuesLoader = new EnvironmentValues()
Object.freeze(environmentValuesLoader)
export { environmentValuesLoader as environment }
