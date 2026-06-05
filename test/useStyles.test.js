/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, Children, act } from 'react'
import PropTypes from 'prop-types'
import { createRoot } from 'react-dom/client'
import useStyles from '../src/useStyles'
import StyleContext from '../src/StyleContext'

describe('useStyles(...styles)', () => {
  it('Should call insertCss and removeCss functions provided by context', () => {
    class Provider extends Component {
      render() {
        const { insertCss, children } = this.props
        return (
          <StyleContext.Provider value={{ insertCss }}>
            {Children.only(children)}
          </StyleContext.Provider>
        )
      }
    }

    Provider.propTypes = {
      insertCss: PropTypes.func.isRequired,
      children: PropTypes.node.isRequired,
    }

    const FooWithStyles = () => {
      useStyles('')
      return <div />
    }

    const insertCss = jest.fn(() => {})
    const container = global.document.createElement('div')

    const root = createRoot(container)
    act(() => {
      root.render(
        <Provider insertCss={insertCss}>
          <FooWithStyles />
        </Provider>,
      )
    })
    act(() => {
      root.unmount()
    })
    expect(insertCss).toBeCalledTimes(1)
  })
})
