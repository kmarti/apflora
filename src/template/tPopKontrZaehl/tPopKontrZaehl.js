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
                    React.createElement("tr", {id: "fieldcontain_TPopKontrZaehleinheit", className: "fieldcontain feldTpopkontr TPopKontrZaehleinheit"}, 
                        React.createElement("td", {className: "labelFieldset"}, 
                            React.createElement("label", {htmlFor: "TPopKontrZaehleinheit", style: labelStyle, className: "apf-with-tooltip"}, 
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
                            React.createElement("select", {id: "TPopKontrZaehleinheit", name: "TPopKontrZaehleinheit", className: "speichern", 'data-formular': "tpopkontrzaehl"}, 
                                React.createElement("option", null)
                            )
                        )
                    ), 
                    React.createElement("tr", {id: "fieldcontain_TPopKontrMethode", className: "fieldcontain feldTpopkontr TPopKontrMethode"}, 
                        React.createElement("td", {className: "labelFieldset"}, 
                            React.createElement("label", {htmlFor: "TPopKontrMethode", style: labelStyle}, "Methode:")
                        ), 
                        React.createElement("td", {className: "Datenfelder"}, 
                            React.createElement("input", {type: "radio", id: "TPopKontrMethode1", name: "TPopKontrMethode", className: "speichern", 'data-formular': "tpopkontrzaehl", value: "1"}), 
                            React.createElement("label", {htmlFor: "TPopKontrMethode1"}, "geschätzt"), React.createElement("br", null), 
                            React.createElement("input", {type: "radio", id: "TPopKontrMethode2", name: "TPopKontrMethode", className: "speichern", 'data-formular': "tpopkontrzaehl", value: "2"}), 
                            React.createElement("label", {htmlFor: "TPopKontrMethode2"}, "gezählt"), React.createElement("br", null), 
                            React.createElement("input", {type: "radio", id: "TPopKontrMethode3", name: "TPopKontrMethode", className: "speichern", 'data-formular': "tpopkontrzaehl", value: "3"}), 
                            React.createElement("label", {htmlFor: "TPopKontrMethode3"}, "geschätzt/gezählt")
                        )
                    ), 
                    React.createElement("tr", {id: "fieldcontain_TPopKontrAnz", className: "fieldcontain feldTpopkontr TPopKontrAnz"}, 
                        React.createElement("td", {className: "labelFieldset"}, 
                            React.createElement("label", {htmlFor: "TPopKontrAnz", style: labelStyle, className: "apf-with-tooltip"}, 
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
                            React.createElement("input", {id: "TPopKontrAnz", name: "TPopKontrAnz", className: "speichern", 'data-formular': "tpopkontrzaehl", type: "number", value: this.props.Anzahl, onChange: this.handleChange}), 
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