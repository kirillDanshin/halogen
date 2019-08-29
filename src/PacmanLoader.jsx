import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  margin: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  verticalAlign: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

const ptKeys = Object.keys(propTypes)

const getNumberSize = size => parseInt(size, 10) | 0
const getSize = size => typeof size === 'number' ? `${size}px` : size

const getAnimation = size => keyframes`
  75% {
    opacity: 0.7;
  }

  100% {
    transform: translate(${-4 * getNumberSize(size)}px, ${-getNumberSize(size) / 4}px);
  }
`

const Pacman = styled.div`
  width: 0;
  height: 0;
  border-right: ${({ size }) => getSize(size)} solid transparent;
  border-top: ${({ size }) => getSize(size)} solid ${({ color }) => color};
  border-left: ${({ size }) => getSize(size)} solid ${({ color }) => color};
  border-bottom: ${({ size }) => getSize(size)} solid ${({ color }) => color};
  border-radius: ${({ size }) => getSize(size)};
`

const Ball = styled.div`
  background-color: ${({ color }) => color};
  margin: ${({ margin }) => getSize(margin)};
  border-radius: 100%;
  vertical-align: ${({ verticalAlign }) => getSize(verticalAlign)};
  border: 0px solid transparent;
  animation: ${({ size }) => getAnimation(size)} 1s ${({ idx }) => idx * 0.25}s infinite linear;
  animation-fill-mode: both;
  width: ${({ size }) => getNumberSize(size) / 2.5}px;
  height: ${({ size }) => getNumberSize(size) / 2.5}px;
  transform: translate(0, -${({ size }) => getNumberSize(size) / 5}px);
  position: absolute;
  top: ${({ size }) => getSize(size)};
  left: ${({ size }) => getNumberSize(size) * 4}px;
`

export default class PacmanLoader extends Component {
  static propTypes = propTypes;

  /**
   * @return {Object}
   */
  static defaultProps = {
    loading: true,
    color: '#fff',
    size: 25,
    margin: 2,
  }

  render() {
    const { loading, size, color } = this.props

    if (loading) {
      const style = {
        position: 'relative',
        fontSize: 0,
      }
      const props = Object.assign({}, this.props)

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
            <Pacman size={size} color={color} />
            <Ball {...ballProps} idx={1} />
            <Ball {...ballProps} idx={2} />
            <Ball {...ballProps} idx={3} />
            <Ball {...ballProps} idx={4} />
          </div>
        </div>
      )
    }

    return null
  }
}
