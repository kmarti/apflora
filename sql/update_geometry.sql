UPDATE tblTPop SET TPopPunktgeometrie = GeomFromText(CONCAT('POINT(', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopyKoord AS DECIMAL(10,0)), ')')) WHERE TPopXKoord > 0 AND TPopyKoord > 0

UPDATE tblTPop SET TPopGeometriecollection = GeomFromText(CONCAT('POINT(', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopyKoord AS DECIMAL(10,0)), ')')) WHERE TPopXKoord > 0 AND TPopyKoord > 0

UPDATE tblPop SET PopGeometriepolygon = GeomFromText(CONCAT('Polygon((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ',', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), '))')) WHERE PopXKoord > 0 AND PopYKoord > 0



simple, update:
UPDATE tblPop SET PopGeomPoint = GeomFromText(CONCAT('POINT(', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE tblPop SET PopGeomLine = GeomFromText(CONCAT('LineString(', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE tblPop SET PopGeomPolygon = PolygonFromText(CONCAT('Polygon((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ',', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), '))')) WHERE PopXKoord > 0 AND PopYKoord > 0





simple, insert:
INSERT INTO tpm_polygon (TPopMassnGuid, TpmPolyPolygon) SELECT tblTPopMassn.TPopMassnGuid, PolygonFromText(CONCAT('Polygon((', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ',', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ',', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord+50 AS DECIMAL(10,0)), ',', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), '))')) FROM tblTPop INNER JOIN tblTPopMassn ON tblTPop.TPopId = tblTPopMassn.TPopId WHERE TPopXKoord > 0 AND TPopYKoord > 0

INSERT INTO tpm_line (TPopMassnGuid, TpmLineLine) SELECT tblTPopMassn.TPopMassnGuid, GeomFromText(CONCAT('LineString(', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ',', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ',', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord+50 AS DECIMAL(10,0)), ')')) FROM tblTPop INNER JOIN tblTPopMassn ON tblTPop.TPopId = tblTPopMassn.TPopId WHERE TPopXKoord > 0 AND TPopYKoord > 0

INSERT INTO tpm_point (TPopMassnGuid, TpmPointPoint) SELECT tblTPopMassn.TPopMassnGuid, GeomFromText(CONCAT('Point(', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ')')) FROM tblTPop INNER JOIN tblTPopMassn ON tblTPop.TPopId = tblTPopMassn.TPopId WHERE TPopXKoord > 0 AND TPopYKoord > 0




multi, insert:
INSERT INTO tblPopPolygon (PopId, Polygon) SELECT tblPop.PopId, PolygonFromText(CONCAT('MultiPolygon(((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')),((', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')),((', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')),((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')))')) FROM tblPop WHERE PopXKoord > 0 AND PopYKoord > 0

INSERT INTO tblTPopMassn (TPopMassnPolygon) SELECT PolygonFromText(CONCAT('MultiPolygon(((', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ')),((', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ')),((', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord+50 AS DECIMAL(10,0)), ')),((', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ')))')) FROM tblTPop INNER JOIN tblTPopMassn ON tblTPop.TPopId = tblTPopMassn.TPopId WHERE TPopXKoord > 0 AND TPopYKoord > 0

SELECT tblTPopMassn.TPopMassnGuid
FROM tblTPop INNER JOIN tblTPopMassn ON tblTPop.TPopId = tblTPopMassn.TPopId
WHERE (((tblTPop.TPopXKoord)>0) AND ((tblTPop.TPopYKoord)>0));






multi:
UPDATE tblPop SET PopGeomPoint = GeomFromText(CONCAT('MultiPoint(((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')))')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE tblPop SET PopGeomLine = GeomFromText(CONCAT('LineString((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), '))')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE tblPop SET PopGeomLine = GeomFromText(CONCAT('MultiLineString(((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')))')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE tblPop SET PopGeomPolygon = PolygonFromText(CONCAT('MultiPolygon(((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')),((', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')),((', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')),((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')))')) WHERE PopXKoord > 0 AND PopYKoord > 0