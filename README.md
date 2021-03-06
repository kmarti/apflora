Web-Applikation zur Verwaltung des [Aktionsplans Flora der Fachstelle Naturschutz des Kantons Zürich](//www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/artenfoerderung/ap_fl.html).

<a name="top"></a>
## Inhalt ##
* <a href="#machen">Was kann man mit ApFloraDb machen?</a>
* <a href="#fns">Produkte für die Fachstelle Naturschutz</a>
* <a href="#Technik">Technische Umsetzung</a>
* <a href="#OpenSource">Open source</a> 


<a name="machen"></a>
#Was kann man mit ApFloraDb machen?

**Aktionspläne verwalten:**

- Aktionspläne, Populationen und Teilpopulationen beschreiben
- Kontrollen der Teilpopulationen und Massnahmen zur Förderung dokumentieren
- Die Entwicklung der Teilpopulationen und den Erfolg der Massnahmen beurteilen
- Ziele und Erfolgskriterien bestimmen
- Jährliche Berichte verfassen
- Ideale Umweltfaktoren ("Idealbiotop") und assoziierte Arten beschreiben

**Beobachtungen den Teilpopulationen zuordnen:** ([Anleitung](https://github.com/FNSKtZH/apflora/wiki/Beobachtungen-einer-Teilpopulation-zuordnen))

- Alle Beobachtungen der Info Flora innerhalb des Kantons Zürich und im nahen Umfeld
- Alle Beobachtungen aus Projekten der Fachstelle Naturschutz des Kantons Zürich
- Eigene Beobachtungen aus [EvAB](//www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) (vorgängig mit Access uploaden)


**Auf Luftbildern und Karten darstellen:**

- Aktionspläne, Populationen, Teilpopulationen und Beobachtungen auf Google-Luftbildern anzeigen
- Aktionspläne, Populationen, Teilpopulationen auf Luftbild, Übersichtsplan und Landeskarten anzeigen und diverse Ebenen einblenden (Bundesinventare, Kantonale Inventare, Parzellen)
- Nicht zugeordnete Beobachtungen und Teilpopulationen gemeinsam auf dem Luftbild anzeigen. Beobachtungen durch Ziehen mit der Maus Teilpopulationen zuordnen
- Teilpopulationen auf Luftbild, Übersichtsplan und Landeskarte verorten
- Teilpopulationen und Beobachtungen im GIS-Browser des Kt. Zürich anzeigen
- Populationen und Teilpopulationen aller Arten als kml-Datei für Google Earth exportieren


**Eigene Ebenen auf Karten darstellen und bearbeiten**

- Neue erstellen
- Geo-Dateien (z.B. kml, gpx) auf die Karte ziehen
- Bestehende bearbeiten, umbenennen, entfernen
- Exportieren (als GeoJSON)
- Eigene Ebenen werden im Cache des Browsers gespeichert


**Daten exportieren:**

- Alle Daten exportieren
- Teilpopulationen und Populationen auf der Karte auswählen und anschliessend exportieren

**Auf die Plätze, fertig, los!**

- "No hassle": Keine Installation, keine Installationskosten, automatische Updates
- Von ausserhalb (Auftragnehmer) und innerhalb der Fachstelle Naturschutz arbeiten (trotz strenger firewall)
- Ein moderner Browser wird vorausgesetzt. Entwickelt für Google Chrome. Funktioniert auch auf auch auf Firefox und Safari für PC (neuste Versionen), sowie Chrome für Android und Safari auf iOS. Auf Internet Explorer funktioniert ApFloraDb offenbar ab Version 10 (aber kaum getestet)

**Sich rasch zurechtfinden:**

- Über einen dynamisch aufgebauten Strukturbaum navigieren und dabei die Übersicht über die komplexe Hierarchie behalten
- Rechts neben dem Baum die Daten der gewählten Struktur bearbeiten

**Sich anleiten lassen:**

- Wichtige Felder, die in aller Regel auszufüllen sind, werden farblich hervorgehoben
- Wo hilfreich werden Informationen angezeigt, wenn man mit der Maus über Feldnamen und Schaltflächen fährt
- Im [Wiki](https://github.com/FNSKtZH/apflora/wiki) sind wichtige Fragen erklärt

**Effizient arbeiten:**

- Die Anwendung wird mit AJAX gesteuert, um rasche Ladezeiten zu gewährleisten
- Strukturelemente wie z.B. Teilpopulationen im Baum zu anderen Strukturelementen desselben Typs verschieben oder kopieren (rechte Maustaste oder drag and drop, wie im Windows explorer)
- Im Baum suchen
- Beobachtungen Teilpopulationen zuordnen: Mit drag and drop im Strukturbaum, durch Ausschneiden/Kopieren und anschliessendem Einfügen im Strukturbaum, in einer nach Abstand zu den Teilpopulationen geordneten Liste im Formular oder mit drag and drop im Luftbild
- Daten löschen: Bei den gehaltvollen Daten (Programme/Arten, Populationen, Teilpopulationen, Feldkontrollen, Freiwilligen-Kontrollen, Massnahmen, AP-Berichten) kann das Löschen nachträglich während 25 Sekunden rückgängig gemacht werden

Update vom 16.11.12: Drag and drop im Strukturbaum vorläufig ausgeschaltet, wegen Fehler im externen Modul.

**Im Feld arbeiten?**

Mit Tablett mit genügend grossem Bildschirm oder mit einem grossen Smartphone mit Stift und in Gebieten mit gutem Datenempfang könnte die Anwendung vermutlich auch im Feld benutzt werden. Ohne Stift ist die Sache auf dem Smartphone etwas gar fummellig. Mehr dazu [hier](https://github.com/FNSKtZH/apflora/wiki/Daten-direkt-im-Feld-erfassen).

**Projektdaten verwalten:**

Die nachfolgend aufgelisteten Funktionen werden nur von Topos in einer einfachen Access-Anwendung verwendet:

- pdf-Datei für den Jahresbericht erstellen
- Adressen verwalten
- Mit dem GIS auf die Daten zugreifen
- Logins verwalten und Schreibrechte vergeben
- Datenwaisen ermitteln und bearbeiten oder löschen
- Beobachtungen nach [EvAB](//www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) exportieren
- Daten in Tabellenform bearbeiten
- Beobachtungen aus einem [EvAB](//www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) importieren (um sie danach in ApFloraDb Teilpopulationen zuzuordnen)

**Anwendung effizient unterhalten:**

Verglichen mit der ehemaligen Access-Anwendung:

- Einfacheres Gesamtsystem mit weniger Abhängigkeiten
- Die Anwendung ist professioneller aufgebaut, im Code dokumentiert und einfacher zu warten 

**Daten nach Verlust wiederherstellen:**

- Die Daten werden täglich in der Cloud gesichert
- In regelmässigen Abständen werden sie aus der Cloud auf mehrere unabhängige Festplatten gesichert
- Ihre Wiederherstellung wird im Rahmen der Entwicklung bzw. des Unterhalts sporadisch getestet ([Anleitung](https://github.com/FNSKtZH/apflora/wiki/Daten-wiederherstellen))

<a href="#top">&#8593; top</a>


<a name="fns"></a>
#Produkte für die Fachstelle Naturschutz
Die FNS erhält aus der ApFloraDb folgende Produkte:

- Den Jahresbericht (pdf oder Ausdruck)
- Artbeobachtungen<br>
Dazu werden die Feld- und Freiwilligenkontrollen (ausser solche von soeben angesäten, noch nicht etablierten Teilpopulationen) aus der Access-Admin-DB in einer Form exportiert, die einfach in [EvAB](//www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) importiert werden kann
- Daten für die Anzeige in GIS und [Web-GIS BUN](//www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/web_gis.html):
 - [Teilpopulationen](http://apflora.ch/api/v1/exportView/csv/view=vTPop/filename=Teilpopulationen)
 - [Kontrollen](http://apflora.ch/api/v1/exportView/csv/view=vKontr/filename=Kontrollen)
 - [Massnahmen](http://apflora.ch/api/v1/exportView/csv/view=vMassn/filename=Massnahmen)

<a href="#top">&#8593; top</a>


<a name="Technik"></a>
#Technische Umsetzung
Die Anwendung wird auf einem virtuellen Server mit Ubuntu 14.04 gehostet.

Serverseitig wird sie mit [node.js](//nodejs.org/) gesteuert. Als Webserver dient [hapi](//hapijs.com/), als Datenbank [MySQL](//de.wikipedia.org/wiki/MySQL) mit drei separaten Datenbanken:
- alexande_apflora: die projekteigenen Daten. Sie sind vollständig von den übrigen Datenbanken getrennt, um Datensicherung und -wiederherstellung zu vereinfachen
- alexande_apflora_views: die Views. Sie liegen getrennt, weil der Aufbau komplexer Views eine Wiederherstellung der DB mittels sql-Dumpfile empfindlich stören kann
- alexande_beob: benutzte Fremddaten, v.a. Beobachtungen von Info Spezies und der FNS sowie Arteigenschaften

Die Benutzeroberfläche basiert auf [HTML5](//de.wikipedia.org/wiki/HTML5), [CSS](//de.wikipedia.org/wiki/Cascading_Style_Sheets), [jQuery UI](//jqueryui.com), [jQuery](//jquery.com/) und [jsTree](//www.jstree.com/) und wird mit [JavaScript](//de.wikipedia.org/wiki/JavaScript) gesteuert. Sie baut auf einer einzigen HTML-Seite auf.

Für die Karten werden [Open Layers 3](//ol3js.org/) mit [api.geo.admin.ch](http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services.html) und [GoogleMaps](https://developers.google.com/maps/documentation/javascript/reference) verwendet.

<a href="#top">&#8593; top</a>


<a name="OpenSource"></a>
#Open source
Die verwendete [Lizenz](https://github.com/FNSKtZH/apflora/blob/master/License.md) ist sehr freizügig. Neben dem Code steht auch die [Datenstruktur](https://github.com/FNSKtZH/apflora/raw/master/etc/alexande_apflora.sql.zip) inkl. [Views](https://github.com/FNSKtZH/apflora/raw/master/etc/alexande_apflora_views.sql.zip) zur Verfügung. Die eigentlichen Daten aber, mit denen gearbeitet wird, gehören der Fachstelle Naturschutz des Kantons Zürich und stehen nicht zur freien Verfügung (die Beobachtungen werden der [Info Spezies](//www.infoflora.ch/de/allgemeines/info-species.html) gemeldet).

Wer will, kann selber die [Entwicklungsumgebung einrichten](https://github.com/FNSKtZH/apflora/wiki/Entwicklungsumgebung-einrichten) und die [Anwendung auf einem Webserver bereitstellen](https://github.com/FNSKtZH/apflora/wiki/Anwendung-auf-einem-Server-bereitstellen).

<a href="#top">&#8593; top</a>
