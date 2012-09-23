CREATE TRIGGER newguidap
  BEFORE INSERT
  ON tblAktionsplan
  FOR EACH ROW
  set new.ApGuid = UUID()  


