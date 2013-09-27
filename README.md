Software zur Verwaltung des [Aktionsplans Flora der Fachstelle Naturschutz des Kantons Zürich](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/artenfoerderung/ap_fl.html).

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

**Beobachtungen den Teilpopulationen zuordnen:** ([Anleitung](https://github.com/barbalex/apflora/wiki/2-Beobachtungen-einer-Teilpopulation-zuordnen))

- Alle Beobachtungen der Info Flora innerhalb des Kantons Zürich und im nahen Umfeld
- Alle Beobachtungen aus Projekten der Fachstelle Naturschutz des Kantons Zürich
- Eigene Beobachtungen aus [EvAB](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) (vorgängig mit Access uploaden)


**Auf Luftbildern und Karten darstellen:**

- Aktionspläne, Populationen, Teilpopulationen und Beobachtungen auf Google-Luftbildern anzeigen
- Aktionspläne, Populationen, Teilpopulationen auf Luftbild, Übersichtsplan und Landeskarten anzeigen und diverse Ebenen einblenden (Bundesinventare, Kantonale Inventare, Parzellen). Datenquelle: Kanton Zürich
- Nicht zugeordnete Beobachtungen und Teilpopulationen gemeinsam auf dem Luftbild anzeigen. Beobachtungen durch Ziehen mit der Maus Teilpopulationen zuordnen
- Teilpopulationen auf Luftbild, Übersichtsplan und Landeskarte verorten
- Teilpopulationen und Beobachtungen im GIS-Browser des Kt. Zürich anzeigen
- Populationen und Teilpopulationen aller Arten als kml-Datei für Google Earth exportieren


**Daten exportieren:**

- Alle Daten exportieren
- Teilpopulationen und Populationen auf der Karte mit einem Polygon auswählen und anschliessend exportieren

**Auf die Plätze, fertig, los!**

- "No hassle": Keine Installation, keine Installationskosten, automatische Updates
- Von ausserhalb und endlich auch innerhalb der Fachstelle Naturschutz arbeiten
- Ein moderner Browser wird vorausgesetzt. Entwickelt für Google Chrome. Funktioniert auch auf Chrome für Android und Safari auf iOS. Funktioniert zum grössten Teil auch auf Firefox und Safari für PC (neuste Versionen). Auf Internet Explorer funktioniert ApFloraDb nicht (nicht einmal in Version 10)

**Sich rasch zurechtfinden:**

- Über einen dynamisch aufgebauten Strukturbaum navigieren und dabei die Übersicht über die komplexe Hierarchie behalten
- Rechts neben dem Baum die Daten der gewählten Struktur (= "node") bearbeiten

**Sich anleiten lassen:**

- Wichtige Felder, die in aller Regel auszufüllen sind, werden farblich hervorgehoben
- Wo hilfreich werden Informationen angezeigt, wenn man mit der Maus über den Feldnamen fährt
- Im [Wiki](https://github.com/barbalex/apflora/wiki/_pages) sind wichtige Fragen erklärt

**Effizient arbeiten:**

- Die Anwendung wird mit AJAX gesteuert, um rasche Ladezeiten zu gewährleisten
- Nodes wie z.B. Teilpopulationen im Baum zu anderen nodes desselben Typs verschieben oder kopieren (rechte Maustaste oder drag and drop, wie im Windows explorer)
- Im Baum suchen
- Beobachtungen Teilpopulationen zuordnen: Mit drag and drop im Strukturbaum, durch Ausschneiden/Kopieren und anschliessendem Einfügen im Strukturbaum, in einer nach Abstand zu den Teilpopulationen geordneten Liste im Formular oder mit drag and drop im Luftbild
- Daten löschen: Bei den gehaltvollen Daten (Programme/Arten, Populationen, Teilpopulationen, Feldkontrollen, Freiwilligen-Kontrollen, Massnahmen, AP-Berichten) kann das Löschen nachträglich während 25 Sekunden rückgängig gemacht werden

Update vom 16.11.12: Drag and drop im Strukturbaum vorläufig ausgeschaltet, wegen Fehler im externen Modul.

**Im Feld arbeiten?**

Mit Tablett mit genügend grossem Bildschirm oder mit einem grossen Smartphone mit Stift und in Gebieten mit gutem Datenempfang könnte die Anwendung vermutlich auch im Feld benutzt werden. Ohne Stift ist die Sache auf dem Smartphone etwas gar fummellig. Mehr dazu [hier](https://github.com/barbalex/apflora/wiki/3-Daten-direkt-im-Feld-erfassen).

**Projektdaten verwalten:**

Die nachfolgend aufgelisteten Funktionen werden nur von Topos in einer einfachen Access-Anwendung verwendet:

- pdf-Datei für den Jahresbericht erstellen
- Adressen verwalten
- Mit dem GIS auf die Daten zugreifen
- Logins verwalten und Schreibrechte vergeben
- Datenwaisen ermitteln und bearbeiten oder löschen
- Beobachtungen nach [EvAB](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) exportieren
- Daten in Tabellenform bearbeiten
- Geplant: Beobachtungen aus einem [EvAB](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) importieren (um sie danach in ApFloraDb Teilpopulationen zuzuordnen)

**Anwendung effizient unterhalten:**

verglichen mit der ehemaligen Access-Anwendung:

- Einfacheres Gesamtsystem mit weniger Abhängigkeiten
- Die Anwendung ist professioneller aufgebaut, im Code dokumentiert und einfacher zu warten 

**Daten nach Verlust wiederherstellen:**

- Die Daten werden täglich auf dem Webserver und in einer Dropbox gesichert
- BenutzerInnen können selber Daten sichern ([Anleitung](https://github.com/barbalex/apflora/wiki/6-Selber-Daten-sichern))
- Ihre Wiederherstellung wird im Rahmen der Entwicklung bzw. des Unterhalts regelmässig getestet ([Anleitung](https://github.com/barbalex/apflora/wiki/7-Daten-wiederherstellen))

<a href="#top">&#8593; top</a>


<a name="fns"></a>
#Produkte für die Fachstelle Naturschutz
Die FNS erhält aus der ApFloraDb folgende Produkte:

- Den Jahresbericht (pdf oder Ausdruck)
- Artbeobachtungen. Dazu werden die Feld- und Freiwilligenkontrollen (ausser solche von "erst angesäten" Teilpopulationen) in einer Form exportiert, die einfach in [EvAB](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) importiert werden kann
- Teilpopulationen für [Web-GIS BUN](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/web_gis.html). Form nochmals mit al zu vereinbaren und gleich durchzuführen
- Eine jährliche Kopie aller Daten als sql-Dumpfile? Inklusive der Anwendung (Kopie des gesammten Entwicklungsordners)?

<a href="#top">&#8593; top</a>


<a name="Technik"></a>
#Technische Umsetzung
Die Weboberfläche ([HTML5](http://de.wikipedia.org/wiki/HTML5), [CSS](http://de.wikipedia.org/wiki/Cascading_Style_Sheets), [JavaScript](http://de.wikipedia.org/wiki/JavaScript), [jQuery](http://jquery.com/) und [jsTree](http://www.jstree.com/)) greift mithilfe von [PHP](http://de.wikipedia.org/wiki/PHP) auf eine [mySql-Datenbank](http://de.wikipedia.org/wiki/MySQL).

Für die Karten werden [OpenLayers](http://openlayers.org/) und [GoogleMaps](https://developers.google.com/maps/documentation/javascript/reference) verwendet. Die Kartendaten stammen von Google und dem Kanton Zürich.

Die Applikation baut auf einer einzigen Seite auf und aktualisiert die Oberfläche inkl. URL mit AJAX.

<a href="#top">&#8593; top</a>


<a name="OpenSource"></a>
#Open source
Die verwendete [Lizenz](https://github.com/barbalex/apflora/blob/master/License.md) ist sehr freizügig. Neben dem Code steht auch die [Datenstruktur](https://github.com/barbalex/apflora/raw/master/etc/alexande_apflora.sql.zip) zur Verfügung. Die eigentlichen Daten aber, mit denen gearbeitet wird, gehören der Fachstelle Naturschutz des Kantons Zürich und stehen nicht zur freien Verfügung.

Wer will, kann nach diesen Anweisungen die [Entwicklungsumgebung einrichten](https://github.com/barbalex/apflora/wiki/Entwicklungsumgebung-einrichten) und die [Anwendung auf einem Server bereitstellen](https://github.com/barbalex/apflora/wiki/Anwendung-auf-einem-Server-bereitstellen).

<a href="#top">&#8593; top</a>