/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var React = require('react'),
    fieldsetStyle = {
        background: 'none'
    },
    labelStyle = {
        width: 115
    };

module.exports = function (data) {
    data = data || {};
    return (
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
                <tr id='fieldcontain_TPopKontrMethode' className='fieldcontain feld_tpopfeldkontr TPopKontrMethode'>
                    <td className="label_fieldset">
                        <label htmlFor='TPopKontrMethode' style={labelStyle}>Methode:</label>
                    </td>
                    <td className="Datenfelder">
                        <input type="radio" name="TPopKontrMethode" id="TPopKontrMethode1" className="speichern" formular="tpopfeldkontr" value="1"/>
                        <label htmlFor="TPopKontrMethode1">geschätzt</label><br/>
                        <input type="radio" name="TPopKontrMethode" id="TPopKontrMethode2" className="speichern" formular="tpopfeldkontr" value="2"/>
                        <label htmlFor="TPopKontrMethode2">gezählt</label><br/>
                        <input type="radio" name="TPopKontrMethode" id="TPopKontrMethode3" className="speichern" formular="tpopfeldkontr" value="3"/>
                        <label htmlFor="TPopKontrMethode3">geschätzt/gezählt</label>
                    </td>
                </tr>
                <tr id='fieldcontain_TPopKontrAnz' className='fieldcontain feld_tpopfeldkontr TPopKontrAnz'>
                    <td className="label_fieldset">
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
                        <input id="TPopKontrAnz" name="TPopKontrAnz" className="speichern" formular="tpopfeldkontr" type="number" value={data.Anzahl}/>
                    </td>
                </tr>
            </table>
        </fieldset>
    );
};