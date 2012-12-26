UPDATE tblTeilpopulation SET TPopPunktgeometrie = GeomFromText(CONCAT('POINT(', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopyKoord AS DECIMAL(10,0)), ')')) WHERE TPopXKoord > 0 AND TPopyKoord > 0

UPDATE tblTeilpopulation SET TPopGeometriecollection = GeomFromText(CONCAT('POINT(', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopyKoord AS DECIMAL(10,0)), ')')) WHERE TPopXKoord > 0 AND TPopyKoord > 0

UPDATE tblPopulation SET PopGeometriepolygon = GeomFromText(CONCAT('Polygon((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ',', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), '))')) WHERE PopXKoord > 0 AND PopYKoord > 0



simple, update:
UPDATE tblPopulation SET PopGeomPoint = GeomFromText(CONCAT('POINT(', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE tblPopulation SET PopGeomLine = GeomFromText(CONCAT('LineString(', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE tblPopulation SET PopGeomPolygon = PolygonFromText(CONCAT('Polygon((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ',', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), '))')) WHERE PopXKoord > 0 AND PopYKoord > 0





simple, insert:
INSERT INTO tpm_polygon (TPopMassnGuid, TpmPolyPolygon) SELECT tblTeilPopMassnahme.TPopMassnGuid, PolygonFromText(CONCAT('Polygon((', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ',', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ',', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord+50 AS DECIMAL(10,0)), ',', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), '))')) FROM tblTeilpopulation INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId WHERE TPopXKoord > 0 AND TPopYKoord > 0

INSERT INTO tpm_line (TPopMassnGuid, TpmLineLine) SELECT tblTeilPopMassnahme.TPopMassnGuid, GeomFromText(CONCAT('LineString(', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ',', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ',', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord+50 AS DECIMAL(10,0)), ')')) FROM tblTeilpopulation INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId WHERE TPopXKoord > 0 AND TPopYKoord > 0

INSERT INTO tpm_point (TPopMassnGuid, TpmPointPoint) SELECT tblTeilPopMassnahme.TPopMassnGuid, GeomFromText(CONCAT('Point(', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ')')) FROM tblTeilpopulation INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId WHERE TPopXKoord > 0 AND TPopYKoord > 0




multi, insert:
INSERT INTO tblPopPolygon (PopId, Polygon) SELECT tblPopulation.PopId, PolygonFromText(CONCAT('MultiPolygon(((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')),((', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')),((', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')),((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')))')) FROM tblPopulation WHERE PopXKoord > 0 AND PopYKoord > 0

INSERT INTO tblTeilPopMassnahme (TPopMassnPolygon) SELECT PolygonFromText(CONCAT('MultiPolygon(((', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ')),((', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ')),((', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord+50 AS DECIMAL(10,0)), ')),((', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ')))')) FROM tblTeilpopulation INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId WHERE TPopXKoord > 0 AND TPopYKoord > 0

SELECT tblTeilPopMassnahme.TPopMassnGuid
FROM tblTeilpopulation INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId
WHERE (((tblTeilpopulation.TPopXKoord)>0) AND ((tblTeilpopulation.TPopYKoord)>0));






multi:
UPDATE tblPopulation SET PopGeomPoint = GeomFromText(CONCAT('MultiPoint(((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')))')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE tblPopulation SET PopGeomLine = GeomFromText(CONCAT('LineString((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), '))')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE tblPopulation SET PopGeomLine = GeomFromText(CONCAT('MultiLineString(((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')))')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE tblPopulation SET PopGeomPolygon = PolygonFromText(CONCAT('MultiPolygon(((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')),((', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')),((', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')),((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')))')) WHERE PopXKoord > 0 AND PopYKoord > 0