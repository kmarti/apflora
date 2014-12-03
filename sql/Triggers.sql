CREATE TRIGGER newguidtpf
  BEFORE INSERT
  ON tblTPopKontr
  FOR EACH ROW
  set new.TPopKontrGuid = UUID()

/*geht nicht, weil mySql pro Tabelle in dieser Version nur einen Trigger zulässt*/
CREATE TRIGGER newguidtpfkzeitguid
  BEFORE INSERT
  ON tblTPopKontr
  FOR EACH ROW
  set new.ZeitGuid = UUID()
  
CREATE TRIGGER newguidtpm
  BEFORE INSERT
  ON tblTPopMassn
  FOR EACH ROW
  set new.TPopMassnGuid = UUID() 
  
CREATE TRIGGER newguidtp
  BEFORE INSERT
  ON tblTPop
  FOR EACH ROW
  set new.TPopGuid = UUID()   
  
CREATE TRIGGER newguidp
  BEFORE INSERT
  ON tblPop
  FOR EACH ROW
  set new.PopGuid = UUID()