CREATE TRIGGER newguidtp
  BEFORE INSERT
  ON tblTeilpopulation
  FOR EACH ROW
  set new.TPopGuid = UUID()
