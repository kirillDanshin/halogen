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

const radius = 20
const quarter = (radius / 2) + (radius / 5.5)

const lines = {
  l1: {
    top: radius,
    left: 0,
    transform: 'none',
  },
  l2: {
    top: quarter,
    left: quarter,
    transform: 'rotate(-45deg)',
  },
  l3: {
    top: 0,
    left: radius,
    transform: 'rotate(90deg)',
  },
  l4: {
    top: -quarter,
    left: quarter,
    transform: 'rotate(45deg)',
  },
  l5: {
    top: -radius,
    left: 0,
    transform: 'none',
  },
  l6: {
    top: -quarter,
    left: -quarter,
    transform: 'rotate(-45deg)',
  },
  l7: {
    top: 0,
    left: -radius,
    transform: 'rotate(90deg)',
  },
  l8: {
    top: quarter,
    left: -quarter,
    transform: 'rotate(45deg)',
  },
}

const animation = keyframes`
  50% {
    opacity: 0.3;
  }

  100% {
    opacity: 1;
  }
`

const getSize = size => typeof size === 'number' ? `${size}px` : size

const Line = styled.div`
  background-color: ${({ color }) => color};
  height: ${({ height }) => getSize(height)};
  width: ${({ width }) => getSize(width)};
  margin: ${({ margin }) => getSize(margin)};
  border-radius: ${({ radius }) => radius};
  vertical-align: ${({ verticalAlign }) => getSize(verticalAlign)};
  top: ${({ idx }) => lines[`l${idx}`].top}px;
  left: ${({ idx }) => lines[`l${idx}`].left}px;
  transform: ${({ idx }) => lines[`l${idx}`].transform};
  animation: ${animation} 1.2s ${({ idx }) => (idx * 0.12)}s infinite ease-in-out;
  animation-fill-mode: both;
  position: absolute;
  border: 0px solid transparent;
`

export default class FadeLoader extends Component {
  static propTypes = propTypes;

  static defaultProps = {
    loading: true,
    color: '#ffffff',
    height: '15px',
    width: '5px',
    margin: '2px',
    radius: '2px',
  }

  render() {
    const { loading } = this.props

    if (loading) {
      const style = {
        position: 'relative',
        fontSize: 0,
      }

      const props = { ...this.props }

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
          <div style={style}>
            {
              Array.from({ length: 8 }).map((_, i) => (
                <Line key={i} {...lineProps} idx={i + 1} />
              ))
            }
          </div>
        </div>
      )
    }

    return null
  }
}
