// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router'
import { history } from './configureStore'
import { ConnectedRouter } from 'connected-react-router'
import { withStyles } from '@material-ui/core'
import withRoot from './withRoot'

import Header from './pages/Header'
import Ribbon from './pages/Ribbon'
import Footer from './pages/Footer'
import NotFound from './pages/NotFound'

import Home from './pages/Home/Home'
import Setting from './pages/Setting/Setting'
import Sensor from './pages/Sensor/Sensor'
import Validator from './pages/Validator/Validator'

const styles = (theme: Object) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column'
  },
  content: {
    marginTop: '-55vh',
    marginBottom: '60px',
    flex: 1
  }
})

type Props = {
  classes: Object
}

const App = (props: Props) => {
  return (
    <ConnectedRouter history={history}>
      <div className={props.classes.root}>
        <Header />
        <Ribbon />
        <div className={props.classes.content}>
          <Switch>
            <Route exact={true} path="/" component={Home} />
            <Route exact={true} path="/home" component={Home} />
            <Route exact={true} path="/setting" component={Setting} />
            <Route exact={true} path="/sensor" component={Sensor} />
            <Route exact={true} path="/validator" component={Validator} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </div>
    </ConnectedRouter>
  )
}

App.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRoot(withStyles(styles)(App))
