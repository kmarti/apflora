/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var React = require('react');

module.exports = React.createClass({displayName: 'exports',
    render: function () {
        var fieldsetStyle = {
                background: 'none'
            },
            labelStyle = {
                width: 115
            };
        return (
                React.createElement("fieldset", {style: fieldsetStyle}, 
                React.createElement("legend", null, "Test. Zähleinheit"), 
                React.createElement("table", null, 
                    React.createElement("tr", {id: "fieldcontain_TPopKontrZaehleinheit1", className: "fieldcontain feld_tpopfeldkontr TPopKontrZaehleinheit1"}, 
                        React.createElement("td", {className: "label_fieldset"}, 
                            React.createElement("label", {htmlFor: "TPopKontrZaehleinheit1", style: labelStyle, className: "apf-with-tooltip"}, 
                                React.createElement("span", null, "Einheit:")
                            ), 
                            React.createElement("div", {className: "tooltiptext"}, 
                                React.createElement("p", null, "Spezialfall", React.createElement("br", null), "Vorkommen gemeldet ohne Zahlenangabe, z.B. durch Dritte:"), 
                                React.createElement("ul", null, 
                                    React.createElement("li", null, "Einheit: \"Art ist vorhanden\" (letzter Punkt auf Auswahlliste)"), 
                                    React.createElement("li", null, "Anzahl: 1")
                                )
                            )
                        ), 
                        React.createElement("td", {className: "Datenfelder"}, 
                            React.createElement("select", {id: "TPopKontrZaehleinheit1", name: "TPopKontrZaehleinheit1", className: "speichern", formular: "tpopfeldkontr"}, 
                                React.createElement("option", null)
                            )
                        )
                    ), 
                    React.createElement("tr", {id: "fieldcontain_TPopKontrMethode1", className: "fieldcontain feld_tpopfeldkontr TPopKontrMethode1"}, 
                        React.createElement("td", {className: "label_fieldset"}, 
                            React.createElement("label", {htmlFor: "TPopKontrMethode1", style: labelStyle}, "Methode:")
                        ), 
                        React.createElement("td", {className: "Datenfelder"}, 
                            React.createElement("input", {type: "radio", name: "TPopKontrMethode1", id: "TPopKontrMethode11", className: "speichern", formular: "tpopfeldkontr", value: "1"}), 
                            React.createElement("label", {htmlFor: "TPopKontrMethode11"}, "geschätzt"), React.createElement("br", null), 
                            React.createElement("input", {type: "radio", name: "TPopKontrMethode1", id: "TPopKontrMethode12", className: "speichern", formular: "tpopfeldkontr", value: "2"}), 
                            React.createElement("label", {htmlFor: "TPopKontrMethode12"}, "gezählt"), React.createElement("br", null), 
                            React.createElement("input", {type: "radio", name: "TPopKontrMethode1", id: "TPopKontrMethode13", className: "speichern", formular: "tpopfeldkontr", value: "3"}), 
                            React.createElement("label", {htmlFor: "TPopKontrMethode13"}, "geschätzt/gezählt")
                        )
                    ), 
                    React.createElement("tr", {id: "fieldcontain_TPopKontrAnz1", className: "fieldcontain feld_tpopfeldkontr TPopKontrAnz1"}, 
                        React.createElement("td", {className: "label_fieldset"}, 
                            React.createElement("label", {htmlFor: "TPopKontrAnz1", style: labelStyle, className: "apf-with-tooltip"}, 
                                React.createElement("span", null, "Anzahl:")
                            ), 
                            React.createElement("div", {className: "tooltiptext"}, 
                                React.createElement("p", null, "Spezialfall", React.createElement("br", null), "Vorkommen gemeldet ohne Zahlenangabe, z.B. durch Dritte:"), 
                                React.createElement("ul", null, 
                                    React.createElement("li", null, "Einheit: \"Art ist vorhanden\" (letzter Punkt auf Auswahlliste)"), 
                                    React.createElement("li", null, "Anzahl: 1")
                                )
                            )
                        ), 
                        React.createElement("td", {className: "Datenfelder"}, 
                            React.createElement("input", {id: "TPopKontrAnz1", name: "TPopKontrAnz1", className: "speichern", formular: "tpopfeldkontr", type: "number"})
                        )
                    )
                )
            )
            );
    }
});