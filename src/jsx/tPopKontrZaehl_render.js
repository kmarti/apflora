/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var React = require('react'),
    fieldsetStyle = {
        background: 'none'
    },
    labelStyle = {
        width: 115
    };

module.exports = React.render(
    <fieldset style={fieldsetStyle}>
        <legend>Test. Zähleinheit</legend>
        <table>
            <tr id='fieldcontain_TPopKontrZaehleinheit1' className='fieldcontain feld_tpopfeldkontr TPopKontrZaehleinheit1'>
                <td className="label_fieldset">
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
                    <select id="TPopKontrZaehleinheit1" name="TPopKontrZaehleinheit1" className="speichern" formular="tpopfeldkontr">
                        <option></option>
                    </select>
                </td>
            </tr>
            <tr id='fieldcontain_TPopKontrMethode1' className='fieldcontain feld_tpopfeldkontr TPopKontrMethode1'>
                <td className="label_fieldset">
                    <label htmlFor='TPopKontrMethode1' style={labelStyle}>Methode:</label>
                </td>
                <td className="Datenfelder">
                    <input type="radio" name="TPopKontrMethode1" id="TPopKontrMethode11" className="speichern" formular="tpopfeldkontr" value="1"/>
                    <label htmlFor="TPopKontrMethode11">geschätzt</label><br/>
                    <input type="radio" name="TPopKontrMethode1" id="TPopKontrMethode12" className="speichern" formular="tpopfeldkontr" value="2"/>
                    <label htmlFor="TPopKontrMethode12">gezählt</label><br/>
                    <input type="radio" name="TPopKontrMethode1" id="TPopKontrMethode13" className="speichern" formular="tpopfeldkontr" value="3"/>
                    <label htmlFor="TPopKontrMethode13">geschätzt/gezählt</label>
                </td>
            </tr>
            <tr id='fieldcontain_TPopKontrAnz1' className='fieldcontain feld_tpopfeldkontr TPopKontrAnz1'>
                <td className="label_fieldset">
                    <label htmlFor='TPopKontrAnz1' style={labelStyle} className='apf-with-tooltip'>
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
                    <input id="TPopKontrAnz1" name="TPopKontrAnz1" className="speichern" formular="tpopfeldkontr" type="number"/>
                </td>
            </tr>
        </table>
    </fieldset>,
    document.getElementById('tPopKontrZaehlungen')
);