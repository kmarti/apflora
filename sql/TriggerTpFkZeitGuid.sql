CREATE TRIGGER newguidtpfkzeitguid
  BEFORE INSERT
  ON tblTeilPopFeldkontrolle
  FOR EACH ROW
  set new.ZeitGuid = UUID()
