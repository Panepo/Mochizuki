// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionInfo from '../../actions/info.action'
import type { Dispatch, RouterHistory } from '../../models'
import type { StateSetting } from '../../models/setting.model'
import { withRouter } from 'react-router-dom'
import * as faceapi from 'face-api.js'
import { calcEAR } from '../../helpers/eye.helper'
import { environment } from '../../environment'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import WebcamCrop from '../../componments/WebcamCrop'
import { withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import IconCamera from '@material-ui/icons/Camera'
import IconSettings from '@material-ui/icons/Settings'
import IconSensor from '@material-ui/icons/Contacts'

import Loading from './Loading'

const imageSensor = require('../../images/sensor.jpg')

const styles = (theme: Object) => ({
  divider: {
    marginTop: '10px',
    marginBottom: '10px'
  },
  webcamContainer: {
    position: 'relative'
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
  }
})

type ProvidedProps = {
  classes: Object,
  history: RouterHistory
}

type Props = {
  setting: StateSetting,
  actionsI: Dispatch
}

type State = {
  isLoading: boolean,
  isPlaying: boolean,
  isSensing: boolean,
  processTime: number
}

class Sensor extends React.Component<ProvidedProps & Props, State> {
  state = {
    isLoading: true,
    isPlaying: false,
    isSensing: false,
    processTime: 0
  }
  interval = 0
  tick = 0
  tickProcess = 0
  tickBlink = 0

  componentDidMount = async () => {
    const dev = process.env.NODE_ENV === 'development'
    if (dev) {
      await faceapi.loadTinyFaceDetectorModel(environment.urlDev + 'models')
      await faceapi.loadFaceLandmarkTinyModel(environment.urlDev + 'models')
    } else {
      await faceapi.loadTinyFaceDetectorModel(environment.urlProd + 'models')
      await faceapi.loadFaceLandmarkTinyModel(environment.urlProd + 'models')
    }
    const initial = document.getElementById('initial_black')
    await faceapi
      .detectAllFaces(
        initial,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: environment.tinyInputSize,
          scoreThreshold: environment.tinyThreshold
        })
      )
      .withFaceLandmarks(true)

    this.setState({ isLoading: false })
  }

  // ================================================================================
  // React event handler functions
  // ================================================================================
  handleWebcam = () => {
    if (this.state.isPlaying) {
      window.clearInterval(this.interval)
      const canvas = document.getElementById('sensor_webcamcrop_overlay')
      if (canvas instanceof HTMLCanvasElement) {
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height)
      }
      this.tickBlink = 0
      this.setState({
        isPlaying: false,
        isSensing: false
      })
    } else {
      this.setState({
        isPlaying: true
      })
    }
  }

  handleSense = async () => {
    if (this.state.isSensing) {
      await window.clearInterval(this.interval)
      const canvas = document.getElementById('sensor_webcamcrop_overlay')
      if (canvas instanceof HTMLCanvasElement) {
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height)
      }
      this.tickBlink = 0
      this.setState({
        isSensing: false
      })
    } else {
      this.interval = window.setInterval(async () => await this.faceMain(), 10)
      this.tickBlink = 0
      this.setState({
        isSensing: true
      })
    }
  }

  // ================================================================================
  // Facec recognition functions
  // ================================================================================
  faceMain = async () => {
    const image = document.getElementById('sensor_webcamcrop')
    const canvas = document.getElementById('sensor_webcamcrop_overlay')
    if (
      canvas instanceof HTMLCanvasElement &&
      image instanceof HTMLCanvasElement
    ) {
      await this.faceRecognize(canvas, image)
      const tend = performance.now()
      this.tickProcess = Math.floor(tend - this.tick)
      const tickProcess = this.tickProcess.toString() + ' ms'
      this.tick = tend
      const anchor = { x: 0, y: this.props.setting.rect.height * 2 }
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
    const result = await faceapi
      .detectSingleFace(
        image,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: environment.tinyInputSize,
          scoreThreshold: environment.tinyThreshold
        })
      )
      .withFaceLandmarks(true)

    if (result) {
      faceapi.matchDimensions(canvas, image)
      const resizedResult = faceapi.resizeResults(result, image)
      faceapi.draw.drawDetections(canvas, resizedResult)
      faceapi.draw.drawFaceLandmarks(canvas, resizedResult)

      const leftEye = resizedResult.landmarks.getLeftEye()
      const rightEye = resizedResult.landmarks.getRightEye()
      const EAR = calcEAR(leftEye) + calcEAR(rightEye)
      const text = ['EAR: ' + EAR.toString()]
      if (EAR < environment.blinkEARThreshold) {
        this.tickBlink += this.tickProcess
        text.push('Time:' + this.tickBlink.toString())
        if (this.tickBlink > environment.blinkTimeThreshold)
          text.push('DROWSINESS ALERT!!')
      } else {
        this.tickBlink = 0
      }
      const anchor = { x: 0, y: 0 }
      const drawOptions = {
        anchorPosition: 'TOP_LEFT',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        fontColor: 'yellow'
      }
      const drawBox = new faceapi.draw.DrawTextField(text, anchor, drawOptions)
      drawBox.draw(canvas)
    } else {
      this.tickBlink = 0
      const context = canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  // ================================================================================
  // React render functions
  // ================================================================================
  renderButton = () => {
    const renderWebcamPower = this.state.isPlaying ? (
      <Tooltip title="Webcam stop">
        <IconButton
          className={this.props.classes.icon}
          onClick={this.handleWebcam}
          color="secondary">
          <IconCamera />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip title="Webcam start">
        <IconButton
          className={this.props.classes.icon}
          onClick={this.handleWebcam}
          color="primary">
          <IconCamera />
        </IconButton>
      </Tooltip>
    )

    const renderRecognize = this.state.isSensing ? (
      <Tooltip title="Recognize stop">
        <IconButton
          className={this.props.classes.icon}
          onClick={this.handleSense}
          color="secondary">
          <IconSensor />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip title="Recognize start">
        <IconButton
          className={this.props.classes.icon}
          onClick={this.handleSense}
          color="primary">
          <IconSensor />
        </IconButton>
      </Tooltip>
    )

    return (
      <CardActions>
        {renderWebcamPower}
        <Tooltip title="Camera settings">
          <Link to="/setting">
            <IconButton className={this.props.classes.icon} color="primary">
              <IconSettings />
            </IconButton>
          </Link>
        </Tooltip>
        {this.state.isPlaying ? renderRecognize : null}
      </CardActions>
    )
  }

  renderWebCam = () => {
    const { setting } = this.props

    if (this.state.isPlaying) {
      return (
        <div className={this.props.classes.webcamContainer}>
          <WebcamCrop
            className={this.props.classes.webcam}
            audio={false}
            idCanvas={'sensor_webcamcrop'}
            videoWidth={setting.rect.width * 2}
            videoHeight={setting.rect.height * 2}
            videoConstraints={setting.video}
            cropx={setting.rect.x}
            cropy={setting.rect.y}
            cropwidth={setting.rect.width}
            cropheight={setting.rect.height}
          />
          <canvas
            className={this.props.classes.webcamOverlay}
            id={'sensor_webcamcrop_overlay'}
            width={setting.rect.width * 2}
            height={setting.rect.height * 2}
          />
        </div>
      )
    } else {
      return <img src={imageSensor} alt={'sensor'} width={640} height={480} />
    }
  }

  render() {
    if (this.state.isLoading) return <Loading />

    return (
      <Layout
        helmet={true}
        title={'Sensor'}
        gridNormal={6}
        gridPhone={10}
        content={
          <Card className={this.props.classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Sensor
              </Typography>
              <Divider className={this.props.classes.divider} />
              <Grid
                container={true}
                className={this.props.classes.grid}
                justify="center">
                {this.renderWebCam()}
              </Grid>
              <Divider className={this.props.classes.divider} />
            </CardContent>
            {this.renderButton()}
          </Card>
        }
      />
    )
  }
}

Sensor.propTypes = {
  classes: PropTypes.object.isRequired,
  setting: PropTypes.shape({
    rect: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number
    }),
    video: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    })
  })
}

const mapStateToProps = state => {
  return {
    setting: state.setting
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actionsI: bindActionCreators(actionInfo, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Sensor)))
