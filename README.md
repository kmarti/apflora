Software zur Verwaltung des Aktionsplans Flora der Fachstelle Naturschutz des Kantons Zürich.
Die Anwendung gibt es schon, realisiert auf Microsoft Access, das über ODBC auf eine MySql-Datenbank im Netz greift.

#Ziel
- Die Daten können von ausserhalb und endlich auch innerhalb der Fachstelle Naturschutz bearbeitet werden
- Einfachere und übesichtlichere Benutzerführung
- Keine Installation, keine Installationskosten, automatische Updates
- Schlankes, weniger komplexes Gesamtsystem mit weniger Abhängigkeiten (läuft auch auf Mac und Linux)
- Darstellung und Lokalisierung auf Luftbildern direkt in der Anwendung

#Idee
- Steuerung zu 100% über einen dynamisch aufgebauten Strukturbaum. Er ersetzt diese bisherigen Objekte: Baum, Register, Suchfelder und Verschiebe-/Kopierbefehle
- Rechts neben dem Baum werden die Daten der gewählten Struktur (= "node") angezeigt, z.B. Teilpopulation oder Feldkontrolle.
- Jeder node enthält die Informationen, mit denen er sich bei Aktivierung seine Daten aus der DB holt > einfachste Abfragen, hoffentlich kurze Ladezeiten
- Nodes wie Teilpopulationen und Feldkontrollen können im Baum verschoben oder kopiert werden
- Steuerung mit Ajax für schnelle Ladezeiten
- Suchfunktion im Baum?
- eigenes Symbol für AP-Arten, farblich nach Status abgestuft?

#Einschränkungen
- Abfragen und Exporte vorläufig noch in Access ausführen (muss wohl sowieso flexibilisiert werden)
- Artbeobachtungen vorläufig noch in Access zuweisen
- Artbeobachtungen aus EvAB ev. länger weiterhin in Access zuweisen (oder Uploadtool und Zuweisung im Web?)
- Berichte vermutlich langfristig weiterhin in Access erstellen (aufwändig und schwierig umzusetzen)

#Roadmap
Ist momentan bloss ein Versuch, ob die Idee funktioniert.