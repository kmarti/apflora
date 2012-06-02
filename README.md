Software zur Verwaltung des Aktionsplans Flora der Fachstelle Naturschutz des Kantons Zürich.

Die Anwendung gibt es schon. Sie basiert auf Microsoft Access, das über ODBC auf eine MySql-Datenbank im Netz greift.

#Ziel
- Die Daten können von ausserhalb und endlich auch innerhalb der Fachstelle Naturschutz bearbeitet werden
- Einfachere und übersichtlichere Benutzerführung
- "No hassle": Keine Installation, keine Installationskosten, automatische Updates
- Schlankes, weniger komplexes Gesamtsystem mit weniger Abhängigkeiten (u.a.: läuft auch auf Mac und Linux)
- Darstellung und Lokalisierung auf Luftbildern direkt in der Anwendung

#Ideen
- Navigation über einen dynamisch aufgebauten Strukturbaum. Er ersetzt den bisherigen Baum, die Register, die Suchfelder und die Verschiebe-/Kopierbefehle
- Rechts neben dem Baum werden die Daten der gewählten Struktur (= "node") angezeigt, z.B. Teilpopulation oder Feldkontrolle
- Nodes wie Teilpopulationen und Feldkontrollen können im Baum zu anderen nodes desselben Typs verschoben oder kopiert werden
- Schnelle Ladezeiten: Steuerung mit Ajax, Datensätze und -listen als Objekte im Arbeitsspeicher behalten
- Suchfunktion im Baum
- Beim erneuten Einstieg weiterarbeiten, wo man aufgehört hat?

#Einschränkungen
- Abfragen und Exporte vorläufig noch in Access ausführen (muss wohl sowieso flexibilisiert werden)
- Artbeobachtungen vorläufig noch in Access zuweisen
- Artbeobachtungen aus EvAB ev. länger weiterhin in Access zuweisen (oder Uploadtool und Zuweisung im Web?)
- Berichte vermutlich langfristig weiterhin in Access erstellen (aufwändig und schwierig umzusetzen)

#Roadmap
Ist momentan bloss ein Versuch, ob die Idee funktioniert. Ausgang offen.