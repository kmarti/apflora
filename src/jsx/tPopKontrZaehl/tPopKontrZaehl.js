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
                    <tr id='fieldcontain_Zaehleinheit' className='fieldcontain feldTpopkontr Zaehleinheit'>
                        <td className='labelFieldset'>
                            <label htmlFor='Zaehleinheit' style={labelStyle} className='apf-with-tooltip'>
                                <span>Einheit:</span>
                            </label>
                            <div className='tooltiptext'>
                                <p>Spezialfall<br/>Vorkommen gemeldet ohne Zahlenangabe, z.B. durch Dritte:</p>
                                <ul>
                                    <li>Einheit: 'Art ist vorhanden' (letzter Punkt auf Auswahlliste)</li>
                                    <li>Anzahl: 1</li>
                                </ul>
                            </div>
                        </td>
                        <td className='Datenfelder'>
                            <select id='Zaehleinheit' name='Zaehleinheit' className='speichern' data-formular='tpopkontrzaehl' value={this.props.Zaehleinheit}>
                                <option></option>
                            </select>
                        </td>
                    </tr>
                    <tr id='fieldcontain_Methode' className='fieldcontain feldTpopkontr Methode'>
                        <td className='labelFieldset'>
                            <label htmlFor='Methode' style={labelStyle}>Methode:</label>
                        </td>
                        <td className='Datenfelder'>
                            <input type='radio' id='Methode1' name='Methode' className='speichern' data-formular='tpopkontrzaehl' value='1'/>
                            <label htmlFor='Methode1'>geschätzt</label><br/>
                            <input type='radio' id='Methode2' name='Methode' className='speichern' data-formular='tpopkontrzaehl' value='2'/>
                            <label htmlFor='Methode2'>gezählt</label><br/>
                            <input type='radio' id='Methode3' name='Methode' className='speichern' data-formular='tpopkontrzaehl' value='3'/>
                            <label htmlFor='Methode3'>geschätzt/gezählt</label>
                        </td>
                    </tr>
                    <tr id='fieldcontain_Anzahl' className='fieldcontain feldTpopkontr Anzahl'>
                        <td className='labelFieldset'>
                            <label htmlFor='Anzahl' style={labelStyle} className='apf-with-tooltip'>
                                <span>Anzahl:</span>
                            </label>
                            <div className='tooltiptext'>
                                <p>Spezialfall<br/>Vorkommen gemeldet ohne Zahlenangabe, z.B. durch Dritte:</p>
                                <ul>
                                    <li>Einheit: 'Art ist vorhanden' (letzter Punkt auf Auswahlliste)</li>
                                    <li>Anzahl: 1</li>
                                </ul>
                            </div>
                        </td>
                        <td className='Datenfelder'>
                            <input id='Anzahl' name='Anzahl' className='speichern' data-formular='tpopkontrzaehl' type='number' value={this.props.Anzahl} onChange={this.handleChange} />
                            <input type='number' name='TPopKontrZaehlId' data-formular='tpopkontrzaehl' value={this.props.TPopKontrZaehlId} />
                            <input type='number' name='TPopKontrId' data-formular='tpopkontrzaehl' value={this.props.TPopKontrId} />
                        </td>
                    </tr>
                </table>
            </fieldset>
        );
    }
});

module.exports = tPopKontrZaehl;