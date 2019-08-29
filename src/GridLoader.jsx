import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

/**
 * @param  {Number} top
 * @return {Number}
 */
function random(top) {
  return Math.random() * top
}

const propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  margin: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  verticalAlign: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

const ptKeys = Object.keys(propTypes)

const getSize = size => typeof size === 'number' ? `${size}px` : size

const animation = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.5);
    opacity: 0.7;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
`

const Ball = styled.div`
  background-color: ${({ color }) => color};
  width: ${({ size }) => getSize(size)};
  height: ${({ size }) => getSize(size)};
  margin: ${({ margin }) => getSize(margin)};
  border-radius: 100%;
  vertical-align: ${({ verticalAlign }) => getSize(verticalAlign)};
  animation: ${animation} ${() => (random(100) / 100) + 0.6}s ${() => (random(100) / 100) - 0.2}s infinite ease;
  animation-fill-mode: both;
  display: inline-block;
  border: 0px solid transparent;
`

export default class GridLoader extends Component {
  static propTypes = propTypes;

  static defaultProps = {
    loading: true,
    color: '#ffffff',
    size: '15px',
    margin: '2px',
  }

  render() {
    const { loading } = this.props

    if (loading) {
      const style = {
        width: (parseFloat(this.props.size) * 3) + parseFloat(this.props.margin) * 6,
        fontSize: 0,
      }

      const props = { ...this.props }

      if (propTypes && ptKeys) {
        const klen = ptKeys.length
        for (let i = 0; i < klen; i++) {
          delete props[ptKeys[i]]
        }
      }

      const ballProps = ptKeys.reduce((acc, key) => (key === 'loading' ? acc : {
        ...acc,
        [key]: this.props[key],
      }), {})

      return (
        <div {...props}>
          <div style={style}>
            {
              Array.from({ length: 9 }).map((_, i) => (
                <Ball key={i} {...ballProps} idx={i + 1} />
              ))
            }
          </div>
        </div>
      )
    }

    return null
  }
}
