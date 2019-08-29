import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.string,
  height: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  width: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  margin: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  radius: PropTypes.string,
  verticalAlign: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

const ptKeys = Object.keys(propTypes)

const getSize = size => typeof size === 'number' ? `${size}px` : size

const animation = keyframes`
  0% {
    transform: scaley(1.0);
  }

  50% {
    transform: scaley(0.4);
  }

  100% {
    transform: scaley(1.0);
  }
`

const Line = styled.div`
  background-color: ${({ color }) => color};
  width: ${({ width }) => getSize(width)};
  height: ${({ height }) => getSize(height)};
  margin: ${({ margin }) => getSize(margin)};
  border-radius: ${({ radius }) => getSize(radius)};
  vertical-align: ${({ verticalAlign }) => getSize(verticalAlign)};
  animation: ${animation} 1s ${({ idx }) => idx * 0.1}s infinite cubic-bezier(.2,.68,.18,1.08);
  animation-fill-mode: both;
  display: inline-block;
  border: 0px solid transparent;
`

export default class ScaleLoader extends Component {
  /**
   * @type {Object}
   */
  static propTypes = propTypes;

  static defaultProps = {
    loading: true,
    color: '#fff',
    height: '35px',
    width: '4px',
    margin: '2px',
    radius: '2px',
  }

  render() {
    const { loading } = this.props

    if (loading) {
      const props = Object.assign({}, this.props)

      if (propTypes && ptKeys) {
        const klen = ptKeys.length
        for (let i = 0; i < klen; i++) {
          delete props[ptKeys[i]]
        }
      }

      const lineProps = ptKeys.reduce((acc, key) => (key === 'loading' ? acc : {
        ...acc,
        [key]: this.props[key],
      }), {})

      return (
        <div {...props}>
          {
            Array.from({ length: 5 }).map((_, i) => (
              <Line key={i} {...lineProps} idx={i + 1} />
            ))
          }
        </div>
      )
    }

    return null
  }
}
