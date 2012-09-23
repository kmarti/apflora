CREATE TRIGGER newguid
  BEFORE INSERT
  ON tblTeilPopFeldkontrolle
  FOR EACH ROW
  set new.TPopKontrGuid = UUID()
  
CREATE TRIGGER newguidtpm
  BEFORE INSERT
  ON tblTeilPopMassnahme
  FOR EACH ROW
  set new.TPopMassnGuid = UUID() 
  
CREATE TRIGGER newguidtp
  BEFORE INSERT
  ON tblTeilPopulation
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


