// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme: Object) => ({
  root: {
    width: '100%',
    height: '60vh',
    background: 'linear-gradient(165deg, #ff5722 30%, #ffff00, #cddc39)'
  }
})

type Props = {
  classes: Object
}

const Ribbon = (props: Props) => {
  return <div className={props.classes.root} />
}

Ribbon.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Ribbon)
