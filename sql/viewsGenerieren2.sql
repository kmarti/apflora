/*
 * diese Views hängen von anderen ab, die in viewsGenerieren.sql erstellt werden
 * daher muss diese Date NACH viewsGenerieren.sql ausgeführt werden
 */

CREATE OR REPLACE VIEW vApMassnJahre AS
SELECT alexande_apflora.tblAp.ApArtId, alexande_apflora_views.vMassnJahre.TPopMassnJahr 
FROM alexande_apflora.tblAp, alexande_apflora_views.vMassnJahre 
WHERE alexande_apflora.tblAp.ApArtId>0 AND alexande_apflora.tblAp.ApStatus Between 1 And 3 
ORDER BY alexande_apflora.tblAp.ApArtId, alexande_apflora_views.vMassnJahre.TPopMassnJahr;

CREATE OR REPLACE VIEW vApAnzMassnProJahr AS 
SELECT alexande_apflora_views.vApMassnJahre.ApArtId, alexande_apflora_views.vApMassnJahre.TPopMassnJahr, IF(alexande_apflora_views.vApAnzMassnProJahr0.AnzahlvonTPopMassnId Is Not Null, alexande_apflora_views.vApAnzMassnProJahr0.AnzahlvonTPopMassnId,0) AS "AnzahlMassnahmen" 
FROM alexande_apflora_views.vApMassnJahre LEFT JOIN alexande_apflora_views.vApAnzMassnProJahr0 ON (alexande_apflora_views.vApMassnJahre.TPopMassnJahr = alexande_apflora_views.vApAnzMassnProJahr0.TPopMassnJahr) AND (alexande_apflora_views.vApMassnJahre.ApArtId = alexande_apflora_views.vApAnzMassnProJahr0.ApArtId) 
ORDER BY alexande_apflora_views.vApMassnJahre.ApArtId, alexande_apflora_views.vApMassnJahre.TPopMassnJahr;

#im Gebrauch durch exportPopMitMassnberAnzMassn.php:
CREATE OR REPLACE VIEW vPopMassnberAnzMassn AS
SELECT alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname AS "AP Art", alexande_apflora.domApBearbeitungsstand.DomainTxt AS "AP Status", alexande_apflora.tblAp.ApJahr AS "AP Start im Jahr", alexande_apflora.domApUmsetzung.DomainTxt AS "AP Stand Umsetzung", alexande_apflora.tblPop.PopGuid AS "Pop Guid", alexande_apflora.tblPop.PopNr AS "Pop Nr", alexande_apflora.tblPop.PopName AS "Pop Name", domPopHerkunft.HerkunftTxt AS "Pop Status", alexande_apflora.tblPop.PopBekanntSeit AS "Pop bekannt seit", alexande_apflora.tblPop.PopHerkunftUnklar AS "Pop Status unklar", alexande_apflora.tblPop.PopHerkunftUnklarBegruendung AS "Pop Begruendung fuer unklaren Status", alexande_apflora_views.vPopMassnberAnzMassn0.PopMassnBerJahr AS "MassnBer Jahr", alexande_apflora_views.vPopMassnberAnzMassn0.AnzahlvonTPopMassnId AS "Anz Massnahmen in diesem Jahr"
FROM (((((alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAp ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) INNER JOIN alexande_apflora.tblPop ON alexande_apflora.tblAp.ApArtId = alexande_apflora.tblPop.ApArtId) LEFT JOIN alexande_apflora.domApBearbeitungsstand ON alexande_apflora.tblAp.ApStatus = alexande_apflora.domApBearbeitungsstand.DomainCode) LEFT JOIN alexande_apflora.domApUmsetzung ON alexande_apflora.tblAp.ApUmsetzung = alexande_apflora.domApUmsetzung.DomainCode) LEFT JOIN alexande_apflora.domPopHerkunft ON alexande_apflora.tblPop.PopHerkunft = domPopHerkunft.HerkunftId) INNER JOIN alexande_apflora_views.vPopMassnberAnzMassn0 ON alexande_apflora.tblPop.PopId = alexande_apflora_views.vPopMassnberAnzMassn0.PopId
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora.tblPop.PopNr, alexande_apflora_views.vPopMassnberAnzMassn0.PopMassnBerJahr;

CREATE OR REPLACE VIEW vApAnzMassnBisJahr AS
SELECT alexande_apflora_views.vApMassnJahre.ApArtId, alexande_apflora_views.vApMassnJahre.TPopMassnJahr, Sum(alexande_apflora_views.vApAnzMassnProJahr.AnzahlMassnahmen) AS "AnzahlMassnahmen" 
FROM alexande_apflora_views.vApMassnJahre INNER JOIN alexande_apflora_views.vApAnzMassnProJahr ON alexande_apflora_views.vApMassnJahre.ApArtId = alexande_apflora_views.vApAnzMassnProJahr.ApArtId 
WHERE alexande_apflora_views.vApAnzMassnProJahr.TPopMassnJahr<=alexande_apflora_views.vApMassnJahre.TPopMassnJahr 
GROUP BY alexande_apflora_views.vApMassnJahre.ApArtId, alexande_apflora_views.vApMassnJahre.TPopMassnJahr 
ORDER BY alexande_apflora_views.vApMassnJahre.ApArtId, alexande_apflora_views.vApMassnJahre.TPopMassnJahr;

CREATE OR REPLACE VIEW vApJahresberichteUndMassnahmen AS
SELECT alexande_apflora.tblAp.ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname AS Art, alexande_apflora.domApBearbeitungsstand.DomainTxt AS "AP Status", alexande_apflora.tblAp.ApJahr AS "AP Start im Jahr", alexande_apflora.domApUmsetzung.DomainTxt AS "AP Stand Umsetzung", alexande_apflora.tblAdresse.AdrName AS "AP Verantwortlich", alexande_apflora.tblAp.ApArtwert AS Artwert, alexande_apflora_views.vApAnzMassnProJahr.TPopMassnJahr AS Jahr, alexande_apflora_views.vApAnzMassnProJahr.AnzahlMassnahmen AS "Anzahl Massnahmen", alexande_apflora_views.vApAnzMassnBisJahr.AnzahlMassnahmen AS "Anzahl Massnahmen bisher", IF(alexande_apflora.tblJBer.JBerJahr>0,"Ja","Nein") AS "Bericht erstellt"
FROM ((((((alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAp ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) LEFT JOIN alexande_apflora.domApBearbeitungsstand ON alexande_apflora.tblAp.ApStatus = alexande_apflora.domApBearbeitungsstand.DomainCode) LEFT JOIN alexande_apflora.domApUmsetzung ON alexande_apflora.tblAp.ApUmsetzung = alexande_apflora.domApUmsetzung.DomainCode) LEFT JOIN alexande_apflora.tblAdresse ON alexande_apflora.tblAp.ApBearb = alexande_apflora.tblAdresse.AdrId) INNER JOIN alexande_apflora_views.vApAnzMassnProJahr ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApAnzMassnProJahr.ApArtId) INNER JOIN alexande_apflora_views.vApAnzMassnBisJahr ON (alexande_apflora_views.vApAnzMassnProJahr.TPopMassnJahr = alexande_apflora_views.vApAnzMassnBisJahr.TPopMassnJahr) AND (alexande_apflora_views.vApAnzMassnProJahr.ApArtId = alexande_apflora_views.vApAnzMassnBisJahr.ApArtId)) LEFT JOIN alexande_apflora.tblJBer ON (alexande_apflora_views.vApAnzMassnBisJahr.TPopMassnJahr = alexande_apflora.tblJBer.JBerJahr) AND (alexande_apflora_views.vApAnzMassnBisJahr.ApArtId = alexande_apflora.tblJBer.ApArtId)
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora_views.vApAnzMassnProJahr.TPopMassnJahr;

