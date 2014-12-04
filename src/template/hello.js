/*jslint node: true, browser: true, nomen: true, todo: true */

var React = require('react');

module.exports = function () {
    return (
        React.createElement("h1", null, "Hello, world!")
    );
};

/*module.exports = React.createClass({
    render: function () {
        return (
            <h1>Hello, world!</h1>
        );
    }
});*/

/*module.exports = React.render(
  <h1>Hello, world!</h1>,
  document.getElementById('hello')
);*/