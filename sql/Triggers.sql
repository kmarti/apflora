CREATE TRIGGER newguidtpf
  BEFORE INSERT
  ON tblTeilPopFeldkontrolle
  FOR EACH ROW
  set new.TPopKontrGuid = UUID()

/*geht nicht, weil mySql pro Tabelle in dieser Version nur einen Trigger zulässt*/
CREATE TRIGGER newguidtpfkzeitguid
  BEFORE INSERT
  ON tblTeilPopFeldkontrolle
  FOR EACH ROW
  set new.ZeitGuid = UUID()
  
CREATE TRIGGER newguidtpm
  BEFORE INSERT
  ON tblTeilPopMassnahme
  FOR EACH ROW
  set new.TPopMassnGuid = UUID() 
  
CREATE TRIGGER newguidtp
  BEFORE INSERT
  ON tblTeilpopulation
  FOR EACH ROW
  set new.TPopGuid = UUID()   
  
CREATE TRIGGER newguidp
  BEFORE INSERT
  ON tblPopulation
  FOR EACH ROW
  set new.PopGuid = UUID()   
  
CREATE TRIGGER newguidap
  BEFORE INSERT
  ON tblAktionsplan
  FOR EACH ROW
  set new.ApGuid = UUID()