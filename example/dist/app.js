require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var selfCleaningTimeout = {
    componentDidUpdate: function componentDidUpdate() {
        clearTimeout(this.timeoutID);
    },

    setTimeout: function (_setTimeout) {
        function setTimeout() {
            return _setTimeout.apply(this, arguments);
        }

        setTimeout.toString = function () {
            return _setTimeout.toString();
        };

        return setTimeout;
    }(function () {
        clearTimeout(this.timeoutID);
        this.timeoutID = setTimeout.apply(null, arguments);
    })
};

var ComponentPreview = React.createClass({
    displayName: 'ComponentPreview',

    propTypes: {
        code: React.PropTypes.string.isRequired
    },

    mixins: [selfCleaningTimeout],

    render: function render() {
        return React.createElement('div', { ref: 'mount' });
    },

    componentDidMount: function componentDidMount() {
        this.executeCode();
    },

    componentDidUpdate: function componentDidUpdate(prevProps) {
        // execute code only when the state's not being updated by switching tab
        // this avoids re-displaying the error, which comes after a certain delay
        if (this.props.code !== prevProps.code) {
            this.executeCode();
        }
    },

    compileCode: function compileCode() {
        return JSXTransformer.transform('(function() {' + this.props.code + '\n})();', { harmony: true }).code;
    },

    executeCode: function executeCode() {
        var mountNode = this.refs.mount;

        try {
            ReactDOM.unmountComponentAtNode(mountNode);
        } catch (e) {}

        try {
            var compiledCode = this.compileCode();
            ReactDOM.render(eval(compiledCode), mountNode);
        } catch (err) {
            debugger;
            this.setTimeout(function () {
                ReactDOM.render(React.createElement(
                    'div',
                    { className: 'playgroundError' },
                    err.toString()
                ), mountNode);
            }, 500);
        }
    }
});

var IS_MOBILE = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i);

var CodeMirrorEditor = React.createClass({
    displayName: 'CodeMirrorEditor',

    componentDidMount: function componentDidMount() {
        if (IS_MOBILE) return;

        this.editor = CodeMirror.fromTextArea(this.refs.editor, {
            mode: 'javascript',
            //lineNumbers: true,
            viewportMargin: Infinity,
            lineWrapping: true,
            smartIndent: false, // javascript mode does bad things with jsx indents
            matchBrackets: true,
            readOnly: this.props.readOnly
        });
        this.editor.on('change', this.handleChange);
    },

    componentDidUpdate: function componentDidUpdate() {
        if (this.props.readOnly) {
            this.editor.setValue(this.props.codeText);
        }
    },

    handleChange: function handleChange() {
        if (!this.props.readOnly && this.props.onChange) {
            this.props.onChange(this.editor.getValue());
        }
    },

    render: function render() {
        // wrap in a div to fully contain CodeMirror
        var editor;

        if (IS_MOBILE) {
            editor = React.createElement(
                'pre',
                { style: { overflow: 'scroll' } },
                this.props.codeText
            );
        } else {
            editor = React.createElement('textarea', { ref: 'editor', defaultValue: this.props.codeText });
        }

        return React.createElement(
            'div',
            { style: this.props.style, className: this.props.className },
            editor
        );
    }
});

var ReactPlayground = React.createClass({
    displayName: 'ReactPlayground',

    propTypes: {
        codeText: React.PropTypes.string.isRequired
    },

    getInitialState: function getInitialState() {
        return {
            code: this.props.codeText
        };
    },

    handleCodeChange: function handleCodeChange(code) {
        this.setState({
            code: code
        });
    },

    changeTab: function changeTab() {
        if (this.state.tab == 'preview') this.setState({
            tab: 'edit'
        });else this.setState({
            tab: 'preview'
        });
    },

    render: function render() {

        var tabText = this.state.tab == 'preview' ? 'Live Preview' : 'Live Edit';
        var code = React.createElement(
            'div',
            { className: 'playgroundCode' },
            React.createElement(CodeMirrorEditor, { key: 'jsx',
                onChange: this.handleCodeChange,
                className: 'playgroundStage',
                codeText: this.state.code })
        );

        var preview = React.createElement(
            'div',
            { className: 'playgroundPreview' },
            React.createElement(ComponentPreview, { code: this.state.code })
        );

        return React.createElement(
            'div',
            { className: 'playground' },
            React.createElement(
                'div',
                { className: 'playgroundTab', onClick: this.changeTab },
                React.createElement(
                    'span',
                    { className: 'blur' },
                    tabText
                )
            ),
            this.state.tab == 'preview' ? code : preview
        );
    }
});

