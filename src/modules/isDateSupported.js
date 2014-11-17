// kontrolliert, ob der Browser Daten unterstützt
// wird benutzt, um den datepicker zu benutzen, falls nicht
// Quelle: http://updates.html5rocks.com/2012/08/Quick-FAQs-on-input-type-date-in-Google-Chrome

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function () {
    var elem = document.createElement('input');
    elem.setAttribute('type', 'date');
    elem.value = 'foo';
    return (elem.type == 'date' && elem.value != 'foo');
};