CREATE OR REPLACE VIEW vLetzterTPopMassnBericht AS
SELECT alexande_apflora_views.vLetzterTPopMassnBericht0.ApArtId, alexande_apflora_views.vLetzterTPopMassnBericht0.TPopId, Max(alexande_apflora_views.vLetzterTPopMassnBericht0.TPopMassnBerJahr) AS MaxvonTPopMassnBerJahr
FROM alexande_apflora_views.vLetzterTPopMassnBericht0
GROUP BY alexande_apflora_views.vLetzterTPopMassnBericht0.ApArtId, alexande_apflora_views.vLetzterTPopMassnBericht0.TPopId;

CREATE OR REPLACE VIEW vLetzterTPopBericht AS 
SELECT alexande_apflora_views.vLetzterTPopBericht0.ApArtId, alexande_apflora_views.vLetzterTPopBericht0.TPopId, Max(alexande_apflora_views.vLetzterTPopBericht0.TPopBerJahr) AS MaxvonTPopBerJahr
FROM alexande_apflora_views.vLetzterTPopBericht0
GROUP BY alexande_apflora_views.vLetzterTPopBericht0.ApArtId, alexande_apflora_views.vLetzterTPopBericht0.TPopId;

CREATE OR REPLACE VIEW vLetzterPopMassnBericht AS 
SELECT alexande_apflora_views.vLetzterPopMassnBericht0.ApArtId, alexande_apflora_views.vLetzterPopMassnBericht0.PopId, Max(alexande_apflora_views.vLetzterPopMassnBericht0.PopMassnBerJahr) AS MaxvonPopMassnBerJahr
FROM alexande_apflora_views.vLetzterPopMassnBericht0
GROUP BY alexande_apflora_views.vLetzterPopMassnBericht0.ApArtId, alexande_apflora_views.vLetzterPopMassnBericht0.PopId;

CREATE OR REPLACE VIEW vLetzterPopBericht AS
SELECT alexande_apflora_views.vLetzterPopBericht0.ApArtId, alexande_apflora_views.vLetzterPopBericht0.PopId, Max(alexande_apflora_views.vLetzterPopBericht0.PopBerJahr) AS MaxvonPopBerJahr
FROM alexande_apflora_views.vLetzterPopBericht0
GROUP BY alexande_apflora_views.vLetzterPopBericht0.ApArtId, alexande_apflora_views.vLetzterPopBericht0.PopId;

