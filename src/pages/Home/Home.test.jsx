import * as React from 'react'
import Home from './Home'
import { createMockStore } from 'redux-test-utils'
import shallowWithStore from '../../helpers/enzyme.helper'

describe('Page >> Home test', () => {
  it('should render successfully', () => {
    const mockState = {
      image: { switch: true }
    }
    const store = createMockStore(mockState)
    const component = shallowWithStore(<Home />, store)
    expect(component).toBeTruthy()
  })
})
