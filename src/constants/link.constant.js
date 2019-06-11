// @flow

import type { LinkSite } from '../models/misc.model'

export const linkHeader: LinkSite[] = [
  { text: 'Home', link: '/home' },
  { text: 'Setting', link: '/setting' },
  { text: 'Sensor', link: '/sensor' },
  { text: 'Validator', link: '/validator' }
]

export const linkDrawer: LinkSite[] = [
  {
    text: 'Eye Blink Detection',
    link: 'http://vision.fe.uni-lj.si/cvww2016/proceedings/papers/05.pdf'
  },
  {
    text: 'face-api.js',
    link: 'https://github.com/justadudewhohacks/face-api.js'
  },
  { text: 'Tensorflow', link: 'https://www.tensorflow.org/' },
  { text: 'Tensorflow.js', link: 'https://js.tensorflow.org/' },
  { text: 'React', link: 'https://facebook.github.io/react/' },
  { text: 'Redux', link: 'http://redux.js.org/' },
  { text: 'Material Design Lite', link: 'https://getmdl.io/' },
  { text: 'Material-UI', link: 'https://material-ui.com/' }
]
