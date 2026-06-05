/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import useStyles from '../src/useStyles'
import StyleContext from '../src/StyleContext'

describe('useStyles(...styles)', () => {
  it('Should call insertCss and removeCss functions provided by context', () => {
    function FooWithStyles() {
      useStyles('')
      return <div />
    }

    const insertCss = jest.fn(() => {})
    const context = { insertCss }
    const container = global.document.createElement('div')

    const root = createRoot(container)
    act(() => {
      root.render(
        <StyleContext.Provider value={context}>
          <FooWithStyles />
        </StyleContext.Provider>,
      )
    })
    act(() => {
      root.unmount()
    })
    expect(insertCss).toHaveBeenCalledTimes(1)
  })
})
