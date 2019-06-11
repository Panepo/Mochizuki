// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import * as faceapi from 'face-api.js'
import { calcEAR } from '../../helpers/eye.helper'
import { loadModel, modelInitial } from '../../helpers/model.helper'
import { environment } from '../../environment'
import Layout from '../Layout'
import { withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import IconAdd from '@material-ui/icons/AddPhotoAlternate'
import Loading from './Loading'

const styles = (theme: Object) => ({
  divider: {
    marginTop: '10px',
    marginBottom: '10px'
  },
  hidden: {
    display: 'none'
  },
  webcamContainer: {
    position: 'relative',
    width: '600px',
    height: '600px'
  },
  webcam: {
    position: 'absolute',
    top: '0px',
    left: '0px'
  },
  webcamOverlay: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    zIndex: 10
  },
  grid: {
    flexGrow: 1
  }
})

type ProvidedProps = {
  classes: Object
}

type Props = {}

type State = {
  isLoading: boolean,
  imageFile: string[],
  processTime: number
}

class Validator extends React.Component<ProvidedProps & Props, State> {
  state = {
    isLoading: true,
    imageFile: [],
    processTime: 0
  }

  componentDidMount = async () => {
    await loadModel()
    await modelInitial('initial_black')
    this.setState({ isLoading: false })
  }

  // ================================================================================
  // React event handler functions
  // ================================================================================
  handleUpload = (event: any) => {
    const data = []

    for (let i = 0; i < event.target.files.length; i += 1) {
      let dataTemp
      if (event.target.files[i] != null) {
        dataTemp = URL.createObjectURL(event.target.files[i])
        data.push(dataTemp)
      }
    }

    if (data.length > 0) {
      this.setState({
        imageFile: data
      })

      const image = document.getElementById('input_image')
      const canvas = document.getElementById('input_canvas')
      if (
        canvas instanceof HTMLCanvasElement &&
        image instanceof HTMLImageElement
      ) {
        let scale
        if (image.naturalWidth < 150) scale = 4
        else if (image.naturalWidth < 300) scale = 3
        else if (image.naturalWidth < 600) scale = 2
        else scale = 1
        image.onload = () => {
          canvas.width = image.naturalWidth * scale
          canvas.height = image.naturalHeight * scale
          const ctx = canvas.getContext('2d')
          ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth * scale,
            image.naturalHeight * scale
          )
          this.faceMain()
        }
      }
    } else {
      this.setState({
        imageFile: []
      })
    }
  }

  // ================================================================================
  // Facec recognition functions
  // ================================================================================
  faceMain = async () => {
    const image = document.getElementById('input_canvas')
    const canvas = document.getElementById('input_canvas_overlay')
    if (
      canvas instanceof HTMLCanvasElement &&
      image instanceof HTMLCanvasElement
    ) {
      const tstart = performance.now()
      await this.faceRecognize(canvas, image)
      const tend = performance.now()
      const tickProcess = Math.floor(tend - tstart) + ' ms'
      const anchor = { x: 0, y: canvas.height }
      const drawOptions = {
        anchorPosition: 'TOP_LEFT',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        fontColor: 'yellow'
      }
      const drawBox = new faceapi.draw.DrawTextField(
        tickProcess,
        anchor,
        drawOptions
      )
      drawBox.draw(canvas)
    }
  }

  faceRecognize = async (
    canvas: HTMLCanvasElement,
    image: HTMLCanvasElement
  ) => {
    let result
    if (environment.useTinyFaceDetector) {
      result = await faceapi
        .detectSingleFace(
          image,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: environment.tinyInputSize,
            scoreThreshold: environment.tinyThreshold
          })
        )
        .withFaceLandmarks(environment.useTinyLandmark)
    } else {
      result = await faceapi
        .detectSingleFace(
          image,
          new faceapi.SsdMobilenetv1Options({
            minConfidence: environment.ssdMinConfidence,
            maxResults: environment.ssdMaxResults
          })
        )
        .withFaceLandmarks(environment.useTinyLandmark)
    }

    if (result) {
      faceapi.matchDimensions(canvas, image)
      const resizedResult = faceapi.resizeResults(result, image)
      faceapi.draw.drawDetections(canvas, resizedResult)
      faceapi.draw.drawFaceLandmarks(canvas, resizedResult)

      const leftEye = resizedResult.landmarks.getLeftEye()
      const rightEye = resizedResult.landmarks.getRightEye()
      const EAR = calcEAR(leftEye) + calcEAR(rightEye)
      const text = ['EAR: ' + EAR.toString()]
      const anchor = { x: 0, y: 0 }
      const drawOptions = {
        anchorPosition: 'TOP_LEFT',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        fontColor: 'yellow'
      }
      const drawBox = new faceapi.draw.DrawTextField(text, anchor, drawOptions)
      drawBox.draw(canvas)
    } else {
      const context = canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
  // ================================================================================
  // React render functions
  // ================================================================================
  render() {
    if (this.state.isLoading) return <Loading />

    return (
      <Layout
        helmet={true}
        title={'Validator'}
        gridNormal={8}
        gridPhone={10}
        content={
          <Grid container spacing={16}>
            <Grid item xs={4}>
              <Card className={this.props.classes.card}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Validator
                  </Typography>
                  <Divider className={this.props.classes.divider} />
                  <Grid container={true} justify="center">
                    <img
                      className={
                        this.state.imageFile.length > 0
                          ? null
                          : this.props.classes.hidden
                      }
                      src={this.state.imageFile[0]}
                      id={'input_image'}
                      alt="upload"
                    />
                  </Grid>
                  {this.state.imageFile.length > 0 ? (
                    <Divider className={this.props.classes.divider} />
                  ) : null}
                </CardContent>
                <CardActions>
                  <Tooltip title="Select Image">
                    <IconButton
                      className={this.props.classes.icon}
                      component="label"
                      color="primary">
                      <input
                        className={this.props.classes.hidden}
                        type="file"
                        name="fileUpload"
                        accept="image/*"
                        onChange={this.handleUpload}
                        required
                      />
                      <IconAdd />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={8}>
              <Card className={this.props.classes.card}>
                <CardContent>
                  <Grid container={true} justify="center">
                    <div className={this.props.classes.webcamContainer}>
                      <canvas
                        className={this.props.classes.webcam}
                        id={'input_canvas'}
                      />
                      <canvas
                        className={this.props.classes.webcamOverlay}
                        id={'input_canvas_overlay'}
                      />
                    </div>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        }
      />
    )
  }
}

Validator.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Validator)
