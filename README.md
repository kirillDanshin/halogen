Halogenium [![npm version](https://badge.fury.io/js/halogenium.svg)](http://badge.fury.io/js/halogenium)
=======

[![NPM](https://nodei.co/npm/halogenium.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/halogenium/)

A collection of loading spinners with React.js based on [halogen](https://github.com/yuanyan/halogen). Now supports React.js 15.0+ (16.0+ too!) and Safari.

## Demo & Examples

Live demo: [kirilldanshin.github.io/halogenium](http://kirilldanshin.github.io/halogenium/)

To build the examples locally, run:

```
npm install
gulp dev
```

Then open [`localhost:9999`](http://localhost:9999) in a browser.

## Installation

The easiest way to use `halogenium` is to install it from NPM and import it.

You can also use the standalone build by including `dist/halogenium.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install halogenium --save
```

## Usage

```javascript
import React, { Component } from 'react';
import { PulseLoader } from 'halogenium';

export default class Example extends Component {
	render() {
		return (
			<PulseLoader color="#26A65B" size="16px" margin="4px"/>
		);
	}
}

```

## Loaders

* PulseLoader
* RotateLoader
* BeatLoader
* RiseLoader
* SyncLoader
* GridLoader
* ClipLoader
* FadeLoader
* ScaleLoader
* SquareLoader
* PacmanLoader
* SkewLoader
* RingLoader
* MoonLoader
* DotLoader
* BounceLoader

## Browser Support

![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
IE 10+ ✔ | Chrome 4.0+ ✔ | Firefox 16.0+ ✔ | Opera 15.0+ ✔ | Safari 4.0+ ✔ |
