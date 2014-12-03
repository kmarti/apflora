CREATE TABLE IF NOT EXISTS tblTPopKontrZaehl (
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
TPopKontrId INT(10),
Anzahl INT(10) default NULL COMMENT "Anzahl Zaehleinheiten",
Zaehleinheit INT(10) default NULL COMMENT "Verwendete Zaehleinheit. Auswahl aus Tabelle domTPopKontrZaehleinheit",
Methode INT(10) default NULL COMMENT "Verwendete Methodik. Auswahl aus Tabelle domTPopKontrMethode") ENGINE=INNODB COMMENT="Zaehlungen fuer Kontrollen";
ALTER TABLE tblTPopKontrZaehl ADD INDEX `TPopKontrId` (`TPopKontrId`);
ALTER TABLE tblTPopKontrZaehl ADD INDEX `Anzahl` (`Anzahl`);
ALTER TABLE tblTPopKontrZaehl ADD INDEX `Zaehleinheit` (`Zaehleinheit`);
ALTER TABLE tblTPopKontrZaehl ADD INDEX `Methode` (`Methode`);