/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var React = require('react'),
    fieldsetStyle = {
        background: 'none'
    },
    labelStyle = {
        width: 115
    };

var tPopKontrZaehl = React.createClass({
    getInitialState: function () {
        return this.props;
    },
    handleChange: function (event) {
        this.setState({value: event.target.value});
    },
    render: function () {
        return (
            <fieldset style={fieldsetStyle}>
                <legend>Test. Zähleinheit</legend>
                <table>
                    <tr id='fieldcontain_TPopKontrZaehleinheit1' className='fieldcontain feldTpopkontr TPopKontrZaehleinheit1'>
                        <td className="labelFieldset">
                            <label htmlFor='TPopKontrZaehleinheit1' style={labelStyle} className='apf-with-tooltip'>
                                <span>Einheit:</span>
                            </label>
                            <div className="tooltiptext">
                                <p>Spezialfall<br/>Vorkommen gemeldet ohne Zahlenangabe, z.B. durch Dritte:</p>
                                <ul>
                                    <li>Einheit: "Art ist vorhanden" (letzter Punkt auf Auswahlliste)</li>
                                    <li>Anzahl: 1</li>
                                </ul>
                            </div>
                        </td>
                        <td className="Datenfelder">
                            <select id="TPopKontrZaehleinheit1" name="TPopKontrZaehleinheit1" className="speichern" data-formular="tpopkontrzaehl">
                                <option></option>
                            </select>
                        </td>
                    </tr>
                    <tr id='fieldcontain_TPopKontrMethode' className='fieldcontain feldTpopkontr TPopKontrMethode'>
                        <td className="labelFieldset">
                            <label htmlFor='TPopKontrMethode' style={labelStyle}>Methode:</label>
                        </td>
                        <td className="Datenfelder">
                            <input type="radio" name="TPopKontrMethode" id="TPopKontrMethode1" className="speichern" data-formular="tpopkontrzaehl" value="1"/>
                            <label htmlFor="TPopKontrMethode1">geschätzt</label><br/>
                            <input type="radio" name="TPopKontrMethode" id="TPopKontrMethode2" className="speichern" data-formular="tpopkontrzaehl" value="2"/>
                            <label htmlFor="TPopKontrMethode2">gezählt</label><br/>
                            <input type="radio" name="TPopKontrMethode" id="TPopKontrMethode3" className="speichern" data-formular="tpopkontrzaehl" value="3"/>
                            <label htmlFor="TPopKontrMethode3">geschätzt/gezählt</label>
                        </td>
                    </tr>
                    <tr id='fieldcontain_TPopKontrAnz' className='fieldcontain feldTpopkontr TPopKontrAnz'>
                        <td className="labelFieldset">
                            <label htmlFor='TPopKontrAnz' style={labelStyle} className='apf-with-tooltip'>
                                <span>Anzahl:</span>
                            </label>
                            <div className="tooltiptext">
                                <p>Spezialfall<br/>Vorkommen gemeldet ohne Zahlenangabe, z.B. durch Dritte:</p>
                                <ul>
                                    <li>Einheit: "Art ist vorhanden" (letzter Punkt auf Auswahlliste)</li>
                                    <li>Anzahl: 1</li>
                                </ul>
                            </div>
                        </td>
                        <td className="Datenfelder">
                            <input id="TPopKontrAnz" name="TPopKontrAnz" className="speichern" data-formular="tpopkontrzaehl" type="number" value={this.props.Anzahl} onChange={this.handleChange} />
                        </td>
                    </tr>
                </table>
            </fieldset>
        );
    }
});

module.exports = tPopKontrZaehl;