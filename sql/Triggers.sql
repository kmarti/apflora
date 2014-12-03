DROP TRIGGER IF EXISTS newguidtpf;
CREATE TRIGGER newguidtpf
  BEFORE INSERT
  ON tblTPopKontr
  FOR EACH ROW
  set new.TPopKontrGuid = UUID();

/*geht nicht, weil mySql pro Tabelle in dieser Version nur einen Trigger zulässt
DROP TRIGGER IF EXISTS newguidtpfkzeitguid;
CREATE TRIGGER newguidtpfkzeitguid
  BEFORE INSERT
  ON tblTPopKontr
  FOR EACH ROW
  set new.ZeitGuid = UUID();*/
  
DROP TRIGGER IF EXISTS newguidtpm;
CREATE TRIGGER newguidtpm
  BEFORE INSERT
  ON tblTPopMassn
  FOR EACH ROW
  set new.TPopMassnGuid = UUID();
  
DROP TRIGGER IF EXISTS newguidtp;
CREATE TRIGGER newguidtp
  BEFORE INSERT
  ON tblTPop
  FOR EACH ROW
  set new.TPopGuid = UUID();
  
DROP TRIGGER IF EXISTS newguidp;
CREATE TRIGGER newguidp
  BEFORE INSERT
  ON tblPop
  FOR EACH ROW
  set new.PopGuid = UUID();