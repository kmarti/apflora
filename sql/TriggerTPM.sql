CREATE TRIGGER newguidtpm
  BEFORE INSERT
  ON tblTeilPopMassnahme
  FOR EACH ROW
  set new.TPopMassnGuid = UUID()
