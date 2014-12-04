/*
 * in tblTPopKontr gab es ca. 800 Datensätze ohne GUID
 * daher müssen sie nachgereicht werden
 * die übrigen Aktualisierungen sind nicht nötig, da keine GUIS fehlen
 */
UPDATE tblTPopKontr
SET TPopKontrGuid = UUID()
WHERE TPopKontrGuid IS NULL;

UPDATE tblTPopMassn
SET TPopMassnGuid = UUID()
WHERE TPopMassnGuid IS NULL;

UPDATE tblTPop
SET TPopGuid = UUID()
WHERE TPopGuid IS NULL;

UPDATE tblPop
SET PopGuid = UUID()
WHERE PopGuid IS NULL;