for (var id = 1; id < 10; id++) {
    var example = document.getElementById('example' + id);
    if (example) {
        ReactDOM.render(React.createElement(ReactPlayground, { codeText: document.getElementById('code' + id).innerHTML }), example);
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJSZWFjdERPTSIsInNlbGZDbGVhbmluZ1RpbWVvdXQiLCJjb21wb25lbnREaWRVcGRhdGUiLCJjbGVhclRpbWVvdXQiLCJ0aW1lb3V0SUQiLCJzZXRUaW1lb3V0IiwiYXBwbHkiLCJhcmd1bWVudHMiLCJDb21wb25lbnRQcmV2aWV3IiwiY3JlYXRlQ2xhc3MiLCJwcm9wVHlwZXMiLCJjb2RlIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm1peGlucyIsInJlbmRlciIsImNvbXBvbmVudERpZE1vdW50IiwiZXhlY3V0ZUNvZGUiLCJwcmV2UHJvcHMiLCJwcm9wcyIsImNvbXBpbGVDb2RlIiwiSlNYVHJhbnNmb3JtZXIiLCJ0cmFuc2Zvcm0iLCJoYXJtb255IiwibW91bnROb2RlIiwicmVmcyIsIm1vdW50IiwidW5tb3VudENvbXBvbmVudEF0Tm9kZSIsImUiLCJjb21waWxlZENvZGUiLCJldmFsIiwiZXJyIiwidG9TdHJpbmciLCJJU19NT0JJTEUiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJtYXRjaCIsIkNvZGVNaXJyb3JFZGl0b3IiLCJlZGl0b3IiLCJDb2RlTWlycm9yIiwiZnJvbVRleHRBcmVhIiwibW9kZSIsInZpZXdwb3J0TWFyZ2luIiwiSW5maW5pdHkiLCJsaW5lV3JhcHBpbmciLCJzbWFydEluZGVudCIsIm1hdGNoQnJhY2tldHMiLCJyZWFkT25seSIsIm9uIiwiaGFuZGxlQ2hhbmdlIiwic2V0VmFsdWUiLCJjb2RlVGV4dCIsIm9uQ2hhbmdlIiwiZ2V0VmFsdWUiLCJvdmVyZmxvdyIsInN0eWxlIiwiY2xhc3NOYW1lIiwiUmVhY3RQbGF5Z3JvdW5kIiwiZ2V0SW5pdGlhbFN0YXRlIiwiaGFuZGxlQ29kZUNoYW5nZSIsInNldFN0YXRlIiwiY2hhbmdlVGFiIiwic3RhdGUiLCJ0YWIiLCJ0YWJUZXh0IiwicHJldmlldyIsImlkIiwiZXhhbXBsZSIsImRvY3Vt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QUEsY0FBSyxXQUFVLFlBQWY7QUFDRztBQUFBO0FBQUEsa0JBQUssV0FBVSxlQUFmLEVBQStCLFNBQVMsS0FBS21ELFNBQTdDO0FBQXdEO0FBQUE7QUFBQSxzQkFBTSxXQUFVLE1BQWhCO0FBQXdCRztBQUF4QjtBQUF4RCxhQURIO0FBRUksaUJBQUtGLEtBQUwsQ0FBV0MsR0FBWCxJQUFrQixTQUFsQixHQUE2QnJELElBQTdCLEdBQW1DdUQ7QUFGdkMsU0FERDtBQU1IO0FBaERtQyxDQUFsQixDQUF0Qjs7QUFtREEsS0FBSSxJQUFJQyxLQUFHLENBQVgsRUFBY0EsS0FBRyxFQUFqQixFQUFxQkEsSUFBckIsRUFBMEI7QUFDdEIsUUFBSUMsVUFBVUMsU0FBU0MsY0FBVCxDQUF3QixZQUFVSCxFQUFsQyxDQUFkO0FBQ0EsUUFBR0MsT0FBSCxFQUFXO0FBQ1BwRSxpQkFBU2dCLE1BQVQsQ0FDSSxvQkFBQyxlQUFELElBQWlCLFVBQVVxRCxTQUFTQyxjQUFULENBQXdCLFNBQU9ILEVBQS9CLEVBQW1DSSxTQUE5RCxHQURKLEVBRUlILE9BRko7QUFJSDtBQUNKIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUmVhY3RET00gPSByZXF1aXJlKCdyZWFjdC1kb20nKTtcblxudmFyIHNlbGZDbGVhbmluZ1RpbWVvdXQgPSB7XG4gICAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElEKTtcbiAgICB9LFxuXG4gICAgc2V0VGltZW91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJRCk7XG4gICAgICAgIHRoaXMudGltZW91dElEID0gc2V0VGltZW91dC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cbn07XG5cbnZhciBDb21wb25lbnRQcmV2aWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBjb2RlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9LFxuXG4gICAgbWl4aW5zOiBbc2VsZkNsZWFuaW5nVGltZW91dF0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gPGRpdiByZWY9XCJtb3VudFwiIC8+O1xuICAgIH0sXG5cbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0ZUNvZGUoKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbihwcmV2UHJvcHMpIHtcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIG9ubHkgd2hlbiB0aGUgc3RhdGUncyBub3QgYmVpbmcgdXBkYXRlZCBieSBzd2l0Y2hpbmcgdGFiXG4gICAgICAgIC8vIHRoaXMgYXZvaWRzIHJlLWRpc3BsYXlpbmcgdGhlIGVycm9yLCB3aGljaCBjb21lcyBhZnRlciBhIGNlcnRhaW4gZGVsYXlcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuY29kZSAhPT0gcHJldlByb3BzLmNvZGUpIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUNvZGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21waWxlQ29kZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBKU1hUcmFuc2Zvcm1lci50cmFuc2Zvcm0oXG4gICAgICAgICAgICAgICAgJyhmdW5jdGlvbigpIHsnICtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNvZGUgK1xuICAgICAgICAgICAgICAgICdcXG59KSgpOycsXG4gICAgICAgICAgICB7IGhhcm1vbnk6IHRydWUgfVxuICAgICAgICApLmNvZGU7XG4gICAgfSxcblxuICAgIGV4ZWN1dGVDb2RlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1vdW50Tm9kZSA9IHRoaXMucmVmcy5tb3VudDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgUmVhY3RET00udW5tb3VudENvbXBvbmVudEF0Tm9kZShtb3VudE5vZGUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGNvbXBpbGVkQ29kZSA9IHRoaXMuY29tcGlsZUNvZGUoKTtcbiAgICAgICAgICAgIFJlYWN0RE9NLnJlbmRlcihldmFsKGNvbXBpbGVkQ29kZSksIG1vdW50Tm9kZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVidWdnZXJcbiAgICAgICAgICAgIHRoaXMuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBSZWFjdERPTS5yZW5kZXIoXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGxheWdyb3VuZEVycm9yXCI+e2Vyci50b1N0cmluZygpfTwvZGl2PixcbiAgICAgICAgICAgICAgICAgICAgbW91bnROb2RlXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxudmFyIElTX01PQklMRSA9IChcbiAgICBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpXG4gICAgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvd2ViT1MvaSlcbiAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmUvaSlcbiAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpXG4gICAgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBvZC9pKVxuICAgIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0JsYWNrQmVycnkvaSlcbiAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9XaW5kb3dzIFBob25lL2kpXG4gICAgKTtcblxudmFyIENvZGVNaXJyb3JFZGl0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoSVNfTU9CSUxFKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5lZGl0b3IgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYSh0aGlzLnJlZnMuZWRpdG9yLCB7XG4gICAgICAgICAgICBtb2RlOiAnamF2YXNjcmlwdCcsXG4gICAgICAgICAgICAvL2xpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICAgICAgdmlld3BvcnRNYXJnaW46IEluZmluaXR5LFxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICAgICAgICAgICAgc21hcnRJbmRlbnQ6IGZhbHNlLCAgLy8gamF2YXNjcmlwdCBtb2RlIGRvZXMgYmFkIHRoaW5ncyB3aXRoIGpzeCBpbmRlbnRzXG4gICAgICAgICAgICBtYXRjaEJyYWNrZXRzOiB0cnVlLFxuICAgICAgICAgICAgcmVhZE9ubHk6IHRoaXMucHJvcHMucmVhZE9ubHlcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZWRpdG9yLm9uKCdjaGFuZ2UnLCB0aGlzLmhhbmRsZUNoYW5nZSk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnJlYWRPbmx5KSB7XG4gICAgICAgICAgICB0aGlzLmVkaXRvci5zZXRWYWx1ZSh0aGlzLnByb3BzLmNvZGVUZXh0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIXRoaXMucHJvcHMucmVhZE9ubHkgJiYgdGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLmVkaXRvci5nZXRWYWx1ZSgpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyB3cmFwIGluIGEgZGl2IHRvIGZ1bGx5IGNvbnRhaW4gQ29kZU1pcnJvclxuICAgICAgICB2YXIgZWRpdG9yO1xuXG4gICAgICAgIGlmIChJU19NT0JJTEUpIHtcbiAgICAgICAgICAgIGVkaXRvciA9IDxwcmUgc3R5bGU9e3tvdmVyZmxvdzogJ3Njcm9sbCd9fT57dGhpcy5wcm9wcy5jb2RlVGV4dH08L3ByZT47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlZGl0b3IgPSA8dGV4dGFyZWEgcmVmPVwiZWRpdG9yXCIgZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLmNvZGVUZXh0fSAvPjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLnByb3BzLnN0eWxlfSBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgICAgICAgIHtlZGl0b3J9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgfVxufSk7XG5cbnZhciBSZWFjdFBsYXlncm91bmQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGNvZGVUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9LFxuXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvZGU6IHRoaXMucHJvcHMuY29kZVRleHRcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgaGFuZGxlQ29kZUNoYW5nZTogZnVuY3Rpb24oY29kZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNvZGU6IGNvZGVcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNoYW5nZVRhYjogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYodGhpcy5zdGF0ZS50YWIgPT0gJ3ByZXZpZXcnKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgdGFiOiAnZWRpdCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHRhYjogJ3ByZXZpZXcnXG4gICAgICAgICAgICB9KVxuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciB0YWJUZXh0ID0gdGhpcy5zdGF0ZS50YWIgPT0gJ3ByZXZpZXcnPyAnTGl2ZSBQcmV2aWV3JzogJ0xpdmUgRWRpdCc7XG4gICAgICAgIHZhciBjb2RlID0gPGRpdiBjbGFzc05hbWU9XCJwbGF5Z3JvdW5kQ29kZVwiPlxuICAgICAgICAgICAgPENvZGVNaXJyb3JFZGl0b3Iga2V5PVwianN4XCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNvZGVDaGFuZ2V9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJwbGF5Z3JvdW5kU3RhZ2VcIlxuICAgICAgICAgICAgY29kZVRleHQ9e3RoaXMuc3RhdGUuY29kZX0gLz5cbiAgICAgICAgPC9kaXY+O1xuXG4gICAgICAgIHZhciBwcmV2aWV3ID0gPGRpdiBjbGFzc05hbWU9XCJwbGF5Z3JvdW5kUHJldmlld1wiPlxuICAgICAgICAgICAgPENvbXBvbmVudFByZXZpZXcgY29kZT17dGhpcy5zdGF0ZS5jb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwbGF5Z3JvdW5kXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBsYXlncm91bmRUYWJcIiBvbkNsaWNrPXt0aGlzLmNoYW5nZVRhYn0+PHNwYW4gY2xhc3NOYW1lPVwiYmx1clwiPnt0YWJUZXh0fTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgIHt0aGlzLnN0YXRlLnRhYiA9PSAncHJldmlldyc/IGNvZGU6IHByZXZpZXd9XG4gICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxufSk7XG5cbmZvcih2YXIgaWQ9MTsgaWQ8MTA7IGlkKyspe1xuICAgIHZhciBleGFtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4YW1wbGUnK2lkKTtcbiAgICBpZihleGFtcGxlKXtcbiAgICAgICAgUmVhY3RET00ucmVuZGVyKFxuICAgICAgICAgICAgPFJlYWN0UGxheWdyb3VuZCBjb2RlVGV4dD17ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGUnK2lkKS5pbm5lckhUTUx9IC8+LFxuICAgICAgICAgICAgZXhhbXBsZVxuICAgICAgICApO1xuICAgIH1cbn1cbiJdfQ==
},{"react":undefined,"react-dom":undefined}]},{},[1]);