CREATE OR REPLACE VIEW vJbUebE AS 
SELECT alexande_apflora.tblJBer.*, alexande_beob.ArtenDb_Arteigenschaften.Artname, IF(alexande_beob.ArtenDb_Arteigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, alexande_beob.ArtenDb_Arteigenschaften.KefKontrolljahr, IF(Round((alexande_apflora.tblKonstanten.JBerJahr-alexande_beob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,0)=(alexande_apflora.tblKonstanten.JBerJahr-alexande_beob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr=alexande_apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2, alexande_apflora_views.vApAnzMassnBisJahr.AnzahlMassnahmen
FROM alexande_apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN ((alexande_beob.ArtenDb_Arteigenschaften INNER JOIN (alexande_apflora.tblAp INNER JOIN alexande_apflora_views.vApApBerichtRelevant ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApApBerichtRelevant.ApArtId) ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) INNER JOIN (alexande_apflora.tblKonstanten INNER JOIN (alexande_apflora.tblJBer INNER JOIN alexande_apflora_views.vApAnzMassnBisJahr ON alexande_apflora.tblJBer.ApArtId = alexande_apflora_views.vApAnzMassnBisJahr.ApArtId) ON alexande_apflora.tblKonstanten.JBerJahr = alexande_apflora.tblJBer.JBerJahr) ON alexande_apflora.tblAp.ApArtId = alexande_apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = alexande_apflora_views.vApAnzMassnBisJahr.TPopMassnJahr 
WHERE alexande_apflora_views.vApAnzMassnBisJahr.AnzahlMassnahmen>0 AND alexande_apflora.tblJBer.JBerBeurteilung=1 AND alexande_apflora.tblAp.ApStatus Between 1 And 3
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebKm AS 
SELECT alexande_beob.ArtenDb_Arteigenschaften.Artname, IF(alexande_beob.ArtenDb_Arteigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((alexande_apflora.tblKonstanten.JBerJahr-alexande_beob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,0)=(alexande_apflora.tblKonstanten.JBerJahr-alexande_beob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr=alexande_apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM (alexande_beob.ArtenDb_Arteigenschaften INNER JOIN ((alexande_apflora_views.vApAnzMassnBisJahr AS vApAnzMassnBisJahr_1 INNER JOIN alexande_apflora.tblAp ON vApAnzMassnBisJahr_1.ApArtId = alexande_apflora.tblAp.ApArtId) INNER JOIN alexande_apflora_views.vApApBerichtRelevant ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApApBerichtRelevant.ApArtId) ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) INNER JOIN (alexande_apflora.tblJBer INNER JOIN alexande_apflora.tblKonstanten ON alexande_apflora.tblJBer.JBerJahr = alexande_apflora.tblKonstanten.JBerJahr) ON (alexande_apflora.tblKonstanten.JBerJahr = vApAnzMassnBisJahr_1.TPopMassnJahr) AND (alexande_apflora.tblAp.ApArtId = alexande_apflora.tblJBer.ApArtId)
WHERE alexande_apflora.tblAp.ApStatus Between 1 And 3 AND vApAnzMassnBisJahr_1.AnzahlMassnahmen="0"
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebMa AS 
SELECT alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora_views.vApAnzMassnBisJahr.AnzahlMassnahmen
FROM alexande_apflora.tblKonstanten INNER JOIN ((alexande_beob.ArtenDb_Arteigenschaften INNER JOIN (alexande_apflora.tblAp INNER JOIN alexande_apflora_views.vApApBerichtRelevant ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApApBerichtRelevant.ApArtId) ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) INNER JOIN alexande_apflora_views.vApAnzMassnBisJahr ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApAnzMassnBisJahr.ApArtId) ON alexande_apflora.tblKonstanten.JBerJahr = alexande_apflora_views.vApAnzMassnBisJahr.TPopMassnJahr
WHERE alexande_apflora_views.vApAnzMassnBisJahr.AnzahlMassnahmen>0 AND alexande_apflora.tblAp.ApStatus Between 1 And 3
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebMe AS
SELECT alexande_apflora.tblJBer.*, alexande_beob.ArtenDb_Arteigenschaften.Artname, IF("KefArt"=-1,"Ja","") AS FnsKefArt2, IF(Round((alexande_apflora.tblKonstanten.JBerJahr-"KefKontrolljahr")/4,0)=(alexande_apflora.tblKonstanten.JBerJahr-"KefKontrolljahr")/4,"Ja","") AS FnsKefKontrJahr2, alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr=alexande_apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM alexande_apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN ((alexande_beob.ArtenDb_Arteigenschaften INNER JOIN (alexande_apflora.tblAp INNER JOIN alexande_apflora_views.vApApBerichtRelevant ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApApBerichtRelevant.ApArtId) ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) INNER JOIN ((alexande_apflora.tblJBer INNER JOIN alexande_apflora_views.vApAnzMassnBisJahr ON alexande_apflora.tblJBer.ApArtId = alexande_apflora_views.vApAnzMassnBisJahr.ApArtId) INNER JOIN alexande_apflora.tblKonstanten ON alexande_apflora.tblJBer.JBerJahr = alexande_apflora.tblKonstanten.JBerJahr) ON alexande_apflora.tblAp.ApArtId = alexande_apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = alexande_apflora_views.vApAnzMassnBisJahr.TPopMassnJahr
WHERE alexande_apflora.tblJBer.JBerBeurteilung=5 AND alexande_apflora_views.vApAnzMassnBisJahr.AnzahlMassnahmen>0 AND alexande_apflora.tblAp.ApStatus Between 1 And 3
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebNe AS
SELECT alexande_apflora.tblJBer.*, alexande_beob.ArtenDb_Arteigenschaften.Artname, IF(alexande_beob.ArtenDb_Arteigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((alexande_apflora.tblKonstanten.JBerJahr-alexande_beob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,0)=(alexande_apflora.tblKonstanten.JBerJahr-alexande_beob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr=alexande_apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM alexande_apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN ((alexande_beob.ArtenDb_Arteigenschaften INNER JOIN (alexande_apflora.tblAp INNER JOIN alexande_apflora_views.vApApBerichtRelevant ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApApBerichtRelevant.ApArtId) ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) INNER JOIN ((alexande_apflora.tblJBer INNER JOIN alexande_apflora_views.vApAnzMassnBisJahr ON alexande_apflora.tblJBer.ApArtId = alexande_apflora_views.vApAnzMassnBisJahr.ApArtId) INNER JOIN alexande_apflora.tblKonstanten ON alexande_apflora.tblJBer.JBerJahr = alexande_apflora.tblKonstanten.JBerJahr) ON alexande_apflora.tblAp.ApArtId = alexande_apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = alexande_apflora_views.vApAnzMassnBisJahr.TPopMassnJahr
WHERE alexande_apflora.tblJBer.JBerBeurteilung=3 AND alexande_apflora.tblAp.ApStatus Between 1 And 3 AND alexande_apflora_views.vApAnzMassnBisJahr.AnzahlMassnahmen>0
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebSe AS 
SELECT alexande_apflora.tblJBer.*, alexande_beob.ArtenDb_Arteigenschaften.Artname, IF(alexande_beob.ArtenDb_Arteigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((alexande_apflora.tblKonstanten.JBerJahr-alexande_beob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,0)=(alexande_apflora.tblKonstanten.JBerJahr-alexande_beob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr=alexande_apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM alexande_apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN ((alexande_beob.ArtenDb_Arteigenschaften INNER JOIN (alexande_apflora.tblAp INNER JOIN alexande_apflora_views.vApApBerichtRelevant ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApApBerichtRelevant.ApArtId) ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) INNER JOIN ((alexande_apflora.tblJBer INNER JOIN alexande_apflora_views.vApAnzMassnBisJahr ON alexande_apflora.tblJBer.ApArtId = alexande_apflora_views.vApAnzMassnBisJahr.ApArtId) INNER JOIN alexande_apflora.tblKonstanten ON alexande_apflora.tblJBer.JBerJahr = alexande_apflora.tblKonstanten.JBerJahr) ON alexande_apflora.tblAp.ApArtId = alexande_apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = alexande_apflora_views.vApAnzMassnBisJahr.TPopMassnJahr
WHERE alexande_apflora.tblJBer.JBerBeurteilung=4 AND alexande_apflora_views.vApAnzMassnBisJahr.AnzahlMassnahmen>0 AND alexande_apflora.tblAp.ApStatus Between 1 And 3
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebUn AS
SELECT alexande_apflora.tblJBer.*, alexande_beob.ArtenDb_Arteigenschaften.Artname, IF(alexande_beob.ArtenDb_Arteigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((alexande_apflora.tblKonstanten.JBerJahr-alexande_beob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,0)=(alexande_apflora.tblKonstanten.JBerJahr-alexande_beob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr=alexande_apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM alexande_apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN ((alexande_beob.ArtenDb_Arteigenschaften INNER JOIN (alexande_apflora.tblAp INNER JOIN alexande_apflora_views.vApApBerichtRelevant ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApApBerichtRelevant.ApArtId) ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) INNER JOIN ((alexande_apflora.tblJBer INNER JOIN alexande_apflora_views.vApAnzMassnBisJahr ON alexande_apflora.tblJBer.ApArtId = alexande_apflora_views.vApAnzMassnBisJahr.ApArtId) INNER JOIN alexande_apflora.tblKonstanten ON alexande_apflora.tblJBer.JBerJahr = alexande_apflora.tblKonstanten.JBerJahr) ON alexande_apflora.tblAp.ApArtId = alexande_apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = alexande_apflora_views.vApAnzMassnBisJahr.TPopMassnJahr
WHERE alexande_apflora.tblJBer.JBerBeurteilung=1168274204 AND alexande_apflora_views.vApAnzMassnBisJahr.AnzahlMassnahmen>0 AND alexande_apflora.tblAp.ApStatus Between 1 And 3
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebWe AS 
SELECT alexande_apflora.tblJBer.*, alexande_beob.ArtenDb_Arteigenschaften.Artname, IF(alexande_beob.ArtenDb_Arteigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((alexande_apflora.tblKonstanten.JBerJahr-alexande_beob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,0)=(alexande_apflora.tblKonstanten.JBerJahr-alexande_beob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr=alexande_apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM alexande_apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN ((alexande_beob.ArtenDb_Arteigenschaften INNER JOIN (alexande_apflora.tblAp INNER JOIN alexande_apflora_views.vApApBerichtRelevant ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApApBerichtRelevant.ApArtId) ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) INNER JOIN ((alexande_apflora.tblJBer INNER JOIN alexande_apflora_views.vApAnzMassnBisJahr ON alexande_apflora.tblJBer.ApArtId = alexande_apflora_views.vApAnzMassnBisJahr.ApArtId) INNER JOIN alexande_apflora.tblKonstanten ON alexande_apflora.tblJBer.JBerJahr = alexande_apflora.tblKonstanten.JBerJahr) ON alexande_apflora.tblAp.ApArtId = alexande_apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = alexande_apflora_views.vApAnzMassnBisJahr.TPopMassnJahr
WHERE alexande_apflora.tblJBer.JBerBeurteilung=6 AND alexande_apflora_views.vApAnzMassnBisJahr.AnzahlMassnahmen>0 AND alexande_apflora.tblAp.ApStatus Between 1 And 3
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebNichtBeurteilt000 AS 
SELECT alexande_apflora.tblAp.ApArtId, alexande_apflora.tblJBer.JBerJahr
FROM (((alexande_apflora.tblAp INNER JOIN alexande_apflora_views.vApAnzMassnBisJahr ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApAnzMassnBisJahr.ApArtId) INNER JOIN alexande_apflora_views.vApApBerichtRelevant ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApApBerichtRelevant.ApArtId) LEFT JOIN alexande_apflora.tblJBer ON alexande_apflora.tblAp.ApArtId = alexande_apflora.tblJBer.ApArtId) INNER JOIN alexande_apflora.tblKonstanten ON alexande_apflora_views.vApAnzMassnBisJahr.TPopMassnJahr = alexande_apflora.tblKonstanten.JBerJahr
WHERE alexande_apflora.tblJBer.ApArtId Is Null AND alexande_apflora.tblAp.ApStatus Between 1 And 3;

CREATE OR REPLACE VIEW vJbUebNichtBeurteilt00 AS 
SELECT alexande_apflora.tblAp.ApArtId, alexande_apflora.tblJBer.JBerJahr
FROM alexande_apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN (((alexande_apflora.tblAp INNER JOIN alexande_apflora_views.vApAnzMassnBisJahr ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApAnzMassnBisJahr.ApArtId) INNER JOIN alexande_apflora_views.vApApBerichtRelevant ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApApBerichtRelevant.ApArtId) INNER JOIN (alexande_apflora.tblJBer INNER JOIN alexande_apflora.tblKonstanten ON alexande_apflora.tblJBer.JBerJahr = alexande_apflora.tblKonstanten.JBerJahr) ON alexande_apflora.tblAp.ApArtId = alexande_apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = alexande_apflora_views.vApAnzMassnBisJahr.TPopMassnJahr
WHERE alexande_apflora.tblAp.ApStatus Between 1 And 3 AND alexande_apflora.tblJBer.JBerBeurteilung Is Null;

CREATE OR REPLACE VIEW vJbUebNichtBeurteilt0 AS 
select ApArtId, JBerJahr from alexande_apflora_views.vJbUebNichtBeurteilt000
UNION select ApArtId, JBerJahr from alexande_apflora_views.vJbUebNichtBeurteilt00;

CREATE OR REPLACE VIEW vJbUebNichtBeurteilt AS 
SELECT alexande_apflora.tblAp.ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora_views.vFnsKef.FnsKefArt2, alexande_apflora_views.vFnsKef.FnsKefKontrJahr2, alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(alexande_beob.ArtenDb_Arteigenschaften.FnsJahresartJahr=alexande_apflora_views.vJbUebNichtBeurteilt0.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM ((alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAp ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) LEFT JOIN alexande_apflora_views.vFnsKef ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vFnsKef.TaxonomieId) INNER JOIN alexande_apflora_views.vJbUebNichtBeurteilt0 ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vJbUebNichtBeurteilt0.ApArtId
WHERE alexande_apflora.tblAp.ApStatus Between 1 And 3
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUeT01 AS 
SELECT alexande_apflora.tblAp.ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname
FROM ((alexande_beob.ArtenDb_Arteigenschaften INNER JOIN (alexande_apflora.tblAp INNER JOIN alexande_apflora_views.vApApBerichtRelevant ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApApBerichtRelevant.ApArtId) ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) INNER JOIN alexande_apflora_views.vApAnzMassnBisJahr ON alexande_apflora.tblAp.ApArtId = alexande_apflora_views.vApAnzMassnBisJahr.ApArtId) INNER JOIN alexande_apflora.tblKonstanten ON alexande_apflora_views.vApAnzMassnBisJahr.TPopMassnJahr = alexande_apflora.tblKonstanten.JBerJahr
WHERE alexande_apflora.tblAp.ApStatus Between 1 And 3 AND alexande_apflora_views.vApAnzMassnBisJahr.AnzahlMassnahmen>"0"
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vKontrTPopStatusErloschen AS 
SELECT alexande_beob.ArtenDb_Arteigenschaften.Artname AS Art, alexande_apflora.domApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", alexande_apflora.tblPop.PopNr, alexande_apflora.tblPop.PopName, alexande_apflora.tblTPop.TPopNr, alexande_apflora.tblTPop.TPopGemeinde, alexande_apflora.tblTPop.TPopFlurname, alexande_apflora.tblTPop.TPopHerkunft, alexande_apflora.tblTPopBer.TPopBerEntwicklung, alexande_apflora.tblTPopBer.TPopBerJahr
FROM ((alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAp ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) INNER JOIN (alexande_apflora.tblPop INNER JOIN (alexande_apflora.tblTPop INNER JOIN (alexande_apflora.tblTPopBer INNER JOIN alexande_apflora_views.vTPopBerLetzterBericht ON (alexande_apflora.tblTPopBer.TPopId = alexande_apflora_views.vTPopBerLetzterBericht.TPopId) AND (alexande_apflora.tblTPopBer.TPopBerJahr = alexande_apflora_views.vTPopBerLetzterBericht.MaxvonTPopBerJahr)) ON alexande_apflora.tblTPop.TPopId = alexande_apflora.tblTPopBer.TPopId) ON alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId) ON alexande_apflora.tblAp.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.domApBearbeitungsstand ON alexande_apflora.tblAp.ApStatus = alexande_apflora.domApBearbeitungsstand.DomainCode
WHERE ((alexande_apflora.tblAp.ApStatus Between 1 And 3) AND (alexande_apflora.tblTPop.TPopHerkunft=101 Or alexande_apflora.tblTPop.TPopHerkunft=202) AND (alexande_apflora.tblTPopBer.TPopBerEntwicklung<>8)) OR ((alexande_apflora.tblAp.ApStatus Between 1 And 3) AND (alexande_apflora.tblTPop.TPopHerkunft Not Like 101 And alexande_apflora.tblTPop.TPopHerkunft Not Like 202) AND (alexande_apflora.tblTPopBer.TPopBerEntwicklung=8))
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora.tblPop.PopNr, alexande_apflora.tblPop.PopName, alexande_apflora.tblTPop.TPopNr, alexande_apflora.tblTPop.TPopGemeinde, alexande_apflora.tblTPop.TPopFlurname;

#im Gebrauch (Access):
CREATE OR REPLACE VIEW vBerJb AS 
SELECT alexande_apflora.tblAp.*, alexande_beob.ArtenDb_Arteigenschaften.Artname AS Art, alexande_apflora.tblJBer.JBerId, alexande_apflora.tblJBer.JBerJahr, alexande_apflora.tblJBer.JBerSituation, alexande_apflora.tblJBer.JBerVergleichVorjahrGesamtziel, alexande_apflora.tblJBer.JBerBeurteilung, alexande_apflora.tblJBer.JBerAnalyse, alexande_apflora.tblJBer.JBerUmsetzung, alexande_apflora.tblJBer.JBerErfko, alexande_apflora.tblJBer.JBerATxt, alexande_apflora.tblJBer.JBerBTxt, alexande_apflora.tblJBer.JBerCTxt, alexande_apflora.tblJBer.JBerDTxt, alexande_apflora.tblJBer.JBerDatum, alexande_apflora.tblJBer.JBerBearb, alexande_apflora.tblAdresse.AdrName & ", " & alexande_apflora.tblAdresse.AdrAdresse AS Bearbeiter, alexande_apflora.tblJBerUebersicht.JbuJahr, alexande_apflora.tblJBerUebersicht.JbuBemerkungen, alexande_apflora_views.vErsteMassnahmeProArt.MinvonTPopMassnJahr AS ErsteMassnahmeImJahr
FROM (alexande_beob.ArtenDb_Arteigenschaften INNER JOIN (alexande_apflora.tblAp LEFT JOIN alexande_apflora_views.vErsteMassnahmeProArt ON alexande_apflora.tblAp.ApArtId=alexande_apflora_views.vErsteMassnahmeProArt.ApArtId) ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId=alexande_apflora.tblAp.ApArtId) INNER JOIN (((alexande_apflora.tblJBer LEFT JOIN alexande_apflora.tblAdresse ON alexande_apflora.tblJBer.JBerBearb=alexande_apflora.tblAdresse.AdrId) LEFT JOIN alexande_apflora.tblJBerUebersicht ON alexande_apflora.tblJBer.JBerJahr=alexande_apflora.tblJBerUebersicht.JbuJahr) INNER JOIN alexande_apflora.tblKonstanten ON alexande_apflora.tblJBer.JBerJahr=alexande_apflora.tblKonstanten.JBerJahr) ON alexande_apflora.tblAp.ApArtId=alexande_apflora.tblJBer.ApArtId
WHERE alexande_apflora.tblAp.ApStatus Between 1 And 3
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbB2rPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId
FROM ((alexande_apflora_views.vLetzterPopBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterPopBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblPopBer ON (alexande_apflora.tblPop.PopId = alexande_apflora.tblPopBer.PopId) AND (alexande_apflora_views.vLetzterPopBericht.PopId = alexande_apflora.tblPopBer.PopId) AND (alexande_apflora_views.vLetzterPopBericht.MaxvonPopBerJahr = alexande_apflora.tblPopBer.PopBerJahr)) INNER JOIN alexande_apflora.tblTPop ON alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId
WHERE alexande_apflora.tblPopBer.PopBerEntwicklung=3 AND alexande_apflora.tblTPop.TPopApBerichtRelevant=1 AND alexande_apflora.tblPop.PopHerkunft <> 300
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbB3rPop AS
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId
FROM ((alexande_apflora_views.vLetzterPopBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterPopBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblPopBer ON (alexande_apflora.tblPop.PopId = alexande_apflora.tblPopBer.PopId) AND (alexande_apflora_views.vLetzterPopBericht.PopId = alexande_apflora.tblPopBer.PopId) AND (alexande_apflora_views.vLetzterPopBericht.MaxvonPopBerJahr = alexande_apflora.tblPopBer.PopBerJahr)) INNER JOIN alexande_apflora.tblTPop ON alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId
WHERE alexande_apflora.tblPopBer.PopBerEntwicklung=2 AND alexande_apflora.tblTPop.TPopApBerichtRelevant=1 AND alexande_apflora.tblPop.PopHerkunft <> 300
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbB4rPop AS
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId
FROM ((alexande_apflora_views.vLetzterPopBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterPopBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblPopBer ON (alexande_apflora.tblPop.PopId = alexande_apflora.tblPopBer.PopId) AND (alexande_apflora_views.vLetzterPopBericht.PopId = alexande_apflora.tblPopBer.PopId) AND (alexande_apflora_views.vLetzterPopBericht.MaxvonPopBerJahr = alexande_apflora.tblPopBer.PopBerJahr)) INNER JOIN alexande_apflora.tblTPop ON alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId
WHERE alexande_apflora.tblPopBer.PopBerEntwicklung=1 AND alexande_apflora.tblTPop.TPopApBerichtRelevant=1 AND alexande_apflora.tblPop.PopHerkunft <> 300
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbB5rPop AS
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId
FROM ((alexande_apflora_views.vLetzterPopBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterPopBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblPopBer ON (alexande_apflora.tblPop.PopId = alexande_apflora.tblPopBer.PopId) AND (alexande_apflora_views.vLetzterPopBericht.PopId = alexande_apflora.tblPopBer.PopId) AND (alexande_apflora_views.vLetzterPopBericht.MaxvonPopBerJahr = alexande_apflora.tblPopBer.PopBerJahr)) INNER JOIN alexande_apflora.tblTPop ON alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId
WHERE (alexande_apflora.tblPopBer.PopBerEntwicklung=4 Or alexande_apflora.tblPopBer.PopBerEntwicklung=9) AND alexande_apflora.tblTPop.TPopApBerichtRelevant=1 AND alexande_apflora.tblPop.PopHerkunft <> 300
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbB6rPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId
FROM ((alexande_apflora_views.vLetzterPopBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterPopBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblPopBer ON (alexande_apflora.tblPop.PopId = alexande_apflora.tblPopBer.PopId) AND (alexande_apflora_views.vLetzterPopBericht.PopId = alexande_apflora.tblPopBer.PopId) AND (alexande_apflora_views.vLetzterPopBericht.MaxvonPopBerJahr = alexande_apflora.tblPopBer.PopBerJahr)) INNER JOIN alexande_apflora.tblTPop ON alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId
WHERE alexande_apflora.tblPopBer.PopBerEntwicklung=8 AND alexande_apflora.tblTPop.TPopApBerichtRelevant=1 AND alexande_apflora.tblPop.PopHerkunft <> 300
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbB2rTPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId
FROM alexande_apflora.tblTPop INNER JOIN (alexande_apflora.tblTPopBer INNER JOIN (alexande_apflora.tblPop INNER JOIN alexande_apflora_views.vLetzterTPopBericht ON alexande_apflora.tblPop.ApArtId = alexande_apflora_views.vLetzterTPopBericht.ApArtId) ON (alexande_apflora.tblTPopBer.TPopId = alexande_apflora_views.vLetzterTPopBericht.TPopId) AND (alexande_apflora.tblTPopBer.TPopBerJahr = alexande_apflora_views.vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (alexande_apflora.tblTPop.PopId = alexande_apflora.tblPop.PopId) AND (alexande_apflora.tblTPop.TPopId = alexande_apflora.tblTPopBer.TPopId)
WHERE alexande_apflora.tblTPopBer.TPopBerEntwicklung=3 AND alexande_apflora.tblTPop.TPopApBerichtRelevant=1 AND alexande_apflora.tblPop.PopHerkunft <> 300
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbB3rTPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId
FROM alexande_apflora.tblTPop INNER JOIN (alexande_apflora.tblTPopBer INNER JOIN (alexande_apflora.tblPop INNER JOIN alexande_apflora_views.vLetzterTPopBericht ON alexande_apflora.tblPop.ApArtId = alexande_apflora_views.vLetzterTPopBericht.ApArtId) ON (alexande_apflora.tblTPopBer.TPopId = alexande_apflora_views.vLetzterTPopBericht.TPopId) AND (alexande_apflora.tblTPopBer.TPopBerJahr = alexande_apflora_views.vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (alexande_apflora.tblTPop.PopId = alexande_apflora.tblPop.PopId) AND (alexande_apflora.tblTPop.TPopId = alexande_apflora.tblTPopBer.TPopId)
WHERE alexande_apflora.tblTPopBer.TPopBerEntwicklung=2 AND alexande_apflora.tblTPop.TPopApBerichtRelevant=1 AND alexande_apflora.tblPop.PopHerkunft <> 300
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbB4rTPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId
FROM alexande_apflora.tblTPop INNER JOIN (alexande_apflora.tblTPopBer INNER JOIN (alexande_apflora.tblPop INNER JOIN alexande_apflora_views.vLetzterTPopBericht ON alexande_apflora.tblPop.ApArtId = alexande_apflora_views.vLetzterTPopBericht.ApArtId) ON (alexande_apflora.tblTPopBer.TPopId = alexande_apflora_views.vLetzterTPopBericht.TPopId) AND (alexande_apflora.tblTPopBer.TPopBerJahr = alexande_apflora_views.vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (alexande_apflora.tblTPop.PopId = alexande_apflora.tblPop.PopId) AND (alexande_apflora.tblTPop.TPopId = alexande_apflora.tblTPopBer.TPopId)
WHERE alexande_apflora.tblTPopBer.TPopBerEntwicklung=1 AND alexande_apflora.tblTPop.TPopApBerichtRelevant=1 AND alexande_apflora.tblPop.PopHerkunft <> 300
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbB5rTPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId
FROM alexande_apflora.tblTPop INNER JOIN (alexande_apflora.tblTPopBer INNER JOIN (alexande_apflora.tblPop INNER JOIN alexande_apflora_views.vLetzterTPopBericht ON alexande_apflora.tblPop.ApArtId = alexande_apflora_views.vLetzterTPopBericht.ApArtId) ON (alexande_apflora.tblTPopBer.TPopId = alexande_apflora_views.vLetzterTPopBericht.TPopId) AND (alexande_apflora.tblTPopBer.TPopBerJahr = alexande_apflora_views.vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (alexande_apflora.tblTPop.PopId = alexande_apflora.tblPop.PopId) AND (alexande_apflora.tblTPop.TPopId = alexande_apflora.tblTPopBer.TPopId)
WHERE alexande_apflora.tblTPopBer.TPopBerEntwicklung=4 AND alexande_apflora.tblTPop.TPopApBerichtRelevant=1 AND alexande_apflora.tblPop.PopHerkunft <> 300
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbB6rTPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId
FROM alexande_apflora.tblTPop INNER JOIN (alexande_apflora.tblTPopBer INNER JOIN (alexande_apflora.tblPop INNER JOIN alexande_apflora_views.vLetzterTPopBericht ON alexande_apflora.tblPop.ApArtId = alexande_apflora_views.vLetzterTPopBericht.ApArtId) ON (alexande_apflora.tblTPopBer.TPopId = alexande_apflora_views.vLetzterTPopBericht.TPopId) AND (alexande_apflora.tblTPopBer.TPopBerJahr = alexande_apflora_views.vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (alexande_apflora.tblTPop.PopId = alexande_apflora.tblPop.PopId) AND (alexande_apflora.tblTPop.TPopId = alexande_apflora.tblTPopBer.TPopId)
WHERE alexande_apflora.tblTPopBer.TPopBerEntwicklung=8 AND alexande_apflora.tblTPop.TPopApBerichtRelevant=1 AND alexande_apflora.tblPop.PopHerkunft <> 300
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbC1rPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId
FROM alexande_apflora.tblKonstanten, (alexande_apflora.tblPop INNER JOIN alexande_apflora.tblTPop ON alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId) INNER JOIN alexande_apflora.tblTPopMassn ON alexande_apflora.tblTPop.TPopId = alexande_apflora.tblTPopMassn.TPopId
WHERE alexande_apflora.tblTPopMassn.TPopMassnJahr<=alexande_apflora.tblKonstanten.JBerJahr AND alexande_apflora.tblTPop.TPopApBerichtRelevant=1 AND alexande_apflora.tblPop.PopHerkunft <> 300
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbC3rPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId
FROM (alexande_apflora_views.vLetzterPopMassnBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterPopMassnBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblPopMassnBer ON (alexande_apflora.tblPop.PopId = alexande_apflora.tblPopMassnBer.PopId) AND (alexande_apflora_views.vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = alexande_apflora.tblPopMassnBer.PopMassnBerJahr) AND (alexande_apflora_views.vLetzterPopMassnBericht.PopId = alexande_apflora.tblPopMassnBer.PopId)
WHERE alexande_apflora.tblPopMassnBer.PopMassnBerErfolgsbeurteilung=1
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbC4rPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId
FROM (alexande_apflora_views.vLetzterPopMassnBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterPopMassnBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblPopMassnBer ON (alexande_apflora.tblPop.PopId = alexande_apflora.tblPopMassnBer.PopId) AND (alexande_apflora_views.vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = alexande_apflora.tblPopMassnBer.PopMassnBerJahr) AND (alexande_apflora_views.vLetzterPopMassnBericht.PopId = alexande_apflora.tblPopMassnBer.PopId)
WHERE (((alexande_apflora.tblPopMassnBer.PopMassnBerErfolgsbeurteilung)=2))
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbC5rPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId
FROM (alexande_apflora_views.vLetzterPopMassnBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterPopMassnBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblPopMassnBer ON (alexande_apflora.tblPop.PopId = alexande_apflora.tblPopMassnBer.PopId) AND (alexande_apflora_views.vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = alexande_apflora.tblPopMassnBer.PopMassnBerJahr) AND (alexande_apflora_views.vLetzterPopMassnBericht.PopId = alexande_apflora.tblPopMassnBer.PopId)
WHERE alexande_apflora.tblPopMassnBer.PopMassnBerErfolgsbeurteilung=3
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbC6rPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId
FROM (alexande_apflora_views.vLetzterPopMassnBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterPopMassnBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblPopMassnBer ON (alexande_apflora.tblPop.PopId = alexande_apflora.tblPopMassnBer.PopId) AND (alexande_apflora_views.vLetzterPopMassnBericht.PopId = alexande_apflora.tblPopMassnBer.PopId) AND (alexande_apflora_views.vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = alexande_apflora.tblPopMassnBer.PopMassnBerJahr)
WHERE alexande_apflora.tblPopMassnBer.PopMassnBerErfolgsbeurteilung=4
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbC7rPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId
FROM (alexande_apflora_views.vLetzterPopMassnBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterPopMassnBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblPopMassnBer ON (alexande_apflora.tblPop.PopId = alexande_apflora.tblPopMassnBer.PopId) AND (alexande_apflora_views.vLetzterPopMassnBericht.PopId = alexande_apflora.tblPopMassnBer.PopId) AND (alexande_apflora_views.vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = alexande_apflora.tblPopMassnBer.PopMassnBerJahr)
WHERE alexande_apflora.tblPopMassnBer.PopMassnBerErfolgsbeurteilung=5
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbC3rTPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId
FROM ((alexande_apflora_views.vLetzterTPopMassnBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterTPopMassnBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblTPopMassnBer ON (alexande_apflora_views.vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = alexande_apflora.tblTPopMassnBer.TPopMassnBerJahr) AND (alexande_apflora_views.vLetzterTPopMassnBericht.TPopId = alexande_apflora.tblTPopMassnBer.TPopId)) INNER JOIN alexande_apflora.tblTPop ON (alexande_apflora.tblTPopMassnBer.TPopId = alexande_apflora.tblTPop.TPopId) AND (alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId)
WHERE alexande_apflora.tblTPopMassnBer.TPopMassnBerErfolgsbeurteilung=1
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbC4rTPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId
FROM ((alexande_apflora_views.vLetzterTPopMassnBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterTPopMassnBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblTPopMassnBer ON (alexande_apflora_views.vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = alexande_apflora.tblTPopMassnBer.TPopMassnBerJahr) AND (alexande_apflora_views.vLetzterTPopMassnBericht.TPopId = alexande_apflora.tblTPopMassnBer.TPopId)) INNER JOIN alexande_apflora.tblTPop ON (alexande_apflora.tblTPopMassnBer.TPopId = alexande_apflora.tblTPop.TPopId) AND (alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId)
WHERE (alexande_apflora.tblTPopMassnBer.TPopMassnBerErfolgsbeurteilung=2)
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbC5rTPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId
FROM ((alexande_apflora_views.vLetzterTPopMassnBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterTPopMassnBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblTPopMassnBer ON (alexande_apflora_views.vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = alexande_apflora.tblTPopMassnBer.TPopMassnBerJahr) AND (alexande_apflora_views.vLetzterTPopMassnBericht.TPopId = alexande_apflora.tblTPopMassnBer.TPopId)) INNER JOIN alexande_apflora.tblTPop ON (alexande_apflora.tblTPopMassnBer.TPopId = alexande_apflora.tblTPop.TPopId) AND (alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId)
WHERE alexande_apflora.tblTPopMassnBer.TPopMassnBerErfolgsbeurteilung=3
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbC6rTPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId
FROM ((alexande_apflora_views.vLetzterTPopMassnBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterTPopMassnBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblTPopMassnBer ON (alexande_apflora_views.vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = alexande_apflora.tblTPopMassnBer.TPopMassnBerJahr) AND (alexande_apflora_views.vLetzterTPopMassnBericht.TPopId = alexande_apflora.tblTPopMassnBer.TPopId)) INNER JOIN alexande_apflora.tblTPop ON (alexande_apflora.tblTPopMassnBer.TPopId = alexande_apflora.tblTPop.TPopId) AND (alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId)
WHERE alexande_apflora.tblTPopMassnBer.TPopMassnBerErfolgsbeurteilung=4
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbC7rTPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId
FROM ((alexande_apflora_views.vLetzterTPopMassnBericht INNER JOIN alexande_apflora.tblPop ON alexande_apflora_views.vLetzterTPopMassnBericht.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblTPopMassnBer ON (alexande_apflora_views.vLetzterTPopMassnBericht.TPopId = alexande_apflora.tblTPopMassnBer.TPopId) AND (alexande_apflora_views.vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = alexande_apflora.tblTPopMassnBer.TPopMassnBerJahr)) INNER JOIN alexande_apflora.tblTPop ON (alexande_apflora.tblTPopMassnBer.TPopId = alexande_apflora.tblTPop.TPopId) AND (alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId)
WHERE alexande_apflora.tblTPopMassnBer.TPopMassnBerErfolgsbeurteilung=5
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW alexande_apflora_views.vJbA1lPop AS 
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId
FROM alexande_apflora.tblPop INNER JOIN alexande_apflora.tblTPop ON alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId
WHERE alexande_apflora.tblTPop.TPopApBerichtRelevant=1 AND alexande_apflora.tblPop.PopHerkunft <> 300
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId;

CREATE OR REPLACE VIEW alexande_apflora_views.vJbA2lPop AS
SELECT alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId
FROM alexande_apflora.tblPop INNER JOIN alexande_apflora.tblTPop ON alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId
WHERE alexande_apflora.tblPop.PopHerkunft=100 AND alexande_apflora.tblTPop.TPopApBerichtRelevant=1
GROUP BY alexande_apflora.tblPop.ApArtId, alexande_apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vPop_BerUndMassnBer AS
SELECT alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS "AP ApArtId", alexande_beob.ArtenDb_Arteigenschaften.Artname AS "AP Art", alexande_apflora.domApBearbeitungsstand.DomainTxt AS "AP Status", alexande_apflora.tblAp.ApJahr AS "AP Start im Jahr", alexande_apflora.domApUmsetzung.DomainTxt AS "AP Stand Umsetzung", alexande_apflora.tblPop.PopGuid AS "Pop Guid", alexande_apflora.tblPop.PopNr AS "Pop Nr", alexande_apflora.tblPop.PopName AS "Pop Name", domPopHerkunft.HerkunftTxt AS "Pop Status", alexande_apflora.tblPop.PopBekanntSeit AS "Pop bekannt seit", alexande_apflora.tblPop.PopHerkunftUnklar AS "Pop Status unklar", alexande_apflora.tblPop.PopHerkunftUnklarBegruendung AS "Pop Begruendung fuer unklaren Status", alexande_apflora.tblPop.PopXKoord AS "Pop X-Koordinaten", alexande_apflora.tblPop.PopYKoord AS "Pop Y-Koordinaten", alexande_apflora.tblPop.MutWann AS "Datensatz zuletzt geaendert", alexande_apflora.tblPop.MutWer AS "Datensatz zuletzt geaendert von", alexande_apflora_views.vPopBerMassnJahre.Jahr, alexande_apflora.tblPopBer.PopBerId AS "PopBer Id", alexande_apflora.tblPopBer.PopBerJahr AS "PopBer Jahr", domPopEntwicklung.EntwicklungTxt AS "PopBer Entwicklung", alexande_apflora.tblPopBer.PopBerTxt AS "PopBer Bemerkungen", alexande_apflora.tblPopBer.MutWann AS "PopBer MutWann", alexande_apflora.tblPopBer.MutWer AS "PopBer MutWer", alexande_apflora.tblPopMassnBer.PopMassnBerId AS "PopMassnBer Id", alexande_apflora.tblPopMassnBer.PopMassnBerJahr AS "PopMassnBer Jahr", domTPopMassnErfolgsbeurteilung.BeurteilTxt AS "PopMassnBer Entwicklung", alexande_apflora.tblPopMassnBer.PopMassnBerTxt AS "PopMassnBer Interpretation", alexande_apflora.tblPopMassnBer.MutWann AS "PopMassnBer MutWann", alexande_apflora.tblPopMassnBer.MutWer AS "PopMassnBer MutWer"
FROM (((((((alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAp ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) INNER JOIN alexande_apflora.tblPop ON alexande_apflora.tblAp.ApArtId = alexande_apflora.tblPop.ApArtId) LEFT JOIN alexande_apflora.domApBearbeitungsstand ON alexande_apflora.tblAp.ApStatus = alexande_apflora.domApBearbeitungsstand.DomainCode) LEFT JOIN alexande_apflora.domApUmsetzung ON alexande_apflora.tblAp.ApUmsetzung = alexande_apflora.domApUmsetzung.DomainCode) LEFT JOIN alexande_apflora.domPopHerkunft ON alexande_apflora.tblPop.PopHerkunft = domPopHerkunft.HerkunftId) LEFT JOIN alexande_apflora_views.vPopBerMassnJahre ON alexande_apflora.tblPop.PopId = alexande_apflora_views.vPopBerMassnJahre.PopId) LEFT JOIN (alexande_apflora.tblPopMassnBer LEFT JOIN alexande_apflora.domTPopMassnErfolgsbeurteilung ON alexande_apflora.tblPopMassnBer.PopMassnBerErfolgsbeurteilung = domTPopMassnErfolgsbeurteilung.BeurteilId) ON (alexande_apflora_views.vPopBerMassnJahre.Jahr = alexande_apflora.tblPopMassnBer.PopMassnBerJahr) AND (alexande_apflora_views.vPopBerMassnJahre.PopId = alexande_apflora.tblPopMassnBer.PopId)) LEFT JOIN (alexande_apflora.tblPopBer LEFT JOIN alexande_apflora.domPopEntwicklung ON alexande_apflora.tblPopBer.PopBerEntwicklung = domPopEntwicklung.EntwicklungId) ON (alexande_apflora_views.vPopBerMassnJahre.Jahr = alexande_apflora.tblPopBer.PopBerJahr) AND (alexande_apflora_views.vPopBerMassnJahre.PopId = alexande_apflora.tblPopBer.PopId)
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora.tblPop.PopNr, alexande_apflora_views.vPopBerMassnJahre.Jahr;

CREATE OR REPLACE VIEW vTPop_BerUndMassnBer AS
SELECT alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname AS "AP Art", alexande_apflora.domApBearbeitungsstand.DomainTxt AS "AP Status", alexande_apflora.tblAp.ApJahr AS "AP Start im Jahr", alexande_apflora.domApUmsetzung.DomainTxt AS "AP Stand Umsetzung", alexande_apflora.tblPop.PopGuid AS "Pop Guid", alexande_apflora.tblPop.PopNr AS "Pop Nr", alexande_apflora.tblPop.PopName AS "Pop Name", domPopHerkunft.HerkunftTxt AS "Pop Status", alexande_apflora.tblPop.PopBekanntSeit AS "Pop bekannt seit", alexande_apflora.tblPop.PopHerkunftUnklar AS "Pop Status unklar", alexande_apflora.tblPop.PopHerkunftUnklarBegruendung AS "Pop Begruendung fuer unklaren Status", alexande_apflora.tblPop.PopXKoord AS "Pop X-Koordinaten", alexande_apflora.tblPop.PopYKoord AS "Pop Y-Koordinaten", alexande_apflora.tblTPop.TPopId AS "TPop ID", alexande_apflora.tblTPop.TPopGuid AS "TPop Guid", alexande_apflora.tblTPop.TPopNr AS "TPop Nr", alexande_apflora.tblTPop.TPopGemeinde AS "TPop Gemeinde", alexande_apflora.tblTPop.TPopFlurname AS "TPop Flurname", domPopHerkunft_1.HerkunftTxt AS "TPop Status", alexande_apflora.tblTPop.TPopBekanntSeit AS "TPop bekannt seit", alexande_apflora.tblTPop.TPopHerkunftUnklar AS "TPop Status unklar", alexande_apflora.tblTPop.TPopHerkunftUnklarBegruendung AS "TPop Begruendung fuer unklaren Status", alexande_apflora.tblTPop.TPopXKoord AS "TPop X-Koordinaten", alexande_apflora.tblTPop.TPopYKoord AS "TPop Y-Koordinaten", alexande_apflora.tblTPop.TPopRadius AS "TPop Radius (m)", alexande_apflora.tblTPop.TPopHoehe AS "TPop Hoehe", alexande_apflora.tblTPop.TPopExposition AS "TPop Exposition", alexande_apflora.tblTPop.TPopKlima AS "TPop Klima", alexande_apflora.tblTPop.TPopNeigung AS "TPop Hangneigung", alexande_apflora.tblTPop.TPopBeschr AS "TPop Beschreibung", alexande_apflora.tblTPop.TPopKatNr AS "TPop Kataster-Nr", alexande_apflora.tblTPop.TPopApBerichtRelevant AS "TPop fuer AP-Bericht relevant", alexande_apflora.tblTPop.TPopEigen AS "TPop EigentuemerIn", alexande_apflora.tblTPop.TPopKontakt AS "TPop Kontakt vor Ort", alexande_apflora.tblTPop.TPopNutzungszone AS "TPop Nutzungszone", alexande_apflora.tblTPop.TPopBewirtschafterIn AS "TPop BewirtschafterIn", alexande_apflora.tblTPop.TPopBewirtschaftung AS "TPop Bewirtschaftung", alexande_apflora_views.vTPopBerMassnJahre.Jahr, alexande_apflora.tblTPopBer.TPopBerId AS "TPopBer Id", alexande_apflora.tblTPopBer.TPopBerJahr AS "TPopBer Jahr", domPopEntwicklung.EntwicklungTxt AS "TPopBer Entwicklung", alexande_apflora.tblTPopBer.TPopBerTxt AS "TPopBer Bemerkungen", alexande_apflora.tblTPopBer.MutWann AS "TPopBer MutWann", alexande_apflora.tblTPopBer.MutWer AS "TPopBer MutWer", alexande_apflora.tblTPopMassnBer.TPopMassnBerJahr AS "TPopMassnBer Jahr", domTPopMassnErfolgsbeurteilung.BeurteilTxt AS "TPopMassnBer Entwicklung", alexande_apflora.tblTPopMassnBer.TPopMassnBerTxt AS "TPopMassnBer Interpretation", alexande_apflora.tblTPopMassnBer.MutWann AS "TPopMassnBer MutWann", alexande_apflora.tblTPopMassnBer.MutWer AS "TPopMassnBer MutWer"
FROM ((((((((((alexande_beob.ArtenDb_Arteigenschaften RIGHT JOIN alexande_apflora.tblAp ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId = alexande_apflora.tblAp.ApArtId) RIGHT JOIN (alexande_apflora.tblPop RIGHT JOIN alexande_apflora.tblTPop ON alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId) ON alexande_apflora.tblAp.ApArtId = alexande_apflora.tblPop.ApArtId) LEFT JOIN alexande_apflora.domApBearbeitungsstand ON alexande_apflora.tblAp.ApStatus = alexande_apflora.domApBearbeitungsstand.DomainCode) LEFT JOIN alexande_apflora.domApUmsetzung ON alexande_apflora.tblAp.ApUmsetzung = alexande_apflora.domApUmsetzung.DomainCode) LEFT JOIN alexande_apflora.domPopHerkunft ON alexande_apflora.tblPop.PopHerkunft = domPopHerkunft.HerkunftId) LEFT JOIN alexande_apflora.domPopHerkunft AS domPopHerkunft_1 ON alexande_apflora.tblTPop.TPopHerkunft = domPopHerkunft_1.HerkunftId) LEFT JOIN alexande_apflora_views.vTPopBerMassnJahre ON alexande_apflora.tblTPop.TPopId = alexande_apflora_views.vTPopBerMassnJahre.TPopId) LEFT JOIN alexande_apflora.tblTPopMassnBer ON (alexande_apflora_views.vTPopBerMassnJahre.TPopId = alexande_apflora.tblTPopMassnBer.TPopId) AND (alexande_apflora_views.vTPopBerMassnJahre.Jahr = alexande_apflora.tblTPopMassnBer.TPopMassnBerJahr)) LEFT JOIN alexande_apflora.domTPopMassnErfolgsbeurteilung ON alexande_apflora.tblTPopMassnBer.TPopMassnBerErfolgsbeurteilung = domTPopMassnErfolgsbeurteilung.BeurteilId) LEFT JOIN alexande_apflora.tblTPopBer ON (alexande_apflora_views.vTPopBerMassnJahre.Jahr = alexande_apflora.tblTPopBer.TPopBerJahr) AND (alexande_apflora_views.vTPopBerMassnJahre.TPopId = alexande_apflora.tblTPopBer.TPopId)) LEFT JOIN alexande_apflora.domPopEntwicklung ON alexande_apflora.tblTPopBer.TPopBerEntwicklung = domPopEntwicklung.EntwicklungId
ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora.tblPop.PopNr, alexande_apflora.tblTPop.TPopNr, alexande_apflora_views.vTPopBerMassnJahre.Jahr;

CREATE OR REPLACE VIEW vPop_BerMassnJahreVonTPop AS 
SELECT alexande_apflora.tblTPop.PopId, alexande_apflora_views.vTPopBerMassnJahre.Jahr
FROM alexande_apflora_views.vTPopBerMassnJahre INNER JOIN alexande_apflora.tblTPop ON alexande_apflora_views.vTPopBerMassnJahre.TPopId = alexande_apflora.tblTPop.TPopId
GROUP BY alexande_apflora.tblTPop.PopId, alexande_apflora_views.vTPopBerMassnJahre.Jahr;

CREATE OR REPLACE VIEW vKontrLetzte AS
SELECT * FROM alexande_apflora_views.vKontr INNER JOIN alexande_apflora_views.vKontrLetzteId ON alexande_apflora_views.vKontr.TPopKontrId = alexande_apflora_views.vKontrLetzteId.MaxTPopKontrId;