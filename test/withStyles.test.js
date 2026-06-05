/* eslint-disable max-classes-per-file */
/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, act } from 'react'
import createClass from 'create-react-class'
import { createRoot } from 'react-dom/client'
import withStyles from '../src/withStyles'

import StyleContext from '../src/StyleContext'

describe('withStyles(...styles)(WrappedComponent)', () => {
  it('Should call insertCss and removeCss functions provided by context', (done) => {
    class Foo extends Component {
      render() {
        return <div />
      }
    }

    const FooWithStyles = withStyles('')(Foo)
    const insertCss = jest.fn(() => done)
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

  it('Should set the displayName correctly', () => {
    expect(
      withStyles('')(
        class Foo extends Component {
          render() {
            return <div />
          }
        },
      ).displayName,
    ).toBe('WithStyles(Foo)')

    expect(
      withStyles('')(
        createClass({
          displayName: 'Bar',
          render() {
            return <div />
          },
        }),
      ).displayName,
    ).toBe('WithStyles(Bar)')

    expect(
      withStyles('')(
        createClass({
          render() {
            return <div />
          },
        }),
      ).displayName,
    ).toBe('WithStyles(Component)')
  })

  it('Should expose the component with styles as ComposedComponent', () => {
    class Container extends Component {
      render() {
        return <div />
      }
    }

    const decorated = withStyles('')(Container)
    expect(decorated.ComposedComponent).toBe(Container)
  })

  it('Hoists non-react statics of the composed component', () => {
    class Foo extends Component {
      render() {
        return <div />
      }
    }
    Foo.someStaticProperty = true

    const decorated = withStyles('')(Foo)
    expect(decorated.someStaticProperty).toBe(true)
  })

  it('Does not hoist react statics of the composed component', () => {
    class Foo extends Component {
      render() {
        return <div />
      }
    }
    Foo.propTypes = true

    const decorated = withStyles('')(Foo)
    expect(decorated.propTypes).not.toBeDefined()
  })
})
