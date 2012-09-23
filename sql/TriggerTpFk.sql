CREATE TRIGGER newguidtpfk
  BEFORE INSERT
  ON tblTeilPopFeldkontrolle
  FOR EACH ROW
  set new.TPopKontrGuid = UUID()
