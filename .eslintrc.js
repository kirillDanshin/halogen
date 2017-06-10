const path = require('path');

const joinPath = (...paths) => (
	path.join(__dirname, ...paths)
);

module.exports = {
	"env": { "browser": true, "commonjs": true, "node": true },
	"extends": "airbnb",
	"parser": "babel-eslint",
	"plugins": [
		"babel",
		"import"
	],
	"rules": {
		"indent": [2, "tab"],
		"import/no-unresolved": [2, { "commonjs": true, "amd": true }],
		"new-cap": 0,
		"react/prop-types": 0,
		"react/jsx-indent": [2, "tab"],
		"react/jsx-indent-props": [2, "tab"],
		"react/jsx-closing-bracket-location": [1, { "selfClosing": "props-aligned", "nonEmpty": "after-props" }],
		"no-trailing-spaces": ["error", { "skipBlankLines": true }],
		"react/prefer-stateless-function": 0,
		"no-console": 0,
		"global-require": 0,
		"generator-star-spacing": 0,
		"babel/new-cap": ["error", { "capIsNew": false }],
		"array-bracket-spacing": 0,
		"object-curly-spacing": 0,
		"object-shorthand": 0,
		"arrow-parens": 0,
		"no-await-in-loop": 0,
		"no-mixed-operators": 0,
		"flow-object-type": 0,
		"func-params-comma-dangle": 0,
		"babel/generator-star-spacing": 1,
		"babel/array-bracket-spacing": 1,
		"babel/object-curly-spacing": 0,
		"babel/object-shorthand": 1,
		"babel/arrow-parens": 0,
		"babel/no-await-in-loop": 1,
		"babel/flow-object-type": 1,
		"babel/func-params-comma-dangle": 1,
		"babel/generator-star-spacing": 0,
		"import/no-unresolved": [2, { commonjs: true, amd: true }],
		"import/named": 2,
		"import/namespace": 2,
		"import/default": 2,
		"import/export": 2,
		"import/no-extraneous-dependencies": 0
	},
	"settings": {
		'import/resolver': {
			'alias': [
				['@components', joinPath('src', 'components')],
				['@containers', joinPath('src', 'containers')],
				['@actions', joinPath('src', 'actions')],
				['@reducers', joinPath('src', 'reducers')],
				['@types', joinPath('src', 'types')],
				['@config', joinPath('config')],
				['@stylevars', joinPath('src', 'styles', 'vars')],
				['@utils', joinPath('src', 'utils')],
				['@sagas', joinPath('src', 'sagas')],
				['@pages', joinPath('src', 'pages')],
			]
		}
	}
}
