/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var React = require('react'),
    fieldsetStyle = {
        background: 'none'
    },
    labelStyle = {
        width: 115
    };

var tPopKontrZaehl = React.createClass({displayName: 'tPopKontrZaehl',
    getInitialState: function () {
        return this.props;
    },
    handleChange: function (event) {
        this.setState({value: event.target.value});
    },
    render: function () {
        return (
            React.createElement("fieldset", {style: fieldsetStyle}, 
                React.createElement("legend", null, "Test. Zähleinheit"), 
                React.createElement("table", null, 
                    React.createElement("tr", {id: "fieldcontain_Zaehleinheit", className: "fieldcontain feldTpopkontr Zaehleinheit"}, 
                        React.createElement("td", {className: "labelFieldset"}, 
                            React.createElement("label", {htmlFor: "Zaehleinheit", style: labelStyle, className: "apf-with-tooltip"}, 
                                React.createElement("span", null, "Einheit:")
                            ), 
                            React.createElement("div", {className: "tooltiptext"}, 
                                React.createElement("p", null, "Spezialfall", React.createElement("br", null), "Vorkommen gemeldet ohne Zahlenangabe, z.B. durch Dritte:"), 
                                React.createElement("ul", null, 
                                    React.createElement("li", null, "Einheit: 'Art ist vorhanden' (letzter Punkt auf Auswahlliste)"), 
                                    React.createElement("li", null, "Anzahl: 1")
                                )
                            )
                        ), 
                        React.createElement("td", {className: "Datenfelder"}, 
                            React.createElement("select", {id: "Zaehleinheit", name: "Zaehleinheit", className: "speichern", 'data-formular': "tpopkontrzaehl"}, 
                                React.createElement("option", null)
                            )
                        )
                    ), 
                    React.createElement("tr", {id: "fieldcontain_Methode", className: "fieldcontain feldTpopkontr Methode"}, 
                        React.createElement("td", {className: "labelFieldset"}, 
                            React.createElement("label", {htmlFor: "Methode", style: labelStyle}, "Methode:")
                        ), 
                        React.createElement("td", {className: "Datenfelder"}, 
                            React.createElement("input", {type: "radio", id: "Methode1", name: "Methode", className: "speichern", 'data-formular': "tpopkontrzaehl", value: "1"}), 
                            React.createElement("label", {htmlFor: "Methode1"}, "geschätzt"), React.createElement("br", null), 
                            React.createElement("input", {type: "radio", id: "Methode2", name: "Methode", className: "speichern", 'data-formular': "tpopkontrzaehl", value: "2"}), 
                            React.createElement("label", {htmlFor: "Methode2"}, "gezählt"), React.createElement("br", null), 
                            React.createElement("input", {type: "radio", id: "Methode3", name: "Methode", className: "speichern", 'data-formular': "tpopkontrzaehl", value: "3"}), 
                            React.createElement("label", {htmlFor: "Methode3"}, "geschätzt/gezählt")
                        )
                    ), 
                    React.createElement("tr", {id: "fieldcontain_Anzahl", className: "fieldcontain feldTpopkontr Anzahl"}, 
                        React.createElement("td", {className: "labelFieldset"}, 
                            React.createElement("label", {htmlFor: "Anzahl", style: labelStyle, className: "apf-with-tooltip"}, 
                                React.createElement("span", null, "Anzahl:")
                            ), 
                            React.createElement("div", {className: "tooltiptext"}, 
                                React.createElement("p", null, "Spezialfall", React.createElement("br", null), "Vorkommen gemeldet ohne Zahlenangabe, z.B. durch Dritte:"), 
                                React.createElement("ul", null, 
                                    React.createElement("li", null, "Einheit: 'Art ist vorhanden' (letzter Punkt auf Auswahlliste)"), 
                                    React.createElement("li", null, "Anzahl: 1")
                                )
                            )
                        ), 
                        React.createElement("td", {className: "Datenfelder"}, 
                            React.createElement("input", {id: "Anzahl", name: "Anzahl", className: "speichern", 'data-formular': "tpopkontrzaehl", type: "number", value: this.props.Anzahl, onChange: this.handleChange}), 
                            React.createElement("input", {type: "number", name: "TPopKontrZaehlId", 'data-formular': "tpopkontrzaehl", value: this.props.TPopKontrZaehlId}), 
                            React.createElement("input", {type: "number", name: "TPopKontrId", 'data-formular': "tpopkontrzaehl", value: this.props.TPopKontrId})
                        )
                    )
                )
            )
        );
    }
});

module.exports = tPopKontrZaehl;