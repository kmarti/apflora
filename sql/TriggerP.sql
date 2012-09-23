CREATE TRIGGER newguidp
  BEFORE INSERT
  ON tblPopulation
  FOR EACH ROW
  set new.PopGuid = UUID()


