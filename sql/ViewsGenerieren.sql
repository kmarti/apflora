CREATE VIEW qryAbfrageGleicherOrt AS 
SELECT tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopAuswahl
FROM tblTeilpopulation
ORDER BY tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord;

CREATE VIEW qryAp3 AS 
SELECT tblAktionsplan.*, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopApBerichtRelevant
FROM tblAktionsplan LEFT JOIN (tblPopulation LEFT JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId;

CREATE VIEW qryAp2 AS 
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName
FROM tblAktionsplan LEFT JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId;

CREATE VIEW qryAp1 AS 
SELECT tblAktionsplan.*, ArtenDb_tblFloraSisf.Name, ArtenDb_tblFloraFnsArtwert.AwArtwert AS Artwert
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR=tblAktionsplan.ApArtId) LEFT JOIN ArtenDb_tblFloraFnsArtwert ON ArtenDb_tblFloraSisf.NR=ArtenDb_tblFloraFnsArtwert.SisfNr
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryAp AS 
SELECT tblAktionsplan.*, ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR=tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId=tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId=tblPopulation.ApArtId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW qryApApBerichtRelevant AS 
SELECT tblAktionsplan.ApArtId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblAktionsplan.ApArtId;

CREATE VIEW qryAuswFlurnameArtMassn AS 
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, tblTeilPopMassnahme.TPopMassnId, tblTeilpopulation.TPopGemeinde AS "Teilpopulation-Gemeinde", tblTeilpopulation.TPopFlurname AS "Teilpopulation-Flurname", tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopMassnahme.TPopMassnJahr AS "TPopMassnahme-Jahr", DomainTPopMassnTyp.MassnTypTxt AS Massnahme, DomainTPopMassnTyp.MassnAnsiedlung AS Ansiedlung, tblTeilPopMassnahme.TPopMassnTxt, tblTeilPopMassnahme.TPopMassnDatum, tblAdresse.AdrName AS TPopMassnBearb, tblTeilPopMassnahme.TPopMassnBemTxt, tblTeilPopMassnahme.TPopMassnPlan, tblTeilPopMassnahme.TPopMassnPlanBez, tblTeilPopMassnahme.TPopMassnFlaeche, tblTeilPopMassnahme.TPopMassnMarkierung, tblTeilPopMassnahme.TPopMassnAnsiedAnzTriebe, tblTeilPopMassnahme.TPopMassnAnsiedAnzPfl, tblTeilPopMassnahme.TPopMassnAnzPflanzstellen, tblTeilPopMassnahme.TPopMassnAnsiedWirtspfl, tblTeilPopMassnahme.TPopMassnAnsiedHerkunftPop, tblTeilPopMassnahme.TPopMassnAnsiedDatSamm, tblTeilPopMassnahme.TPopMassnAnsiedForm, tblTeilPopMassnahme.TPopMassnAnsiedPflanzanordnung
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN ((tblTeilPopMassnahme LEFT JOIN DomainTPopMassnTyp ON tblTeilPopMassnahme.TPopMassnTyp = DomainTPopMassnTyp.MassnTypCode) LEFT JOIN tblAdresse ON tblTeilPopMassnahme.TPopMassnBearb = tblAdresse.AdrId) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
ORDER BY tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, ArtenDb_tblFloraSisf.Name, tblTeilpopulation.TPopNr, tblTeilPopMassnahme.TPopMassnJahr, DomainTPopMassnTyp.MassnTypTxt;

CREATE VIEW qryAuswLetzteAnzahlLetzteKontrolle AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopId, tblPopulation.PopNr, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, Max(tblTeilPopFeldkontrolle.TPopKontrJahr) AS MaxvonTPopKontrJahr
FROM ArtenDb_tblFloraSisf INNER JOIN (((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Ziel" And (tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Zwischenziel"))
GROUP BY tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopId, tblPopulation.PopNr, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr
HAVING (((Max(tblTeilPopFeldkontrolle.TPopKontrJahr)) Is Not Null))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW qryAuswLetzteAnzLetzteKontrollen AS 
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, DomainPopHerkunft.HerkunftTxt AS TPopHerkunft, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilPopFeldkontrolle.TPopKontrTyp, tblTeilPopFeldkontrolle.TPopKontrDatum, tblTeilPopFeldkontrolle.TPopKontrJahr, tblAdresse.AdrName AS TPopKontrBearb, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, DomainTPopKontrMethode.BeurteilTxt AS TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, DomainTPopKontrMethode_1.BeurteilTxt AS TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, DomainTPopKontrMethode_2.BeurteilTxt AS TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrJungpfl, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, tblTeilPopFeldkontrolle.TPopKontrUeberleb, DomainTPopEntwicklung.EntwicklungTxt AS TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr, tblTeilPopFeldkontrolle.TPopKontrTxt, tblTeilPopFeldkontrolle.TPopKontrLeb, tblTeilPopFeldkontrolle.TPopKontrFlaeche, tblTeilPopFeldkontrolle.TPopKontrLebUmg, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht, tblTeilPopFeldkontrolle.TPopKontrBodenTyp, tblTeilPopFeldkontrolle.TPopKontrBodenAbtrag, tblTeilPopFeldkontrolle.TPopKontrWasserhaushalt, tblTeilPopFeldkontrolle.TPopKontrHandlungsbedarf, tblTeilPopFeldkontrolle.TPopKontrUebFlaeche, tblTeilPopFeldkontrolle.TPopKontrPlan, tblTeilPopFeldkontrolle.TPopKontrVeg, tblTeilPopFeldkontrolle.TPopKontrNaBo, tblTeilPopFeldkontrolle.TPopKontrUebPfl, tblTeilPopFeldkontrolle.TPopKontrJungPflJN, tblTeilPopFeldkontrolle.TPopKontrVegHoeMax, tblTeilPopFeldkontrolle.TPopKontrVegHoeMit, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung, tblTeilPopFeldkontrolle.TPopKontrMutDat
FROM qryAuswLetzteAnzahlLetzteKontrolle INNER JOIN ((((((((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainTPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainTPopEntwicklung.EntwicklungCode) LEFT JOIN DomainPopHerkunft ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft.HerkunftId) ON (qryAuswLetzteAnzahlLetzteKontrolle.MaxvonTPopKontrJahr = tblTeilPopFeldkontrolle.TPopKontrJahr) AND (qryAuswLetzteAnzahlLetzteKontrolle.TPopId = tblTeilPopFeldkontrolle.TPopId)
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopFeldkontrolle.TPopKontrJahr DESC;

CREATE VIEW qryAuswLetzteAnzAnz3 AS 
SELECT qryAuswLetzteAnzLetzteKontrollen.ApArtId, qryAuswLetzteAnzLetzteKontrollen.Name, qryAuswLetzteAnzLetzteKontrollen.PopId, qryAuswLetzteAnzLetzteKontrollen.PopNr, qryAuswLetzteAnzLetzteKontrollen.TPopId, qryAuswLetzteAnzLetzteKontrollen.TPopNr, qryAuswLetzteAnzLetzteKontrollen.TPopKontrId, qryAuswLetzteAnzLetzteKontrollen.TPopKontrTyp, qryAuswLetzteAnzLetzteKontrollen.TPopKontrZaehleinheit3 AS Zaehleinheit, qryAuswLetzteAnzLetzteKontrollen.TPopKontrAnz3 AS Anzahl, qryAuswLetzteAnzLetzteKontrollen.TPopKontrJahr, qryAuswLetzteAnzLetzteKontrollen.TPopKontrTxt
FROM qryAuswLetzteAnzLetzteKontrollen
WHERE (((qryAuswLetzteAnzLetzteKontrollen.TPopKontrTyp) Is Not Null) AND ((qryAuswLetzteAnzLetzteKontrollen.TPopKontrZaehleinheit3) Is Not Null) AND ((qryAuswLetzteAnzLetzteKontrollen.TPopKontrAnz3) Is Not Null));

CREATE VIEW qryAuswLetzteAnzAnz2 AS 
SELECT qryAuswLetzteAnzLetzteKontrollen.ApArtId, qryAuswLetzteAnzLetzteKontrollen.Name, qryAuswLetzteAnzLetzteKontrollen.PopId, qryAuswLetzteAnzLetzteKontrollen.PopNr, qryAuswLetzteAnzLetzteKontrollen.TPopId, qryAuswLetzteAnzLetzteKontrollen.TPopNr, qryAuswLetzteAnzLetzteKontrollen.TPopKontrId, qryAuswLetzteAnzLetzteKontrollen.TPopKontrTyp, qryAuswLetzteAnzLetzteKontrollen.TPopKontrZaehleinheit2 AS Zaehleinheit, qryAuswLetzteAnzLetzteKontrollen.TPopKontrAnz2 AS Anzahl, qryAuswLetzteAnzLetzteKontrollen.TPopKontrJahr, qryAuswLetzteAnzLetzteKontrollen.TPopKontrTxt
FROM qryAuswLetzteAnzLetzteKontrollen
WHERE (((qryAuswLetzteAnzLetzteKontrollen.TPopKontrTyp) Is Not Null) AND ((qryAuswLetzteAnzLetzteKontrollen.TPopKontrZaehleinheit2) Is Not Null) AND ((qryAuswLetzteAnzLetzteKontrollen.TPopKontrAnz2) Is Not Null));

CREATE VIEW qryAuswLetzteAnzAnz1 AS 
SELECT qryAuswLetzteAnzLetzteKontrollen.ApArtId, qryAuswLetzteAnzLetzteKontrollen.Name, qryAuswLetzteAnzLetzteKontrollen.PopId, qryAuswLetzteAnzLetzteKontrollen.PopNr, qryAuswLetzteAnzLetzteKontrollen.TPopId, qryAuswLetzteAnzLetzteKontrollen.TPopNr, qryAuswLetzteAnzLetzteKontrollen.TPopKontrId, qryAuswLetzteAnzLetzteKontrollen.TPopKontrTyp, qryAuswLetzteAnzLetzteKontrollen.TPopKontrZaehleinheit1 AS Zaehleinheit, qryAuswLetzteAnzLetzteKontrollen.TPopKontrAnz1 AS Anzahl, qryAuswLetzteAnzLetzteKontrollen.TPopKontrJahr, qryAuswLetzteAnzLetzteKontrollen.TPopKontrTxt
FROM qryAuswLetzteAnzLetzteKontrollen
WHERE (((qryAuswLetzteAnzLetzteKontrollen.TPopKontrTyp) Is Not Null) AND ((qryAuswLetzteAnzLetzteKontrollen.TPopKontrZaehleinheit1) Is Not Null) AND ((qryAuswLetzteAnzLetzteKontrollen.TPopKontrAnz1) Is Not Null));

CREATE VIEW qryAuswLetzteAnzAnz AS
SELECT qryAuswLetzteAnzAnz1.ApArtId, qryAuswLetzteAnzAnz1.Name, qryAuswLetzteAnzAnz1.PopId, qryAuswLetzteAnzAnz1.PopNr, qryAuswLetzteAnzAnz1.TPopId, qryAuswLetzteAnzAnz1.TPopNr, qryAuswLetzteAnzAnz1.TPopKontrId, qryAuswLetzteAnzAnz1.TPopKontrTyp, qryAuswLetzteAnzAnz1.Zaehleinheit, qryAuswLetzteAnzAnz1.Anzahl, qryAuswLetzteAnzAnz1.TPopKontrjahr, qryAuswLetzteAnzAnz1.TPopKontrTxt
FROM qryAuswLetzteAnzAnz1
union all
SELECT qryAuswLetzteAnzAnz2.ApArtId, qryAuswLetzteAnzAnz2.Name, qryAuswLetzteAnzAnz2.PopId, qryAuswLetzteAnzAnz2.PopNr, qryAuswLetzteAnzAnz2.TPopId, qryAuswLetzteAnzAnz2.TPopNr, qryAuswLetzteAnzAnz2.TPopKontrId, qryAuswLetzteAnzAnz2.TPopKontrTyp, qryAuswLetzteAnzAnz2.Zaehleinheit, qryAuswLetzteAnzAnz2.Anzahl, qryAuswLetzteAnzAnz2.TPopKontrjahr, qryAuswLetzteAnzAnz2.TPopKontrTxt
FROM qryAuswLetzteAnzAnz2
UNION ALL SELECT qryAuswLetzteAnzAnz3.ApArtId, qryAuswLetzteAnzAnz3.Name, qryAuswLetzteAnzAnz3.PopId, qryAuswLetzteAnzAnz3.PopNr, qryAuswLetzteAnzAnz3.TPopId, qryAuswLetzteAnzAnz3.TPopNr, qryAuswLetzteAnzAnz3.TPopKontrId, qryAuswLetzteAnzAnz3.TPopKontrTyp, qryAuswLetzteAnzAnz3.Zaehleinheit, qryAuswLetzteAnzAnz3.Anzahl, qryAuswLetzteAnzAnz3.TPopKontrjahr, qryAuswLetzteAnzAnz3.TPopKontrTxt
FROM qryAuswLetzteAnzAnz3;

CREATE VIEW qryAuswKontrAnzAnz1 AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilPopFeldkontrolle.TPopKontrTyp, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit, tblTeilPopFeldkontrolle.TPopKontrAnz1 AS TPopKontrAnz, tblTeilPopFeldkontrolle.TPopKontrJahr, tblAdresse.AdrName AS TPopKontrBearb
FROM (DomainTPopKontrZaehleinheit INNER JOIN ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON DomainTPopKontrZaehleinheit.ZaehleinheitCode = tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp) Is Not Null) AND ((DomainTPopKontrZaehleinheit.ZaehleinheitTxt) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrAnz1) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrJahr) Is Not Null)) AND (((tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Ziel" And (tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Zwischenziel"));

CREATE VIEW qryAuswKontrAnzAnz2 AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilPopFeldkontrolle.TPopKontrTyp, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit, tblTeilPopFeldkontrolle.TPopKontrAnz2 AS TPopKontrAnz, tblTeilPopFeldkontrolle.TPopKontrJahr, tblAdresse.AdrName AS TPopKontrBearb
FROM (DomainTPopKontrZaehleinheit INNER JOIN ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON DomainTPopKontrZaehleinheit.ZaehleinheitCode = tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp) Is Not Null) AND ((DomainTPopKontrZaehleinheit.ZaehleinheitTxt) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrAnz2) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrJahr) Is Not Null)) AND (((tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Ziel" And (tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Zwischenziel"));

CREATE VIEW qryAuswKontrAnzAnz3 AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilPopFeldkontrolle.TPopKontrTyp, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit, tblTeilPopFeldkontrolle.TPopKontrAnz3 AS TPopKontrAnz, tblTeilPopFeldkontrolle.TPopKontrJahr, tblAdresse.AdrName AS TPopKontrBearb
FROM (DomainTPopKontrZaehleinheit INNER JOIN ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON DomainTPopKontrZaehleinheit.ZaehleinheitCode = tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp) Is Not Null) AND ((DomainTPopKontrZaehleinheit.ZaehleinheitTxt) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrAnz3) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrJahr) Is Not Null)) AND (((tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Ziel" And (tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Zwischenziel"));

CREATE VIEW qryAuswKontrAnzAnz AS
SELECT qryAuswKontrAnzAnz1.ApArtId, qryAuswKontrAnzAnz1.Name, qryAuswKontrAnzAnz1.PopId, qryAuswKontrAnzAnz1.PopNr, qryAuswKontrAnzAnz1.PopName, qryAuswKontrAnzAnz1.TPopId, qryAuswKontrAnzAnz1.TPopNr, qryAuswKontrAnzAnz1.TPopGemeinde, qryAuswKontrAnzAnz1.TPopFlurname, qryAuswKontrAnzAnz1.TPopKontrId, qryAuswKontrAnzAnz1.TPopKontrTyp, qryAuswKontrAnzAnz1.TPopKontrZaehleinheit, qryAuswKontrAnzAnz1.TPopKontrAnz, qryAuswKontrAnzAnz1.TPopKontrJahr, qryAuswKontrAnzAnz1.TPopKontrBearb
FROM qryAuswKontrAnzAnz1
union all SELECT qryAuswKontrAnzAnz2.ApArtId, qryAuswKontrAnzAnz2.Name, qryAuswKontrAnzAnz2.PopId, qryAuswKontrAnzAnz2.PopNr, qryAuswKontrAnzAnz2.PopName, qryAuswKontrAnzAnz2.TPopId, qryAuswKontrAnzAnz2.TPopNr, qryAuswKontrAnzAnz2.TPopGemeinde, qryAuswKontrAnzAnz2.TPopFlurname, qryAuswKontrAnzAnz2.TPopKontrId, qryAuswKontrAnzAnz2.TPopKontrTyp, qryAuswKontrAnzAnz2.TPopKontrZaehleinheit, qryAuswKontrAnzAnz2.TPopKontrAnz, qryAuswKontrAnzAnz2.TPopKontrJahr, qryAuswKontrAnzAnz2.TPopKontrBearb
FROM qryAuswKontrAnzAnz2
union all SELECT qryAuswKontrAnzAnz3.ApArtId, qryAuswKontrAnzAnz3.Name, qryAuswKontrAnzAnz3.PopId, qryAuswKontrAnzAnz3.PopNr, qryAuswKontrAnzAnz3.PopName, qryAuswKontrAnzAnz3.TPopId, qryAuswKontrAnzAnz3.TPopNr, qryAuswKontrAnzAnz3.TPopGemeinde, qryAuswKontrAnzAnz3.TPopFlurname, qryAuswKontrAnzAnz3.TPopKontrId, qryAuswKontrAnzAnz3.TPopKontrTyp, qryAuswKontrAnzAnz3.TPopKontrZaehleinheit, qryAuswKontrAnzAnz3.TPopKontrAnz, qryAuswKontrAnzAnz3.TPopKontrJahr, qryAuswKontrAnzAnz3.TPopKontrBearb
FROM qryAuswKontrAnzAnz3
order by Name, PopNr, TPopNr, TPopKontrJahr DESC;

CREATE VIEW qryAuswKontrAnzAnzAlleKontrollen AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, qryAuswKontrAnzAnz.TPopKontrId, qryAuswKontrAnzAnz.TPopKontrTyp, qryAuswKontrAnzAnz.TPopKontrZaehleinheit, qryAuswKontrAnzAnz.TPopKontrAnz, qryAuswKontrAnzAnz.TPopKontrJahr, qryAuswKontrAnzAnz.TPopKontrBearb
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN (qryAuswKontrAnzAnz RIGHT JOIN tblTeilpopulation ON qryAuswKontrAnzAnz.TPopId = tblTeilpopulation.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, qryAuswKontrAnzAnz.TPopKontrJahr DESC;

CREATE VIEW qryAuswLetzteAnz AS 
SELECT ArtenDb_tblFloraSisf.Name, tblAktionsplan.ApStatus, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS Zaehleinheit, Sum(qryAuswLetzteAnzAnz.Anzahl) AS Anzahl
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR=tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN ((DomainTPopKontrZaehleinheit INNER JOIN qryAuswLetzteAnzAnz ON DomainTPopKontrZaehleinheit.ZaehleinheitCode=qryAuswLetzteAnzAnz.Zaehleinheit) INNER JOIN tblTeilPopFeldkontrolle ON (qryAuswLetzteAnzAnz.TPopKontrId=tblTeilPopFeldkontrolle.TPopKontrId) AND (qryAuswLetzteAnzAnz.TPopKontrTyp=tblTeilPopFeldkontrolle.TPopKontrTyp) AND (qryAuswLetzteAnzAnz.TPopKontrjahr=tblTeilPopFeldkontrolle.TPopKontrJahr)) ON tblTeilpopulation.TPopId=tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId=tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId=tblPopulation.ApArtId
GROUP BY ArtenDb_tblFloraSisf.Name, tblAktionsplan.ApStatus, DomainTPopKontrZaehleinheit.ZaehleinheitTxt;

CREATE VIEW qryAuswLetzteAnzProPop AS 
SELECT ArtenDb_tblFloraSisf.Name, tblAktionsplan.ApStatus, tblPopulation.PopNr, tblPopulation.PopName, qryAuswLetzteAnzAnz.Zaehleinheit AS Zaehleinheit, Sum(qryAuswLetzteAnzAnz.Anzahl) AS Anzahl
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN (tblTeilpopulation INNER JOIN (qryAuswLetzteAnzAnz INNER JOIN tblTeilPopFeldkontrolle ON qryAuswLetzteAnzAnz.TPopKontrId = tblTeilPopFeldkontrolle.TPopKontrId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
GROUP BY ArtenDb_tblFloraSisf.Name, tblAktionsplan.ApStatus, tblPopulation.PopNr, tblPopulation.PopName, qryAuswLetzteAnzAnz.Zaehleinheit;

CREATE VIEW qryAuswLetzteAnzProTPop AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblAktionsplan.ApStatus, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopHerkunft, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, qryAuswLetzteAnzAnz.TPopKontrId, qryAuswLetzteAnzAnz.Zaehleinheit, qryAuswLetzteAnzAnz.Anzahl, qryAuswLetzteAnzAnz.TPopKontrjahr
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN (tblTeilpopulation INNER JOIN (qryAuswLetzteAnzAnz INNER JOIN tblTeilPopFeldkontrolle ON qryAuswLetzteAnzAnz.TPopKontrId = tblTeilPopFeldkontrolle.TPopKontrId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW qryBerKontrGleicheOrte AS 
SELECT tblAktionsplan.ApArtId, tblAktionsplan.ApStatus, tblAktionsplan.ApJahr, tblAktionsplan.ApUmsetzung, tblPopulation.PopNr, tblPopulation.PopName, tblPopulation.PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopBekanntSeit, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrDatum, DomainTPopFeldkontrTyp.DomainTxt AS TPopKontrTyp, tblAdresse.AdrName AS TPopKontrBearb, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, tblTeilPopFeldkontrolle.TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, tblTeilPopFeldkontrolle.TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, tblTeilPopFeldkontrolle.TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrUeberleb, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, DomainTPopEntwicklung.EntwicklungTxt AS TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr, tblTeilpopulation.TPopAuswahl
FROM (tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN (tblTeilpopulation INNER JOIN ((((((tblTeilPopFeldkontrolle LEFT JOIN DomainTPopFeldkontrTyp ON tblTeilPopFeldkontrolle.TPopKontrTyp = DomainTPopFeldkontrTyp.DomainTxt) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainTPopEntwicklung.EntwicklungCode) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopAuswahl)=true));

CREATE VIEW qryBerKontrNachId AS 
SELECT tblAktionsplan.ApArtId, tblAktionsplan.ApStatus, tblAktionsplan.ApJahr, tblAktionsplan.ApUmsetzung, tblPopulation.PopNr, tblPopulation.PopName, tblPopulation.PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopBekanntSeit, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrDatum, DomainTPopFeldkontrTyp.DomainTxt AS TPopKontrTyp, tblAdresse.AdrName AS TPopKontrBearb, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, tblTeilPopFeldkontrolle.TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, tblTeilPopFeldkontrolle.TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, tblTeilPopFeldkontrolle.TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrUeberleb, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, DomainTPopEntwicklung.EntwicklungTxt AS TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr
FROM (tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN ((tblTeilpopulation INNER JOIN tblTeiPopFuerAuswahl ON tblTeilpopulation.TPopId = tblTeiPopFuerAuswahl.TPopId) LEFT JOIN ((((((tblTeilPopFeldkontrolle LEFT JOIN DomainTPopFeldkontrTyp ON tblTeilPopFeldkontrolle.TPopKontrTyp = DomainTPopFeldkontrTyp.DomainTxt) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainTPopEntwicklung.EntwicklungCode) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId;

CREATE VIEW qryBerTPopGleicheOrte AS 
SELECT tblAktionsplan.ApArtId, tblAktionsplan.ApStatus, tblAktionsplan.ApJahr, tblAktionsplan.ApUmsetzung, tblPopulation.PopNr, tblPopulation.PopName, tblPopulation.PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopAuswahl
FROM (tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopAuswahl)=true));

CREATE VIEW qryBerTPopNachId AS 
SELECT tblAktionsplan.ApArtId, tblAktionsplan.ApStatus, tblAktionsplan.ApJahr, tblAktionsplan.ApUmsetzung, tblPopulation.PopNr, tblPopulation.PopName, tblPopulation.PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopBekanntSeit
FROM (tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN (tblTeilpopulation INNER JOIN tblTeiPopFuerAuswahl ON tblTeilpopulation.TPopId = tblTeiPopFuerAuswahl.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId;

CREATE VIEW qryDomainTPopGemeinde AS 
SELECT tblTeilpopulation.TPopGemeinde
FROM tblTeilpopulation
GROUP BY tblTeilpopulation.TPopGemeinde
ORDER BY tblTeilpopulation.TPopGemeinde;

CREATE VIEW qryDomainTPopNutzungszone AS 
SELECT tblTeilpopulation.TPopNutzungszone
FROM tblTeilpopulation
GROUP BY tblTeilpopulation.TPopNutzungszone;

CREATE VIEW qryErsteMassnahmeProArt AS 
SELECT tblAktionsplan.ApArtId, Min(tblTeilPopMassnahme.TPopMassnJahr) AS MinvonTPopMassnJahr
FROM ((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId
GROUP BY tblAktionsplan.ApArtId;

CREATE VIEW qryMassnahmen AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS Artname, DomainApBearbeitungsstand.DomainTxt AS ApStatus, tblAktionsplan.ApJahr, DomainApUmsetzung.DomainTxt AS ApUmsetzungsstand, tblPopulation.PopGuid, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopGuid, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopBeschr, tblTeilPopMassnahme.TPopMassnGuid, tblTeilPopMassnahme.TPopMassnJahr, tblTeilPopMassnahme.TPopMassnDatum, DomainTPopMassnTyp.MassnTypTxt AS Massnahme, tblTeilPopMassnahme.TPopMassnTxt, tblAdresse.AdrName AS TPopMassnBearb, tblTeilPopMassnahme.TPopMassnBemTxt, tblTeilPopMassnahme.TPopMassnPlan, tblTeilPopMassnahme.TPopMassnPlanBez, tblTeilPopMassnahme.TPopMassnFlaeche, tblTeilPopMassnahme.TPopMassnMarkierung, tblTeilPopMassnahme.TPopMassnAnsiedAnzTriebe, tblTeilPopMassnahme.TPopMassnAnsiedAnzPfl, tblTeilPopMassnahme.TPopMassnAnzPflanzstellen, tblTeilPopMassnahme.TPopMassnAnsiedWirtspfl, tblTeilPopMassnahme.TPopMassnAnsiedHerkunftPop, tblTeilPopMassnahme.TPopMassnAnsiedDatSamm, tblTeilPopMassnahme.TPopMassnAnsiedForm, tblTeilPopMassnahme.TPopMassnAnsiedPflanzanordnung, tblTeilPopMassnahme.MutWann, tblTeilPopMassnahme.MutWer
FROM ((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN (tblTeilPopMassnahme INNER JOIN DomainTPopMassnTyp ON tblTeilPopMassnahme.TPopMassnTyp = DomainTPopMassnTyp.MassnTypCode) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopMassnahme.TPopMassnBearb = tblAdresse.AdrId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopMassnahme.TPopMassnJahr, tblTeilPopMassnahme.TPopMassnDatum, DomainTPopMassnTyp.MassnTypTxt;

CREATE VIEW qryTeilpopulationen AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS Artname, DomainApBearbeitungsstand.DomainTxt AS ApStatus, tblAktionsplan.ApJahr, DomainApUmsetzung.DomainTxt AS ApUmsetzungsstand, tblPopulation.PopGuid, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopGuid, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopRadius, tblTeilpopulation.TPopHoehe, tblTeilpopulation.TPopExposition, tblTeilpopulation.TPopKlima, tblTeilpopulation.TPopNeigung, tblTeilpopulation.TPopBeschr, tblTeilpopulation.TPopKatNr, tblAdresse.AdrName AS TPopVerantw, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, tblTeilpopulation.TPopHerkunftUnklar, tblTeilpopulation.TPopHerkunftUnklarBegruendung, tblTeilpopulation.TPopApBerichtRelevant, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopEigen, tblTeilpopulation.TPopKontakt, tblTeilpopulation.TPopNutzungszone, tblTeilpopulation.TPopBewirtschafterIn, tblTeilpopulation.TPopBewirtschaftung, tblTeilpopulation.TPopPop, tblTeilpopulation.MutWann, tblTeilpopulation.MutWer
FROM ((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId) INNER JOIN tblAdresse ON tblTeilpopulation.TPopVerantw = tblAdresse.AdrId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;


CREATE VIEW qryKontrApArtPopulationOhneStatus AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, tblAktionsplan.ApStatus AS "Bearbeitungsstand AP", tblPopulation.PopNr, tblPopulation.PopName, tblPopulation.PopHerkunft AS Status
FROM ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId
WHERE (((tblAktionsplan.ApStatus)=3) AND ((tblPopulation.PopHerkunft) Is Null))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr;

CREATE VIEW qryKontrApArtPopulationOhneStatus AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, tblPopulation.PopName, tblPopulation.PopHerkunft AS Status
FROM (ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode
WHERE (((tblPopulation.PopHerkunft) Is Null) AND ((tblAktionsplan.ApStatus)=3))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr;

CREATE VIEW qryKontrApOhnePop AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS ApStatus, tblPopulation.PopNr
FROM (ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan LEFT JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode
WHERE (((tblPopulation.PopNr) Is Null))
ORDER BY ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt;

CREATE VIEW qryKontrBeobDistanzZurTPop AS
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS ApStatus, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, alexande_beob.tblBeob.NO_NOTE AS IdZdsf, alexande_beob.tblBeob.IdEvab, alexande_beob.tblBeob.xGIS AS Beob_X, alexande_beob.tblBeob.yGIS AS Beob_Y, SQRT((alexande_beob.tblBeob.xGIS-tblTeilpopulation.TPopXKoord)*(alexande_beob.tblBeob.xGIS-tblTeilpopulation.TPopXKoord)+(alexande_beob.tblBeob.yGIS-tblTeilpopulation.TPopYKoord)*(alexande_beob.tblBeob.yGIS-tblTeilpopulation.TPopYKoord)) AS Beob_DistZurTPop, alexande_beob.tblBeob.PROJET AS Beob_Projekt, alexande_beob.tblBeob.NOM_COMMUNE AS Beob_RaumGde, alexande_beob.tblBeob.DESC_LOCALITE AS Beob_Ort, CAST(IF(alexande_beob.tblBeob.M_NOTE>0, IF(alexande_beob.tblBeob.M_NOTE>9, CONCAT(alexande_beob.tblBeob.J_NOTE, ".", alexande_beob.tblBeob.M_NOTE, ".", alexande_beob.tblBeob.A_NOTE), CONCAT(alexande_beob.tblBeob.J_NOTE, ".0", alexande_beob.tblBeob.M_NOTE, ".", alexande_beob.tblBeob.A_NOTE)), alexande_beob.tblBeob.A_NOTE) AS CHAR) AS Beob_Datum, alexande_beob.tblBeob.Autor AS Beob_Autor
FROM (ArtenDb_tblFloraSisf INNER JOIN (((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN alexande_beob.tblBeob ON tblTeilpopulation.TPopId = alexande_beob.tblBeob.TPopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname;

CREATE VIEW qryBerJbZielBer AS 
SELECT tblZielBericht.*
FROM tblZielBericht INNER JOIN tblKonstanten ON tblZielBericht.ZielBerJahr = tblKonstanten.ApBerJahr;

CREATE VIEW qryBerJbZiel AS 
SELECT tblZiel.*, DomainZielTyp.ZieltypTxt
FROM (tblZiel INNER JOIN DomainZielTyp ON tblZiel.ZielTyp = DomainZielTyp.ZieltypId) INNER JOIN tblKonstanten ON tblZiel.ZielJahr = tblKonstanten.ApBerJahr
WHERE (((tblZiel.ZielTyp)=1 Or (tblZiel.ZielTyp)=2 Or (tblZiel.ZielTyp)=1170775556))
ORDER BY tblZiel.ZielTyp, tblZiel.ZielBezeichnung;

CREATE VIEW qryBerJbArtD AS 
SELECT tblAktionsplan.*, CAST(CONCAT(ArtenDb_tblFloraSisf.Name, If(ArtenDb_tblFloraSisf.Deutsch Is Not Null,CONCAT(" (", ArtenDb_tblFloraSisf.Deutsch, ")"),"")) AS CHAR) AS Art, tblApBericht.ApBerId, tblApBericht.ApBerJahr, tblApBericht.ApBerSituation, tblApBericht.ApBerVergleichVorjahrGesamtziel, tblApBericht.ApBerBeurteilung, tblApBericht.ApBerAnalyse, tblApBericht.ApBerUmsetzung, tblApBericht.ApBerErfko, tblApBericht.ApBerATxt, tblApBericht.ApBerBTxt, tblApBericht.ApBerCTxt, tblApBericht.ApBerDTxt, tblApBericht.ApBerDatum, tblApBericht.ApBerBearb, tblAdresse.AdrName AS Bearbeiter, DomainApBeurteilungsskala.BeurteilTxt
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR=tblAktionsplan.ApArtId) INNER JOIN (((tblApBericht LEFT JOIN tblAdresse ON tblApBericht.ApBerBearb=tblAdresse.AdrId) LEFT JOIN DomainApBeurteilungsskala ON tblApBericht.ApBerBeurteilung=DomainApBeurteilungsskala.BeurteilId) INNER JOIN tblKonstanten ON tblApBericht.ApBerJahr=tblKonstanten.ApBerJahr) ON tblAktionsplan.ApArtId=tblApBericht.ApArtId;

CREATE VIEW qryFnsJahrespflanzen AS 
SELECT distinct ArtenDb_tblFloraFnsJahresarten.SisfNr, If(ArtenDb_tblFloraFnsJahresarten.Jahr>0,"Ja","") AS Jahresart, ArtenDb_tblFloraFnsJahresarten.Jahr
FROM ArtenDb_tblFloraFnsJahresarten, tblKonstanten
WHERE ((ArtenDb_tblFloraFnsJahresarten.Jahr=tblKonstanten.ApBerJahr));

CREATE VIEW qryFnsKef AS 
SELECT ArtenDb_tblFloraFnsKef.SisfNr, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2
FROM ArtenDb_tblFloraFnsKef, tblKonstanten
ORDER BY ArtenDb_tblFloraFnsKef.SisfNr;

CREATE VIEW qryKontrPopMassnBerichteOhneMassnahmenTPopMassn0 AS 
SELECT tblTeilPopMassnahme.TPopId
FROM tblAktionsplan INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilPopMassnahme.TPopMassnJahr)>=tblAktionsplan.ApJahr))
GROUP BY tblTeilPopMassnahme.TPopId;

CREATE VIEW qryKontrPopMassnBerichteOhneMassahmen AS 
SELECT ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblPopMassnBericht.PopMassnBerJahr
FROM (tblAktionsplan INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) INNER JOIN ((tblPopulation INNER JOIN tblPopMassnBericht ON tblPopulation.PopId = tblPopMassnBericht.PopId) LEFT JOIN (tblTeilpopulation LEFT JOIN qryKontrPopMassnBerichteOhneMassnahmenTPopMassn0 ON tblTeilpopulation.TPopId = qryKontrPopMassnBerichteOhneMassnahmenTPopMassn0.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblPopMassnBericht.PopMassnBerJahr)>=tblAktionsplan.ApJahr) AND ((qryKontrPopMassnBerichteOhneMassnahmenTPopMassn0.TPopId) Is Null) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
GROUP BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblPopMassnBericht.PopMassnBerJahr
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopMassnBericht.PopMassnBerJahr DESC;

CREATE VIEW qryKontrTPopMassnBerichteOhneMassnahme AS 
SELECT ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilPopMassnBericht.TPopMassnBerJahr
FROM (tblAktionsplan INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) INNER JOIN ((tblPopulation INNER JOIN (tblTeilpopulation LEFT JOIN qryKontrPopMassnBerichteOhneMassnahmenTPopMassn0 ON tblTeilpopulation.TPopId = qryKontrPopMassnBerichteOhneMassnahmenTPopMassn0.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnBericht ON tblTeilpopulation.TPopId = tblTeilPopMassnBericht.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilPopMassnBericht.TPopMassnBerJahr)>=tblAktionsplan.ApJahr) AND ((qryKontrPopMassnBerichteOhneMassnahmenTPopMassn0.TPopId) Is Null) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
GROUP BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilPopMassnBericht.TPopMassnBerJahr
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopMassnBericht.TPopMassnBerJahr DESC;

CREATE VIEW qryAnzMassnProArtBisJahr0 AS 
SELECT tblAktionsplan.ApArtId, tblTeilPopMassnahme.TPopMassnId
FROM tblKonstanten, tblAktionsplan INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE ((tblTeilPopMassnahme.TPopMassnJahr<=tblKonstanten.ApBerJahr) AND (tblAktionsplan.ApStatus Between 1 And 3) AND (tblTeilpopulation.TPopApBerichtRelevant=1))
GROUP BY tblAktionsplan.ApArtId, tblTeilPopMassnahme.TPopMassnId;

CREATE VIEW qryAnzMassnProArtBisJahr AS 
SELECT qryAnzMassnProArtBisJahr0.ApArtId, Count(qryAnzMassnProArtBisJahr0.TPopMassnId) AS AnzahlMassnahmen
FROM qryAnzMassnProArtBisJahr0
GROUP BY qryAnzMassnProArtBisJahr0.ApArtId;

CREATE VIEW qryAnzMassnProArtBisJahr AS 
SELECT tblAktionsplan.ApArtId, Count(tblTeilPopMassnahme.TPopMassnId) AS AnzahlMassnahmen
FROM tblAktionsplan INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) LEFT JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblAktionsplan.ApArtId;

CREATE VIEW qryLetzterTPopMassnBericht0 AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId, tblTeilPopMassnBericht.TPopMassnBerJahr
FROM tblKonstanten, ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnBericht ON tblTeilpopulation.TPopId = tblTeilPopMassnBericht.TPopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId
WHERE (((tblTeilPopMassnBericht.TPopMassnBerJahr)<=tblKonstanten.ApBerJahr) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1) AND ((tblTeilPopMassnahme.TPopMassnJahr)<=tblKonstanten.ApBerJahr));

CREATE VIEW qryLetzterTPopMassnBericht AS
SELECT qryLetzterTPopMassnBericht0.ApArtId, qryLetzterTPopMassnBericht0.TPopId, Max(qryLetzterTPopMassnBericht0.TPopMassnBerJahr) AS MaxvonTPopMassnBerJahr
FROM qryLetzterTPopMassnBericht0
GROUP BY qryLetzterTPopMassnBericht0.ApArtId, qryLetzterTPopMassnBericht0.TPopId;

CREATE VIEW qryLetzterTPopBericht0 AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId, tblTeilPopBericht.TPopBerJahr
FROM tblKonstanten, tblAktionsplan INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN tblTeilPopBericht ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilPopBericht.TPopBerJahr)<=tblKonstanten.ApBerJahr And (tblTeilPopBericht.TPopBerJahr)>=tblAktionsplan.ApJahr) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1));

CREATE VIEW qryLetzterTPopBericht AS 
SELECT qryLetzterTPopBericht0.ApArtId, qryLetzterTPopBericht0.TPopId, Max(qryLetzterTPopBericht0.TPopBerJahr) AS MaxvonTPopBerJahr
FROM qryLetzterTPopBericht0
GROUP BY qryLetzterTPopBericht0.ApArtId, qryLetzterTPopBericht0.TPopId;

CREATE VIEW qryLetzterPopMassnBericht0 AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId, tblPopMassnBericht.PopMassnBerJahr
FROM tblKonstanten, ((tblPopulation INNER JOIN tblPopMassnBericht ON tblPopulation.PopId = tblPopMassnBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId
WHERE (((tblPopMassnBericht.PopMassnBerJahr)<=tblKonstanten.ApBerJahr) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1) AND ((tblTeilPopMassnahme.TPopMassnJahr)<=tblKonstanten.ApBerJahr));

CREATE VIEW qryLetzterPopMassnBericht AS 
SELECT qryLetzterPopMassnBericht0.ApArtId, qryLetzterPopMassnBericht0.PopId, Max(qryLetzterPopMassnBericht0.PopMassnBerJahr) AS MaxvonPopMassnBerJahr
FROM qryLetzterPopMassnBericht0
GROUP BY qryLetzterPopMassnBericht0.ApArtId, qryLetzterPopMassnBericht0.PopId;

CREATE VIEW qryLetzterPopBericht0 AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId, tblPopBericht.PopBerJahr
FROM tblKonstanten, (tblPopulation INNER JOIN tblPopBericht ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerJahr)<=tblKonstanten.ApBerJahr) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1));

CREATE VIEW qryLetzterPopBericht AS
SELECT qryLetzterPopBericht0.ApArtId, qryLetzterPopBericht0.PopId, Max(qryLetzterPopBericht0.PopBerJahr) AS MaxvonPopBerJahr
FROM qryLetzterPopBericht0
GROUP BY qryLetzterPopBericht0.ApArtId, qryLetzterPopBericht0.PopId;

CREATE VIEW qryJbUebE AS 
SELECT tblApBericht.*, CAST(If(ArtenDb_tblFloraSisf.Deutsch is null,ArtenDb_tblFloraSisf.Name, CONCAT(ArtenDb_tblFloraSisf.Name, ' (', ArtenDb_tblFloraSisf.Deutsch, ')')) AS CHAR) AS Artname, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, ArtenDb_tblFloraFnsKef.KefKontrolljahr, If(Round((tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, qryFnsJahrespflanzen.Jahr AS FnsJahrespflanze, qryFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2, qryAnzMassnProArtBisJahr.AnzahlMassnahmen
FROM (((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN qryApApBerichtRelevant ON tblAktionsplan.ApArtId = qryApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN ArtenDb_tblFloraFnsKef ON tblAktionsplan.ApArtId = ArtenDb_tblFloraFnsKef.SisfNr) LEFT JOIN qryFnsJahrespflanzen ON tblAktionsplan.ApArtId = qryFnsJahrespflanzen.SisfNr) INNER JOIN (tblKonstanten INNER JOIN (tblApBericht INNER JOIN qryAnzMassnProArtBisJahr ON tblApBericht.ApArtId = qryAnzMassnProArtBisJahr.ApArtId) ON tblKonstanten.ApBerJahr = tblApBericht.ApBerJahr) ON tblAktionsplan.ApArtId = tblApBericht.ApArtId
WHERE (((qryAnzMassnProArtBisJahr.AnzahlMassnahmen)>0) AND ((tblApBericht.ApBerBeurteilung)=1) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryJbUebKm AS 
SELECT If(ArtenDb_tblFloraSisf.Deutsch is null,ArtenDb_tblFloraSisf.Name, CONCAT(ArtenDb_tblFloraSisf.Name, ' (', ArtenDb_tblFloraSisf.Deutsch, ')')) AS Artname, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, ArtenDb_tblFloraFnsJahresarten.Jahr AS FnsJahrespflanze, qryFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM ((((ArtenDb_tblFloraSisf INNER JOIN ((qryAnzMassnProArtBisJahr AS qryAnzMassnProArtBisJahr_1 RIGHT JOIN tblAktionsplan ON qryAnzMassnProArtBisJahr_1.ApArtId = tblAktionsplan.ApArtId) INNER JOIN qryApApBerichtRelevant ON tblAktionsplan.ApArtId = qryApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN ArtenDb_tblFloraFnsJahresarten ON tblAktionsplan.ApArtId = ArtenDb_tblFloraFnsJahresarten.SisfNr) LEFT JOIN ArtenDb_tblFloraFnsKef ON tblAktionsplan.ApArtId = ArtenDb_tblFloraFnsKef.SisfNr) LEFT JOIN qryFnsJahrespflanzen ON tblAktionsplan.ApArtId = qryFnsJahrespflanzen.SisfNr) INNER JOIN (tblApBericht INNER JOIN tblKonstanten ON tblApBericht.ApBerJahr = tblKonstanten.ApBerJahr) ON tblAktionsplan.ApArtId = tblApBericht.ApArtId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3) AND ((qryAnzMassnProArtBisJahr_1.AnzahlMassnahmen)=0)) OR (((tblAktionsplan.ApStatus) Between 1 And 3) AND ((qryAnzMassnProArtBisJahr_1.AnzahlMassnahmen) Is Null))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryJbUebMe AS
SELECT tblApBericht.*, If(ArtenDb_tblFloraSisf.Deutsch is null,ArtenDb_tblFloraSisf.Name, CONCAT(ArtenDb_tblFloraSisf.Name, ' (', ArtenDb_tblFloraSisf.Deutsch, ')')) AS Artname, If("KefArt"=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.ApBerJahr-"KefKontrolljahr")/4,0)=(tblKonstanten.ApBerJahr-"KefKontrolljahr")/4,"Ja","") AS FnsKefKontrJahr2, qryFnsJahrespflanzen.Jahr AS FnsJahrespflanze, qryFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM (((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN qryApApBerichtRelevant ON tblAktionsplan.ApArtId = qryApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN qryFnsJahrespflanzen ON tblAktionsplan.ApArtId = qryFnsJahrespflanzen.SisfNr) INNER JOIN ((tblApBericht INNER JOIN qryAnzMassnProArtBisJahr ON tblApBericht.ApArtId = qryAnzMassnProArtBisJahr.ApArtId) INNER JOIN tblKonstanten ON tblApBericht.ApBerJahr = tblKonstanten.ApBerJahr) ON tblAktionsplan.ApArtId = tblApBericht.ApArtId) LEFT JOIN ArtenDb_tblFloraFnsKef ON ArtenDb_tblFloraSisf.NR = ArtenDb_tblFloraFnsKef.SisfNr
WHERE (((tblApBericht.ApBerBeurteilung)=5) AND ((qryAnzMassnProArtBisJahr.AnzahlMassnahmen)>0) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryJbUebNe AS
SELECT tblApBericht.*, If(ArtenDb_tblFloraSisf.Deutsch is null,ArtenDb_tblFloraSisf.Name, CONCAT(ArtenDb_tblFloraSisf.Name, ' (', ArtenDb_tblFloraSisf.Deutsch, ')')) AS Artname, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, qryFnsJahrespflanzen.Jahr AS FnsJahrespflanze, qryFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM ((((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN qryApApBerichtRelevant ON tblAktionsplan.ApArtId = qryApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN qryFnsJahrespflanzen ON tblAktionsplan.ApArtId = qryFnsJahrespflanzen.SisfNr) LEFT JOIN ArtenDb_tblFloraFnsJahresarten ON ArtenDb_tblFloraSisf.NR = ArtenDb_tblFloraFnsJahresarten.SisfNr) LEFT JOIN ArtenDb_tblFloraFnsKef ON ArtenDb_tblFloraSisf.NR = ArtenDb_tblFloraFnsKef.SisfNr) INNER JOIN (((tblApBericht INNER JOIN qryAnzMassnProArtBisJahr ON tblApBericht.ApArtId = qryAnzMassnProArtBisJahr.ApArtId) INNER JOIN tblKonstanten ON tblApBericht.ApBerJahr = tblKonstanten.ApBerJahr) INNER JOIN tblKonstanten AS tblKonstanten_1 ON tblApBericht.ApBerJahr = tblKonstanten_1.ApBerJahr) ON tblAktionsplan.ApArtId = tblApBericht.ApArtId
WHERE (((tblApBericht.ApBerBeurteilung)=3) AND ((tblAktionsplan.ApStatus) Between 1 And 3) AND ((qryAnzMassnProArtBisJahr.AnzahlMassnahmen)>0))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryJbUebSe AS 
SELECT tblApBericht.*, If(ArtenDb_tblFloraSisf.Deutsch is null,ArtenDb_tblFloraSisf.Name, CONCAT(ArtenDb_tblFloraSisf.Name, ' (', ArtenDb_tblFloraSisf.Deutsch, ')')) AS Artname, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, qryFnsJahrespflanzen.Jahr AS FnsJahrespflanze, qryFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM (((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN qryApApBerichtRelevant ON tblAktionsplan.ApArtId = qryApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN qryFnsJahrespflanzen ON tblAktionsplan.ApArtId = qryFnsJahrespflanzen.SisfNr) LEFT JOIN ArtenDb_tblFloraFnsKef ON ArtenDb_tblFloraSisf.NR = ArtenDb_tblFloraFnsKef.SisfNr) INNER JOIN ((tblApBericht INNER JOIN qryAnzMassnProArtBisJahr ON tblApBericht.ApArtId = qryAnzMassnProArtBisJahr.ApArtId) INNER JOIN tblKonstanten ON tblApBericht.ApBerJahr = tblKonstanten.ApBerJahr) ON tblAktionsplan.ApArtId = tblApBericht.ApArtId
WHERE (((tblApBericht.ApBerBeurteilung)=4) AND ((qryAnzMassnProArtBisJahr.AnzahlMassnahmen)>0) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryJbUebUn AS 
SELECT tblApBericht.*, If(ArtenDb_tblFloraSisf.Deutsch is null,ArtenDb_tblFloraSisf.Name, CONCAT(ArtenDb_tblFloraSisf.Name, ' (', ArtenDb_tblFloraSisf.Deutsch, ')')) AS Artname, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, qryFnsJahrespflanzen.Jahr AS FnsJahrespflanze, qryFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM (((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN qryApApBerichtRelevant ON tblAktionsplan.ApArtId = qryApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN qryFnsJahrespflanzen ON tblAktionsplan.ApArtId = qryFnsJahrespflanzen.SisfNr) LEFT JOIN ArtenDb_tblFloraFnsKef ON ArtenDb_tblFloraSisf.NR = ArtenDb_tblFloraFnsKef.SisfNr) INNER JOIN ((tblApBericht INNER JOIN qryAnzMassnProArtBisJahr ON tblApBericht.ApArtId = qryAnzMassnProArtBisJahr.ApArtId) INNER JOIN tblKonstanten ON tblApBericht.ApBerJahr = tblKonstanten.ApBerJahr) ON tblAktionsplan.ApArtId = tblApBericht.ApArtId
WHERE (((tblApBericht.ApBerBeurteilung)=1168274204) AND ((qryAnzMassnProArtBisJahr.AnzahlMassnahmen)>0) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryJbUebWe AS 
SELECT tblApBericht.*, If(ArtenDb_tblFloraSisf.Deutsch is null,ArtenDb_tblFloraSisf.Name, CONCAT(ArtenDb_tblFloraSisf.Name, ' (', ArtenDb_tblFloraSisf.Deutsch, ')')) AS Artname, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.ApBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, qryFnsJahrespflanzen.Jahr AS FnsJahrespflanze, qryFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM (((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN qryApApBerichtRelevant ON tblAktionsplan.ApArtId = qryApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN qryFnsJahrespflanzen ON tblAktionsplan.ApArtId = qryFnsJahrespflanzen.SisfNr) LEFT JOIN ArtenDb_tblFloraFnsKef ON ArtenDb_tblFloraSisf.NR = ArtenDb_tblFloraFnsKef.SisfNr) INNER JOIN ((tblApBericht INNER JOIN qryAnzMassnProArtBisJahr ON tblApBericht.ApArtId = qryAnzMassnProArtBisJahr.ApArtId) INNER JOIN tblKonstanten ON tblApBericht.ApBerJahr = tblKonstanten.ApBerJahr) ON tblAktionsplan.ApArtId = tblApBericht.ApArtId
WHERE (((tblApBericht.ApBerBeurteilung)=6) AND ((qryAnzMassnProArtBisJahr.AnzahlMassnahmen)>0) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryJbUebNichtBeurteilt000 AS 
SELECT tblAktionsplan.ApArtId
FROM ((tblAktionsplan INNER JOIN qryAnzMassnProArtBisJahr ON tblAktionsplan.ApArtId = qryAnzMassnProArtBisJahr.ApArtId) INNER JOIN qryApApBerichtRelevant ON tblAktionsplan.ApArtId = qryApApBerichtRelevant.ApArtId) LEFT JOIN tblApBericht ON tblAktionsplan.ApArtId = tblApBericht.ApArtId
WHERE (((tblApBericht.ApArtId) Is Null) AND ((tblAktionsplan.ApStatus) Between 1 And 3));

CREATE VIEW qryJbUebNichtBeurteilt00 AS 
SELECT tblAktionsplan.ApArtId
FROM ((tblAktionsplan INNER JOIN qryAnzMassnProArtBisJahr ON tblAktionsplan.ApArtId = qryAnzMassnProArtBisJahr.ApArtId) INNER JOIN qryApApBerichtRelevant ON tblAktionsplan.ApArtId = qryApApBerichtRelevant.ApArtId) INNER JOIN (tblApBericht INNER JOIN tblKonstanten ON tblApBericht.ApBerJahr = tblKonstanten.ApBerJahr) ON tblAktionsplan.ApArtId = tblApBericht.ApArtId
WHERE (((tblApBericht.ApBerJahr)=tblKonstanten.ApBerJahr) AND ((tblAktionsplan.ApStatus) Between 1 And 3) AND ((tblApBericht.ApBerBeurteilung) Is Null));

CREATE VIEW qryJbUebNichtBeurteilt0 AS 
select ApArtId from qryJbUebNichtBeurteilt000
UNION select ApArtId from qryJbUebNichtBeurteilt00;

CREATE VIEW qryJbUebNichtBeurteilt AS 
SELECT If(ArtenDb_tblFloraSisf.Deutsch is null,ArtenDb_tblFloraSisf.Name, CONCAT(ArtenDb_tblFloraSisf.Name, ' (', ArtenDb_tblFloraSisf.Deutsch, ')')) AS Artname, qryFnsKef.FnsKefArt2, qryFnsKef.FnsKefKontrJahr2, qryFnsJahrespflanzen.Jahr AS FnsJahrespflanze, qryFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN qryFnsJahrespflanzen ON tblAktionsplan.ApArtId = qryFnsJahrespflanzen.SisfNr) LEFT JOIN qryFnsKef ON tblAktionsplan.ApArtId = qryFnsKef.SisfNr) INNER JOIN qryJbUebNichtBeurteilt0 ON tblAktionsplan.ApArtId = qryJbUebNichtBeurteilt0.ApArtId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3));

CREATE VIEW qryJbUebMa AS 
SELECT If(ArtenDb_tblFloraSisf.Deutsch is null,ArtenDb_tblFloraSisf.Name, CONCAT(ArtenDb_tblFloraSisf.Name, ' (', ArtenDb_tblFloraSisf.Deutsch, ')')) AS Artname, qryAnzMassnProArtBisJahr.AnzahlMassnahmen
FROM (ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN qryApApBerichtRelevant ON tblAktionsplan.ApArtId = qryApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN qryAnzMassnProArtBisJahr ON tblAktionsplan.ApArtId = qryAnzMassnProArtBisJahr.ApArtId
WHERE (((qryAnzMassnProArtBisJahr.AnzahlMassnahmen)>0) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryKontrTPopPopFehlt AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBeurteilungsskala.BeurteilTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, tblPopulation.PopName
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN DomainApBeurteilungsskala ON tblAktionsplan.ApStatus = DomainApBeurteilungsskala.BeurteilId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3) AND ((tblPopulation.PopId) Not In (SELECT tblTeilpopulation.PopId FROM tblTeilpopulation WHERE (((tblTeilpopulation.TPopPop)=-1)) GROUP BY tblTeilpopulation.PopId )))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName;

CREATE VIEW qryKontrApArtTPopOhneStatus AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS "Status Population", tblTeilpopulation.TPopNr, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopHerkunft AS "Status Teilpopulation"
FROM (DomainApBearbeitungsstand INNER JOIN (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) ON DomainApBearbeitungsstand.DomainCode = tblAktionsplan.ApStatus) INNER JOIN ((tblPopulation INNER JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopHerkunft) Is Null) AND ((tblAktionsplan.ApStatus)=3))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr;

CREATE VIEW qryKontrTPopBekanntSeitLeer AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS ApStatus_, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopBekanntSeit
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopBekanntSeit) Is Null) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname;

CREATE VIEW qryKontrTPopKoorLeer AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS ApStatus_, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopXKoord) Is Null) AND ((tblAktionsplan.ApStatus) Between 1 And 3)) OR (((tblTeilpopulation.TPopYKoord) Is Null) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname;

CREATE VIEW qryTPopBerLetzterBericht AS 
SELECT tblTeilPopBericht.TPopId, Max(tblTeilPopBericht.TPopBerJahr) AS MaxvonTPopBerJahr
FROM tblTeilPopBericht
GROUP BY tblTeilPopBericht.TPopId;

CREATE VIEW qryKontrTPopStatusErloschen AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopHerkunft, tblTeilPopBericht.TPopBerEntwicklung, tblTeilPopBericht.TPopBerJahr
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN qryTPopBerLetzterBericht ON (tblTeilPopBericht.TPopId = qryTPopBerLetzterBericht.TPopId) AND (tblTeilPopBericht.TPopBerJahr = qryTPopBerLetzterBericht.MaxvonTPopBerJahr)) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3) AND ((tblTeilpopulation.TPopHerkunft)=4 Or (tblTeilpopulation.TPopHerkunft)=7) AND ((tblTeilPopBericht.TPopBerEntwicklung)<>8)) OR (((tblAktionsplan.ApStatus) Between 1 And 3) AND ((tblTeilpopulation.TPopHerkunft) Not Like 4 And (tblTeilpopulation.TPopHerkunft) Not Like 7) AND ((tblTeilPopBericht.TPopBerEntwicklung)=8))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname;

CREATE VIEW qryBerJb AS 
SELECT tblAktionsplan.*, If(ArtenDb_tblFloraSisf.Deutsch is null,ArtenDb_tblFloraSisf.Name, CONCAT(ArtenDb_tblFloraSisf.Name, ' (', ArtenDb_tblFloraSisf.Deutsch, ')')) AS Art, tblApBericht.ApBerId, tblApBericht.ApBerJahr, tblApBericht.ApBerSituation, tblApBericht.ApBerVergleichVorjahrGesamtziel, tblApBericht.ApBerBeurteilung, tblApBericht.ApBerAnalyse, tblApBericht.ApBerUmsetzung, tblApBericht.ApBerErfko, tblApBericht.ApBerATxt, tblApBericht.ApBerBTxt, tblApBericht.ApBerCTxt, tblApBericht.ApBerDTxt, tblApBericht.ApBerDatum, tblApBericht.ApBerBearb, tblAdresse.AdrName & ", " & tblAdresse.AdrAdresse AS Bearbeiter, tblApBerUebersicht.Jahr, tblApBerUebersicht.Bemerkungen, qryErsteMassnahmeProArt.MinvonTPopMassnJahr AS ErsteMassnahmeImJahr
FROM (ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan LEFT JOIN qryErsteMassnahmeProArt ON tblAktionsplan.ApArtId=qryErsteMassnahmeProArt.ApArtId) ON ArtenDb_tblFloraSisf.NR=tblAktionsplan.ApArtId) INNER JOIN (((tblApBericht LEFT JOIN tblAdresse ON tblApBericht.ApBerBearb=tblAdresse.AdrId) LEFT JOIN tblApBerUebersicht ON tblApBericht.ApBerJahr=tblApBerUebersicht.Jahr) INNER JOIN tblKonstanten ON tblApBericht.ApBerJahr=tblKonstanten.ApBerJahr) ON tblAktionsplan.ApArtId=tblApBericht.ApArtId
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryAuswAp AS 
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblAktionsplan.ApJahr AS "Start AP im Jahr", DomainApUmsetzung.DomainTxt AS "Stand Umsetzung AP", tblAdresse.AdrName AS "Verantwortlich", tblAktionsplan.MutWann AS "Letzte Änderung", tblAktionsplan.MutWer AS "Letzte(r) Bearbeiter(in)"
FROM (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN tblAdresse ON tblAktionsplan.ApBearb = tblAdresse.AdrId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryAuswProgramme AS 
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblAktionsplan.ApJahr AS "Start AP im Jahr", DomainApUmsetzung.DomainTxt AS "Stand Umsetzung AP", tblAdresse.AdrName AS "Verantwortlich", tblAktionsplan.MutWann AS "Letzte Änderung", tblAktionsplan.MutWer AS "Letzte(r) Bearbeiter(in)"
FROM (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN tblAdresse ON tblAktionsplan.ApBearb = tblAdresse.AdrId
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryAuswProgrammeOhnePop AS 
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblAktionsplan.ApJahr AS "Start AP im Jahr", DomainApUmsetzung.DomainTxt AS "Stand Umsetzung AP", tblAdresse.AdrName AS "Verantwortlich", tblPopulation.ApArtId AS "Population"
FROM ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN tblAdresse ON tblAktionsplan.ApBearb = tblAdresse.AdrId) LEFT JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblPopulation.ApArtId) Is Null))
ORDER BY ArtenDb_tblFloraSisf.Name;


CREATE VIEW qryAuswApArtenAnzKontrInJahr0 AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilPopFeldkontrolle.TPopKontrJahr
FROM (tblAktionsplan INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3))
GROUP BY tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilPopFeldkontrolle.TPopKontrJahr;

CREATE VIEW qryAuswApArtenAnzMassnInJahr0 AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblTeilPopMassnahme.TPopMassnId, tblTeilPopMassnahme.TPopMassnJahr
FROM (tblAktionsplan INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3))
GROUP BY tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblTeilPopMassnahme.TPopMassnId, tblTeilPopMassnahme.TPopMassnJahr;

CREATE VIEW qryAuswApArtenBearbMassnInJahr0 AS 
SELECT tblAdresse.AdrName, ArtenDb_tblFloraSisf.Name AS Art, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilPopMassnahme.TPopMassnJahr, DomainTPopMassnTyp.MassnTypTxt AS TPopMassnTyp, tblTeilPopMassnahme.TPopMassnTxt, tblTeilPopMassnahme.TPopMassnDatum, tblTeilPopMassnahme.TPopMassnBemTxt, tblTeilPopMassnahme.TPopMassnPlan, tblTeilPopMassnahme.TPopMassnPlanBez, tblTeilPopMassnahme.TPopMassnFlaeche, tblTeilPopMassnahme.TPopMassnMarkierung, tblTeilPopMassnahme.TPopMassnAnsiedAnzTriebe, tblTeilPopMassnahme.TPopMassnAnsiedAnzPfl, tblTeilPopMassnahme.TPopMassnAnzPflanzstellen, tblTeilPopMassnahme.TPopMassnAnsiedWirtspfl, tblTeilPopMassnahme.TPopMassnAnsiedHerkunftPop, tblTeilPopMassnahme.TPopMassnAnsiedDatSamm, tblTeilPopMassnahme.TPopMassnAnsiedForm, tblTeilPopMassnahme.TPopMassnAnsiedPflanzanordnung
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN ((tblTeilPopMassnahme LEFT JOIN tblAdresse ON tblTeilPopMassnahme.TPopMassnBearb = tblAdresse.AdrId) INNER JOIN DomainTPopMassnTyp ON tblTeilPopMassnahme.TPopMassnTyp = DomainTPopMassnTyp.MassnTypCode) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY tblAdresse.AdrName, ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname;

CREATE VIEW qryAuswApArtenMitMassnInJahr0 AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilPopMassnahme.TPopMassnJahr, DomainTPopMassnTyp.MassnTypTxt AS TPopMassnTyp, tblTeilPopMassnahme.TPopMassnTxt, tblTeilPopMassnahme.TPopMassnDatum, tblAdresse.AdrName AS TPopMassnBearb, tblTeilPopMassnahme.TPopMassnBemTxt, tblTeilPopMassnahme.TPopMassnPlan, tblTeilPopMassnahme.TPopMassnPlanBez, tblTeilPopMassnahme.TPopMassnFlaeche, tblTeilPopMassnahme.TPopMassnMarkierung, tblTeilPopMassnahme.TPopMassnAnsiedAnzTriebe, tblTeilPopMassnahme.TPopMassnAnsiedAnzPfl, tblTeilPopMassnahme.TPopMassnAnzPflanzstellen, tblTeilPopMassnahme.TPopMassnAnsiedWirtspfl, tblTeilPopMassnahme.TPopMassnAnsiedHerkunftPop, tblTeilPopMassnahme.TPopMassnAnsiedDatSamm, tblTeilPopMassnahme.TPopMassnAnsiedForm, tblTeilPopMassnahme.TPopMassnAnsiedPflanzanordnung
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN ((tblTeilPopMassnahme INNER JOIN DomainTPopMassnTyp ON tblTeilPopMassnahme.TPopMassnTyp = DomainTPopMassnTyp.MassnTypCode) LEFT JOIN tblAdresse ON tblTeilPopMassnahme.TPopMassnBearb = tblAdresse.AdrId) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname;

CREATE VIEW qryAuswArtPopTPopMassnBerFuerAktArt0 AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Aktionsplan-Status", tblAktionsplan.ApJahr AS "Aktionsplan-Jahr", DomainApUmsetzung.DomainTxt AS "Aktionsplan-Umsetzung", tblPopulation.PopNr AS "Population-Nr", tblPopulation.PopName AS "Population-Name", DomainPopHerkunft.HerkunftTxt AS "Population-Herkunft", tblPopulation.PopBekanntSeit AS "Population - bekannt seit", tblTeilpopulation.TPopNr AS "Teilpopulation-Nr", tblTeilpopulation.TPopGemeinde AS "Teilpopulation-Gemeinde", tblTeilpopulation.TPopFlurname AS "Teilpopulation-Flurname", tblTeilpopulation.TPopXKoord AS "Teilpopulation-X-Koodinate", tblTeilpopulation.TPopYKoord AS "Teilpopulation-Y-Koordinate", tblTeilpopulation.TPopRadius AS "Teilpopulation-Radius", tblTeilpopulation.TPopHoehe AS "Teilpopulation-Hoehe", tblTeilpopulation.TPopBeschr AS "Teilpopulation-Beschreibung", tblTeilpopulation.TPopKatNr AS "Teilpopulation-Kataster-Nr", tblAdresse.AdrName AS "Teilpopulation-Verantwortlich", DomainPopHerkunft_1.HerkunftTxt AS "Teilpopulation-Herkunft", tblTeilpopulation.TPopHerkunftUnklar AS "Teilpopulation - Herkunft unklar", tblTeilpopulation.TPopHerkunftUnklarBegruendung AS "Teilpopulation - Herkunft unklar Begründung", DomainTPopApBerichtRelevant.DomainTxt AS "Teilpopulation - Für Bericht relevant", tblTeilpopulation.TPopBekanntSeit AS "Teilpopulation - bekannt seit", tblTeilpopulation.TPopEigen AS "Teilpopulation-Eigentümer", tblTeilpopulation.TPopKontakt AS "Teilpopulation-Kontakt", tblTeilpopulation.TPopNutzungszone AS "Teilpopulation-Nutzungszone", tblTeilpopulation.TPopBewirtschafterIn AS "Teilpopulation-Bewirtschafter", tblTeilpopulation.TPopBewirtschaftung AS "Teilpopulation-Bewirtschaftung", tblTeilpopulation.TPopTxt AS "Teilpopulation-Bemerkungen", tblTeilPopMassnBericht.TPopMassnBerJahr AS "Massnahmenbericht-Jahr", DomainTPopMassnErfolgsbeurteilung.BeurteilTxt AS "Massnahmenbericht-Erfolgsberuteilung", tblTeilPopMassnBericht.TPopMassnBerTxt AS "Massnahmenbericht-Interpretation"
FROM (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) INNER JOIN (((tblPopulation LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN (((tblTeilpopulation LEFT JOIN tblAdresse ON tblTeilpopulation.TPopVerantw = tblAdresse.AdrId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId) LEFT JOIN DomainTPopApBerichtRelevant ON tblTeilpopulation.TPopApBerichtRelevant = DomainTPopApBerichtRelevant.DomainCode) ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN (tblTeilPopMassnBericht INNER JOIN DomainTPopMassnErfolgsbeurteilung ON tblTeilPopMassnBericht.TPopMassnBerErfolgsbeurteilung = DomainTPopMassnErfolgsbeurteilung.BeurteilId) ON tblTeilpopulation.TPopId = tblTeilPopMassnBericht.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopMassnBericht.TPopMassnBerJahr;

CREATE VIEW qryAuswArtPopTPopMassn0 AS 
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Aktionsplan Bearbeitungsstand", tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopFlurname, tblTeilPopMassnahme.TPopMassnId, tblTeilPopMassnahme.TPopMassnJahr AS Jahr, DomainTPopMassnTyp.MassnTypTxt AS Massnahme, tblTeilPopMassnahme.TPopMassnTxt, tblTeilPopMassnahme.TPopMassnDatum, tblAdresse.AdrName AS TPopMassnBearb, tblTeilPopMassnahme.TPopMassnBemTxt, tblTeilPopMassnahme.TPopMassnPlan, tblTeilPopMassnahme.TPopMassnPlanBez, tblTeilPopMassnahme.TPopMassnFlaeche, tblTeilPopMassnahme.TPopMassnMarkierung, tblTeilPopMassnahme.TPopMassnAnsiedAnzTriebe, tblTeilPopMassnahme.TPopMassnAnsiedAnzPfl, tblTeilPopMassnahme.TPopMassnAnzPflanzstellen, tblTeilPopMassnahme.TPopMassnAnsiedWirtspfl, tblTeilPopMassnahme.TPopMassnAnsiedHerkunftPop, tblTeilPopMassnahme.TPopMassnAnsiedDatSamm, tblTeilPopMassnahme.TPopMassnAnsiedForm, tblTeilPopMassnahme.TPopMassnAnsiedPflanzanordnung
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN ((tblTeilPopMassnahme LEFT JOIN DomainTPopMassnTyp ON tblTeilPopMassnahme.TPopMassnTyp = DomainTPopMassnTyp.MassnTypCode) LEFT JOIN tblAdresse ON tblTeilPopMassnahme.TPopMassnBearb = tblAdresse.AdrId) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopMassnahme.TPopMassnJahr, DomainTPopMassnTyp.MassnTypTxt;

CREATE VIEW qryAuswArtPopTPopMassnFuerAktArt0 AS 
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Aktionsplan-Status", tblAktionsplan.ApJahr AS "Aktionsplan-Jahr", DomainApUmsetzung.DomainTxt AS "Aktionsplan-Umsetzung", tblPopulation.PopId, tblPopulation.PopNr AS "Population-Nr", tblPopulation.PopName AS "Population-Name", DomainPopHerkunft.HerkunftTxt AS "Population-Herkunft", tblPopulation.PopBekanntSeit AS "Population - bekannt seit", tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr AS "Teilpopulation-Nr", tblTeilpopulation.TPopGemeinde AS "Teilpopulation-Gemeinde", tblTeilpopulation.TPopFlurname AS "Teilpopulation-Flurname", tblTeilpopulation.TPopXKoord AS "Teilpopulation-X-Koodinate", tblTeilpopulation.TPopYKoord AS "Teilpopulation-Y-Koordinate", tblTeilpopulation.TPopRadius AS "Teilpopulation-Radius", tblTeilpopulation.TPopHoehe AS "Teilpopulation-Höhe", tblTeilpopulation.TPopBeschr AS "Teilpopulation-Beschreibung", tblTeilpopulation.TPopKatNr AS "Teilpopulation-Kataster-Nr", tblAdresse_1.AdrName AS "Teilpopulation-Verantwortlich", DomainPopHerkunft_1.HerkunftTxt AS "Teilpopulation-Herkunft", tblTeilpopulation.TPopHerkunftUnklar AS "Teilpopulation - Herkunft unklar", tblTeilpopulation.TPopHerkunftUnklarBegruendung AS "Teilpopulation - Herkunft unklar Begründung", DomainTPopApBerichtRelevant.DomainTxt AS "Teilpopulation - Für Bericht relevant", tblTeilpopulation.TPopBekanntSeit AS "Teilpopulation - bekannt seit", tblTeilpopulation.TPopEigen AS "Teilpopulation-Eigentümer", tblTeilpopulation.TPopKontakt AS "Teilpopulation-Kontakt", tblTeilpopulation.TPopNutzungszone AS "Teilpopulation-Nutzungszone", tblTeilpopulation.TPopBewirtschafterIn AS "Teilpopulation-Bewirtschafter", tblTeilpopulation.TPopBewirtschaftung AS "Teilpopulation-Bewirtschaftung", tblTeilpopulation.TPopTxt AS "Teilpopulation-Bemerkungen", tblTeilPopMassnahme.TPopMassnId, DomainTPopMassnTyp.MassnTypTxt AS "Massnahme-Typ", tblTeilPopMassnahme.TPopMassnTxt AS "Massnahme-Beschreibung", tblTeilPopMassnahme.TPopMassnDatum AS "Massnahme-Datum", tblAdresse.AdrName AS "Massnahme-BearbeiterIn", tblTeilPopMassnahme.TPopMassnBemTxt AS "Massnahme-Bemerkungen", tblTeilPopMassnahme.TPopMassnPlan AS "Massnahme-Plan", tblTeilPopMassnahme.TPopMassnPlanBez AS "Massnahme-Planbezeichnung", tblTeilPopMassnahme.TPopMassnFlaeche AS "Massnahme-Fläche", tblTeilPopMassnahme.TPopMassnMarkierung AS "Massnahme-Markierung", tblTeilPopMassnahme.TPopMassnAnsiedAnzTriebe AS "Massnahme - Ansiedlung Anzahl Triebe", tblTeilPopMassnahme.TPopMassnAnsiedAnzPfl AS "Massnahme - Ansiedlung Anzahl Pflanzen", tblTeilPopMassnahme.TPopMassnAnzPflanzstellen AS "Massnahme - Ansiedlung Anzahl Pflanzstellen", tblTeilPopMassnahme.TPopMassnAnsiedWirtspfl AS "Massnahme - Ansiedlung Wirtspflanzen", tblTeilPopMassnahme.TPopMassnAnsiedHerkunftPop AS "Massnahme - Ansiedlung Herkunftspopulation", tblTeilPopMassnahme.TPopMassnAnsiedDatSamm AS "Massnahme - Ansiedlung Sammeldatum", tblTeilPopMassnahme.TPopMassnAnsiedForm AS "Massnahme - Ansiedlung Form", tblTeilPopMassnahme.TPopMassnAnsiedPflanzanordnung AS "Massnahme - Ansiedlung Pflanzordnung"
FROM (ArtenDb_tblFloraSisf INNER JOIN ((tblAktionsplan LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (((tblPopulation LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN (((tblTeilpopulation LEFT JOIN tblAdresse AS tblAdresse_1 ON tblTeilpopulation.TPopVerantw = tblAdresse_1.AdrId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId) LEFT JOIN DomainTPopApBerichtRelevant ON tblTeilpopulation.TPopApBerichtRelevant = DomainTPopApBerichtRelevant.DomainCode) ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN ((tblTeilPopMassnahme LEFT JOIN DomainTPopMassnTyp ON tblTeilPopMassnahme.TPopMassnTyp = DomainTPopMassnTyp.MassnTypCode) LEFT JOIN tblAdresse ON tblTeilPopMassnahme.TPopMassnBearb = tblAdresse.AdrId) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, DomainTPopMassnTyp.MassnTypTxt;

CREATE VIEW qryAuswFlurnameArtKontrolle AS
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilpopulation.TPopGemeinde AS Gemeinde, tblTeilpopulation.TPopFlurname AS "Flurname aus Teilpopulation", DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", ArtenDb_tblFloraSisf.Name AS Art, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopFeldkontrolle.TPopKontrJahr AS Jahr, tblTeilPopFeldkontrolle.TPopKontrTyp AS Kontrolltyp, tblTeilPopFeldkontrolle.TPopKontrDatum, tblAdresse.AdrName AS TPopKontrBearb, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, DomainTPopKontrMethode.BeurteilTxt AS TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, DomainTPopKontrMethode_1.BeurteilTxt AS TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, DomainTPopKontrMethode_2.BeurteilTxt AS TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrJungpfl, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, tblTeilPopFeldkontrolle.TPopKontrUeberleb, tblTeilPopFeldkontrolle.TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr, tblTeilPopFeldkontrolle.TPopKontrTxt, tblTeilPopFeldkontrolle.TPopKontrLeb, tblTeilPopFeldkontrolle.TPopKontrFlaeche, tblTeilPopFeldkontrolle.TPopKontrLebUmg, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht, tblTeilPopFeldkontrolle.TPopKontrBodenTyp, tblTeilPopFeldkontrolle.TPopKontrBodenAbtrag, tblTeilPopFeldkontrolle.TPopKontrWasserhaushalt, tblTeilPopFeldkontrolle.TPopKontrHandlungsbedarf, tblTeilPopFeldkontrolle.TPopKontrUebFlaeche, tblTeilPopFeldkontrolle.TPopKontrPlan, tblTeilPopFeldkontrolle.TPopKontrVeg, tblTeilPopFeldkontrolle.TPopKontrNaBo, tblTeilPopFeldkontrolle.TPopKontrUebPfl, tblTeilPopFeldkontrolle.TPopKontrJungPflJN, tblTeilPopFeldkontrolle.TPopKontrVegHoeMax, tblTeilPopFeldkontrolle.TPopKontrVegHoeMit, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung
FROM (((((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Ziel"))
ORDER BY tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrTyp;

CREATE VIEW qryAuswLetzteAnzProTPopAktArt0 AS
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, tblTeilPopFeldkontrolle.TPopKontrId, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopName, tblTeilpopulation.TPopNr, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, qryAuswLetzteAnzAnz.Zaehleinheit, qryAuswLetzteAnzAnz.Anzahl AS Anzahl, qryAuswLetzteAnzAnz.TPopKontrjahr, tblAdresse.AdrName AS BearbeiterIn
FROM DomainPopHerkunft AS DomainPopHerkunft_1 RIGHT JOIN (tblAdresse RIGHT JOIN (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ((tblPopulation LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN (tblTeilpopulation INNER JOIN (qryAuswLetzteAnzAnz INNER JOIN tblTeilPopFeldkontrolle ON qryAuswLetzteAnzAnz.TPopKontrId = tblTeilPopFeldkontrolle.TPopKontrId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) ON tblAdresse.AdrId = tblTeilPopFeldkontrolle.TPopKontrBearb) ON DomainPopHerkunft_1.HerkunftId = tblTeilpopulation.TPopHerkunft
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW qryAuswLetzteAnzProTPopAktArtAlleTPop AS
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, tblTeilPopFeldkontrolle.TPopKontrId, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopName, tblTeilpopulation.TPopNr, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, qryAuswLetzteAnzAnz.Zaehleinheit, qryAuswLetzteAnzAnz.Anzahl, qryAuswLetzteAnzAnz.TPopKontrjahr, qryAuswLetzteAnzAnz.TPopKontrTxt, tblAdresse.AdrName AS BearbeiterIn
FROM DomainPopHerkunft AS DomainPopHerkunft_1 RIGHT JOIN (tblAdresse RIGHT JOIN (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ((tblPopulation LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN (tblTeilpopulation LEFT JOIN (qryAuswLetzteAnzAnz INNER JOIN tblTeilPopFeldkontrolle ON qryAuswLetzteAnzAnz.TPopKontrId = tblTeilPopFeldkontrolle.TPopKontrId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) ON tblAdresse.AdrId = tblTeilPopFeldkontrolle.TPopKontrBearb) ON DomainPopHerkunft_1.HerkunftId = tblTeilpopulation.TPopHerkunft
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

bisher:
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, tblTeilPopFeldkontrolle.TPopKontrId, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopName, tblTeilpopulation.TPopNr, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, qryAuswLetzteAnzAnz.Zaehleinheit, qryAuswLetzteAnzAnz.Anzahl, qryAuswLetzteAnzAnz.TPopKontrjahr, tblAdresse.AdrName AS BearbeiterIn
FROM DomainPopHerkunft AS DomainPopHerkunft_1 RIGHT JOIN (tblAdresse RIGHT JOIN (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ((tblPopulation LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN (tblTeilpopulation INNER JOIN (qryAuswLetzteAnzAnz RIGHT JOIN tblTeilPopFeldkontrolle ON qryAuswLetzteAnzAnz.TPopKontrId = tblTeilPopFeldkontrolle.TPopKontrId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) ON tblAdresse.AdrId = tblTeilPopFeldkontrolle.TPopKontrBearb) ON DomainPopHerkunft_1.HerkunftId = tblTeilpopulation.TPopHerkunft
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;



CREATE VIEW qryJbA1rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblPopulation.PopHerkunft)=1 Or (tblPopulation.PopHerkunft)=4 Or (tblPopulation.PopHerkunft)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbA2rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblPopulation.PopHerkunft)=1 Or (tblPopulation.PopHerkunft)=4) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbA3rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblPopulation.PopHerkunft)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbA1rTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopHerkunft)=1 Or (tblTeilpopulation.TPopHerkunft)=4 Or (tblTeilpopulation.TPopHerkunft)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbA2rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopHerkunft)=1 Or (tblTeilpopulation.TPopHerkunft)=4) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbA3rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopHerkunft)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbB1rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblKonstanten, (tblPopulation INNER JOIN tblPopBericht ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1) AND ((tblPopBericht.PopBerJahr)<=tblKonstanten.ApBerJahr))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbB2rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM ((qryLetzterPopBericht INNER JOIN tblPopulation ON qryLetzterPopBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopBericht ON (tblPopulation.PopId = tblPopBericht.PopId) AND (qryLetzterPopBericht.PopId = tblPopBericht.PopId) AND (qryLetzterPopBericht.MaxvonPopBerJahr = tblPopBericht.PopBerJahr)) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=3) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbB3rPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM ((qryLetzterPopBericht INNER JOIN tblPopulation ON qryLetzterPopBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopBericht ON (tblPopulation.PopId = tblPopBericht.PopId) AND (qryLetzterPopBericht.PopId = tblPopBericht.PopId) AND (qryLetzterPopBericht.MaxvonPopBerJahr = tblPopBericht.PopBerJahr)) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=2) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbB4rPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM ((qryLetzterPopBericht INNER JOIN tblPopulation ON qryLetzterPopBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopBericht ON (tblPopulation.PopId = tblPopBericht.PopId) AND (qryLetzterPopBericht.PopId = tblPopBericht.PopId) AND (qryLetzterPopBericht.MaxvonPopBerJahr = tblPopBericht.PopBerJahr)) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=1) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbB5rPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM ((qryLetzterPopBericht INNER JOIN tblPopulation ON qryLetzterPopBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopBericht ON (tblPopulation.PopId = tblPopBericht.PopId) AND (qryLetzterPopBericht.PopId = tblPopBericht.PopId) AND (qryLetzterPopBericht.MaxvonPopBerJahr = tblPopBericht.PopBerJahr)) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=4 Or (tblPopBericht.PopBerEntwicklung)=9) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbB6rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM ((qryLetzterPopBericht INNER JOIN tblPopulation ON qryLetzterPopBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopBericht ON (tblPopulation.PopId = tblPopBericht.PopId) AND (qryLetzterPopBericht.PopId = tblPopBericht.PopId) AND (qryLetzterPopBericht.MaxvonPopBerJahr = tblPopBericht.PopBerJahr)) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbB1rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilPopBericht.TPopId
FROM tblKonstanten, tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN tblTeilPopBericht ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1) AND ((tblTeilPopBericht.TPopBerJahr)<=tblKonstanten.ApBerJahr))
GROUP BY tblPopulation.ApArtId, tblTeilPopBericht.TPopId;

CREATE VIEW qryJbB2rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN (tblPopulation INNER JOIN qryLetzterTPopBericht ON tblPopulation.ApArtId = qryLetzterTPopBericht.ApArtId) ON (tblTeilPopBericht.TPopId = qryLetzterTPopBericht.TPopId) AND (tblTeilPopBericht.TPopBerJahr = qryLetzterTPopBericht.MaxvonTPopBerJahr)) ON (tblTeilpopulation.PopId = tblPopulation.PopId) AND (tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId)
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=3) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbB3rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN (tblPopulation INNER JOIN qryLetzterTPopBericht ON tblPopulation.ApArtId = qryLetzterTPopBericht.ApArtId) ON (tblTeilPopBericht.TPopId = qryLetzterTPopBericht.TPopId) AND (tblTeilPopBericht.TPopBerJahr = qryLetzterTPopBericht.MaxvonTPopBerJahr)) ON (tblTeilpopulation.PopId = tblPopulation.PopId) AND (tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId)
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=2) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbB4rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN (tblPopulation INNER JOIN qryLetzterTPopBericht ON tblPopulation.ApArtId = qryLetzterTPopBericht.ApArtId) ON (tblTeilPopBericht.TPopId = qryLetzterTPopBericht.TPopId) AND (tblTeilPopBericht.TPopBerJahr = qryLetzterTPopBericht.MaxvonTPopBerJahr)) ON (tblTeilpopulation.PopId = tblPopulation.PopId) AND (tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId)
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=1) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbB5rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN (tblPopulation INNER JOIN qryLetzterTPopBericht ON tblPopulation.ApArtId = qryLetzterTPopBericht.ApArtId) ON (tblTeilPopBericht.TPopId = qryLetzterTPopBericht.TPopId) AND (tblTeilPopBericht.TPopBerJahr = qryLetzterTPopBericht.MaxvonTPopBerJahr)) ON (tblTeilpopulation.PopId = tblPopulation.PopId) AND (tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId)
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=4 Or (tblTeilPopBericht.TPopBerEntwicklung)=9) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbB6rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN (tblPopulation INNER JOIN qryLetzterTPopBericht ON tblPopulation.ApArtId = qryLetzterTPopBericht.ApArtId) ON (tblTeilPopBericht.TPopId = qryLetzterTPopBericht.TPopId) AND (tblTeilPopBericht.TPopBerJahr = qryLetzterTPopBericht.MaxvonTPopBerJahr)) ON (tblTeilpopulation.PopId = tblPopulation.PopId) AND (tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId)
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbC1rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblKonstanten, (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId
WHERE (((tblTeilPopMassnahme.TPopMassnJahr)<=tblKonstanten.ApBerJahr) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbC3rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (qryLetzterPopMassnBericht INNER JOIN tblPopulation ON qryLetzterPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopMassnBericht ON (tblPopulation.PopId = tblPopMassnBericht.PopId) AND (qryLetzterPopMassnBericht.MaxvonPopMassnBerJahr = tblPopMassnBericht.PopMassnBerJahr) AND (qryLetzterPopMassnBericht.PopId = tblPopMassnBericht.PopId)
WHERE (((tblPopMassnBericht.PopMassnBerErfolgsbeurteilung)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbC4rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (qryLetzterPopMassnBericht INNER JOIN tblPopulation ON qryLetzterPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopMassnBericht ON (tblPopulation.PopId = tblPopMassnBericht.PopId) AND (qryLetzterPopMassnBericht.MaxvonPopMassnBerJahr = tblPopMassnBericht.PopMassnBerJahr) AND (qryLetzterPopMassnBericht.PopId = tblPopMassnBericht.PopId)
WHERE (((tblPopMassnBericht.PopMassnBerErfolgsbeurteilung)=2))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbC5rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (qryLetzterPopMassnBericht INNER JOIN tblPopulation ON qryLetzterPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopMassnBericht ON (tblPopulation.PopId = tblPopMassnBericht.PopId) AND (qryLetzterPopMassnBericht.MaxvonPopMassnBerJahr = tblPopMassnBericht.PopMassnBerJahr) AND (qryLetzterPopMassnBericht.PopId = tblPopMassnBericht.PopId)
WHERE (((tblPopMassnBericht.PopMassnBerErfolgsbeurteilung)=3))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbC6rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (qryLetzterPopMassnBericht INNER JOIN tblPopulation ON qryLetzterPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopMassnBericht ON (tblPopulation.PopId = tblPopMassnBericht.PopId) AND (qryLetzterPopMassnBericht.PopId = tblPopMassnBericht.PopId) AND (qryLetzterPopMassnBericht.MaxvonPopMassnBerJahr = tblPopMassnBericht.PopMassnBerJahr)
WHERE (((tblPopMassnBericht.PopMassnBerErfolgsbeurteilung)=4))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbC7rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (qryLetzterPopMassnBericht INNER JOIN tblPopulation ON qryLetzterPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopMassnBericht ON (tblPopulation.PopId = tblPopMassnBericht.PopId) AND (qryLetzterPopMassnBericht.PopId = tblPopMassnBericht.PopId) AND (qryLetzterPopMassnBericht.MaxvonPopMassnBerJahr = tblPopMassnBericht.PopMassnBerJahr)
WHERE (((tblPopMassnBericht.PopMassnBerErfolgsbeurteilung)=5))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbC1rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblKonstanten, (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId
WHERE (((tblTeilPopMassnahme.TPopMassnJahr)<=tblKonstanten.ApBerJahr) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbC3rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM ((qryLetzterTPopMassnBericht INNER JOIN tblPopulation ON qryLetzterTPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilPopMassnBericht ON (qryLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = tblTeilPopMassnBericht.TPopMassnBerJahr) AND (qryLetzterTPopMassnBericht.TPopId = tblTeilPopMassnBericht.TPopId)) INNER JOIN tblTeilpopulation ON (tblTeilPopMassnBericht.TPopId = tblTeilpopulation.TPopId) AND (tblPopulation.PopId = tblTeilpopulation.PopId)
WHERE (((tblTeilPopMassnBericht.TPopMassnBerErfolgsbeurteilung)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbC4rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM ((qryLetzterTPopMassnBericht INNER JOIN tblPopulation ON qryLetzterTPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilPopMassnBericht ON (qryLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = tblTeilPopMassnBericht.TPopMassnBerJahr) AND (qryLetzterTPopMassnBericht.TPopId = tblTeilPopMassnBericht.TPopId)) INNER JOIN tblTeilpopulation ON (tblTeilPopMassnBericht.TPopId = tblTeilpopulation.TPopId) AND (tblPopulation.PopId = tblTeilpopulation.PopId)
WHERE (((tblTeilPopMassnBericht.TPopMassnBerErfolgsbeurteilung)=2))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbC5rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM ((qryLetzterTPopMassnBericht INNER JOIN tblPopulation ON qryLetzterTPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilPopMassnBericht ON (qryLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = tblTeilPopMassnBericht.TPopMassnBerJahr) AND (qryLetzterTPopMassnBericht.TPopId = tblTeilPopMassnBericht.TPopId)) INNER JOIN tblTeilpopulation ON (tblTeilPopMassnBericht.TPopId = tblTeilpopulation.TPopId) AND (tblPopulation.PopId = tblTeilpopulation.PopId)
WHERE (((tblTeilPopMassnBericht.TPopMassnBerErfolgsbeurteilung)=3))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbC6rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM ((qryLetzterTPopMassnBericht INNER JOIN tblPopulation ON qryLetzterTPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilPopMassnBericht ON (qryLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = tblTeilPopMassnBericht.TPopMassnBerJahr) AND (qryLetzterTPopMassnBericht.TPopId = tblTeilPopMassnBericht.TPopId)) INNER JOIN tblTeilpopulation ON (tblTeilPopMassnBericht.TPopId = tblTeilpopulation.TPopId) AND (tblPopulation.PopId = tblTeilpopulation.PopId)
WHERE (((tblTeilPopMassnBericht.TPopMassnBerErfolgsbeurteilung)=4))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbC7rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM ((qryLetzterTPopMassnBericht INNER JOIN tblPopulation ON qryLetzterTPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilPopMassnBericht ON (qryLetzterTPopMassnBericht.TPopId = tblTeilPopMassnBericht.TPopId) AND (qryLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = tblTeilPopMassnBericht.TPopMassnBerJahr)) INNER JOIN tblTeilpopulation ON (tblTeilPopMassnBericht.TPopId = tblTeilpopulation.TPopId) AND (tblPopulation.PopId = tblTeilpopulation.PopId)
WHERE (((tblTeilPopMassnBericht.TPopMassnBerErfolgsbeurteilung)=5))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbA1lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbA2lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=1) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbA3lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbA4lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=2) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbA5lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=1198167213) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbA6lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=6) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbA7lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=9) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbA8lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=4 Or (tblPopulation.PopHerkunft)=1200498803) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbA9lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=7) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbA1lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbA2lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=1) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbA3lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbA4lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=2) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbA5lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=1198167213) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbA6lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=6) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbA7lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=9) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbA8lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=4 Or (tblTeilpopulation.TPopHerkunft)=1200498803) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbA9lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=7) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbB1lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN (tblPopBericht INNER JOIN tblKonstanten ON tblPopBericht.PopBerJahr = tblKonstanten.ApBerJahr) ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbB2lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN (tblPopBericht INNER JOIN tblKonstanten ON tblPopBericht.PopBerJahr = tblKonstanten.ApBerJahr) ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=3) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbB3lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN (tblPopBericht INNER JOIN tblKonstanten ON tblPopBericht.PopBerJahr = tblKonstanten.ApBerJahr) ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=2) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbB4lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN (tblPopBericht INNER JOIN tblKonstanten ON tblPopBericht.PopBerJahr = tblKonstanten.ApBerJahr) ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=1) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbB5lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN (tblPopBericht INNER JOIN tblKonstanten ON tblPopBericht.PopBerJahr = tblKonstanten.ApBerJahr) ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=4 Or (tblPopBericht.PopBerEntwicklung)=9) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbB6lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN (tblPopBericht INNER JOIN tblKonstanten ON tblPopBericht.PopBerJahr = tblKonstanten.ApBerJahr) ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbB7lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbB1lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN tblKonstanten ON tblTeilPopBericht.TPopBerJahr = tblKonstanten.ApBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbB2lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN tblKonstanten ON tblTeilPopBericht.TPopBerJahr = tblKonstanten.ApBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=3) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbB3lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN tblKonstanten ON tblTeilPopBericht.TPopBerJahr = tblKonstanten.ApBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=2) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbB4lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN tblKonstanten ON tblTeilPopBericht.TPopBerJahr = tblKonstanten.ApBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=1) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbB5lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN tblKonstanten ON tblTeilPopBericht.TPopBerJahr = tblKonstanten.ApBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=4 Or (tblTeilPopBericht.TPopBerEntwicklung)=9) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbB6lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN tblKonstanten ON tblTeilPopBericht.TPopBerJahr = tblKonstanten.ApBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbB7lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryJbC1lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN (tblTeilPopMassnahme INNER JOIN tblKonstanten ON tblTeilPopMassnahme.TPopMassnJahr = tblKonstanten.ApBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW qryJbC1lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) INNER JOIN tblKonstanten ON tblTeilPopMassnahme.TPopMassnJahr = tblKonstanten.ApBerJahr
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW qryAuswAnzProTPopAngezArtBestJahr0 AS 
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, tblTeilPopFeldkontrolle.TPopKontrId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, tblTeilPopFeldkontrolle.TPopKontrTyp, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrDatum, tblAdresse.AdrName AS TPopKontrBearb, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, DomainTPopKontrMethode.BeurteilTxt AS TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, DomainTPopKontrMethode_1.BeurteilTxt AS TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, DomainTPopKontrMethode_2.BeurteilTxt AS TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrJungpfl, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, tblTeilPopFeldkontrolle.TPopKontrUeberleb, DomainTPopEntwicklung.EntwicklungTxt AS TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr, tblTeilPopFeldkontrolle.TPopKontrTxt, tblTeilPopFeldkontrolle.TPopKontrLeb, tblTeilPopFeldkontrolle.TPopKontrFlaeche, tblTeilPopFeldkontrolle.TPopKontrLebUmg, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht, tblTeilPopFeldkontrolle.TPopKontrBodenTyp, tblTeilPopFeldkontrolle.TPopKontrBodenAbtrag, tblTeilPopFeldkontrolle.TPopKontrWasserhaushalt, tblTeilPopFeldkontrolle.TPopKontrHandlungsbedarf, tblTeilPopFeldkontrolle.TPopKontrUebFlaeche, tblTeilPopFeldkontrolle.TPopKontrPlan, tblTeilPopFeldkontrolle.TPopKontrVeg, tblTeilPopFeldkontrolle.TPopKontrNaBo, tblTeilPopFeldkontrolle.TPopKontrUebPfl, tblTeilPopFeldkontrolle.TPopKontrJungPflJN, tblTeilPopFeldkontrolle.TPopKontrVegHoeMax, tblTeilPopFeldkontrolle.TPopKontrVegHoeMit, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung, tblTeilPopFeldkontrolle.TPopKontrMutDat
FROM ((((((((((ArtenDb_tblFloraSisf INNER JOIN (((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainTPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainTPopEntwicklung.EntwicklungCode;

CREATE VIEW qryAuswPopBerAngezArtBestJahr0 AS
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblPopBericht.PopBerId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopBericht.PopBerJahr, DomainPopEntwicklung.EntwicklungTxt AS PopBerEntwicklung, tblPopBericht.PopBerTxt
FROM ((ArtenDb_tblFloraSisf INNER JOIN ((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopBericht ON tblPopulation.PopId = tblPopBericht.PopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopEntwicklung ON tblPopBericht.PopBerEntwicklung = DomainPopEntwicklung.EntwicklungId;

CREATE VIEW qryAuswZieleApArtenBestJahr0 AS 
SELECT tblAktionsplan.ApArtId, tblZiel.ZielId, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS ApStatus, DomainApUmsetzung.DomainTxt AS ApUmsetzung, DomainZielTyp.ZieltypTxt AS ZielTyp, tblZiel.ZielJahr, tblZiel.ZielBezeichnung
FROM (((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN tblZiel ON tblAktionsplan.ApArtId = tblZiel.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainZielTyp ON tblZiel.ZielTyp = DomainZielTyp.ZieltypId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name, tblZiel.ZielJahr, tblZiel.ZielBezeichnung;

CREATE VIEW qryBerTPopFuerAngezeigteArt0 AS
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS ApStatus, tblAktionsplan.ApJahr, DomainApUmsetzung.DomainTxt AS ApUmsetzung, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopBekanntSeit, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, tblTeilpopulation.TPopApBerichtRelevant
FROM ((((ArtenDb_tblFloraSisf INNER JOIN ((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId;

CREATE VIEW qryAuswTPopInUmgebung00 AS 
SELECT ArtenDb_tblFloraSisf.Name, tblAktionsplan.ApArtId, tblAktionsplan.ApStatus, tblPopulation.PopNr, tblPopulation.PopHerkunft, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopHerkunft, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblKonstanten.XKoord, tblKonstanten.YKoord, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, SQRT((XKoord-TPopXKoord)*(XKoord-TPopXKoord)+(YKoord-TPopYKoord)*(YKoord-TPopYKoord)) AS "DistanzZurXYKoord"
FROM tblKonstanten, ArtenDb_tblFloraSisf INNER JOIN ((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId
WHERE (((tblTeilpopulation.TPopXKoord) Is Not Null) AND ((tblTeilpopulation.TPopYKoord) Is Not Null) AND ((SQRT((XKoord-TPopXKoord)*(XKoord-TPopXKoord)+(YKoord-TPopYKoord)*(YKoord-TPopYKoord)))<=tblKonstanten.Distanz))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW qryAuswTPopInUmgebung0 AS
SELECT qryAuswTPopInUmgebung00.Name, qryAuswTPopInUmgebung00.ApArtId, DomainApBearbeitungsstand.DomainTxt AS ApStatus, qryAuswTPopInUmgebung00.PopNr, qryAuswTPopInUmgebung00.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, qryAuswTPopInUmgebung00.TPopNr, qryAuswTPopInUmgebung00.TPopGemeinde, qryAuswTPopInUmgebung00.TPopFlurname, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, qryAuswTPopInUmgebung00.XKoord, qryAuswTPopInUmgebung00.YKoord, qryAuswTPopInUmgebung00.TPopXKoord, qryAuswTPopInUmgebung00.TPopYKoord, qryAuswTPopInUmgebung00.DistanzZurXYKoord
FROM ((qryAuswTPopInUmgebung00 LEFT JOIN DomainApBearbeitungsstand ON qryAuswTPopInUmgebung00.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainPopHerkunft ON qryAuswTPopInUmgebung00.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON qryAuswTPopInUmgebung00.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
ORDER BY qryAuswTPopInUmgebung00.Name, qryAuswTPopInUmgebung00.PopNr, qryAuswTPopInUmgebung00.TPopNr;

CREATE VIEW qryAuswKontrolleProBearbeiterBestJahr0 AS 
SELECT tblAdresse.AdrName AS BearbeiterIn, tblTeilpopulation.TPopGemeinde AS Gemeinde, tblTeilpopulation.TPopFlurname AS "Flurname aus Teilpopulation", DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", ArtenDb_tblFloraSisf.Name AS Art, tblTeilpopulation.TPopNr, tblTeilPopFeldkontrolle.TPopKontrJahr AS Jahr, tblTeilPopFeldkontrolle.TPopKontrTyp AS Kontrolltyp, tblTeilPopFeldkontrolle.TPopKontrDatum, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, DomainTPopKontrMethode.BeurteilTxt AS TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, DomainTPopKontrMethode_1.BeurteilTxt AS TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, DomainTPopKontrMethode_2.BeurteilTxt AS TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrJungpfl, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, tblTeilPopFeldkontrolle.TPopKontrUeberleb, DomainTPopEntwicklung.EntwicklungTxt AS TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr, tblTeilPopFeldkontrolle.TPopKontrTxt, tblTeilPopFeldkontrolle.TPopKontrLeb, tblTeilPopFeldkontrolle.TPopKontrFlaeche, tblTeilPopFeldkontrolle.TPopKontrLebUmg, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht, tblTeilPopFeldkontrolle.TPopKontrBodenTyp, tblTeilPopFeldkontrolle.TPopKontrBodenAbtrag, tblTeilPopFeldkontrolle.TPopKontrWasserhaushalt, tblTeilPopFeldkontrolle.TPopKontrHandlungsbedarf, tblTeilPopFeldkontrolle.TPopKontrUebFlaeche, tblTeilPopFeldkontrolle.TPopKontrPlan, tblTeilPopFeldkontrolle.TPopKontrVeg, tblTeilPopFeldkontrolle.TPopKontrNaBo, tblTeilPopFeldkontrolle.TPopKontrUebPfl, tblTeilPopFeldkontrolle.TPopKontrJungPflJN, tblTeilPopFeldkontrolle.TPopKontrVegHoeMax, tblTeilPopFeldkontrolle.TPopKontrVegHoeMit, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung
FROM (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (((((((tblTeilPopFeldkontrolle LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainTPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainTPopEntwicklung.EntwicklungCode
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Ziel"))
ORDER BY tblAdresse.AdrName, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, ArtenDb_tblFloraSisf.Name, tblTeilpopulation.TPopNr, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrTyp;

CREATE VIEW qryAuswFreiwKontrAnzBestJahr01 AS 
SELECT ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS BearbeitungsstandAp, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrTyp, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS Zaehleinheit, tblTeilPopFeldkontrolle.TPopKontrAnz1 AS Anzahl
FROM (DomainApBearbeitungsstand INNER JOIN (ArtenDb_tblFloraSisf INNER JOIN (((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) ON DomainApBearbeitungsstand.DomainCode = tblAktionsplan.ApStatus) INNER JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode
WHERE (tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle");

CREATE VIEW qryAuswFreiwKontrAnzBestJahr02 AS
SELECT ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS BearbeitungsstandAp, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrTyp, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS Zaehleinheit, tblTeilPopFeldkontrolle.TPopKontrAnz2 AS Anzahl
FROM (DomainApBearbeitungsstand INNER JOIN (ArtenDb_tblFloraSisf INNER JOIN (((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) ON DomainApBearbeitungsstand.DomainCode = tblAktionsplan.ApStatus) INNER JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit.ZaehleinheitCode
WHERE (tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle");

CREATE VIEW qryAuswFreiwKontrAnzBestJahr03 AS 
SELECT ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS BearbeitungsstandAp, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrTyp, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS Zaehleinheit, tblTeilPopFeldkontrolle.TPopKontrAnz3 AS Anzahl
FROM (DomainApBearbeitungsstand INNER JOIN (ArtenDb_tblFloraSisf INNER JOIN (((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) ON DomainApBearbeitungsstand.DomainCode = tblAktionsplan.ApStatus) INNER JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit.ZaehleinheitCode
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp)="Freiwilligen-Erfolgskontrolle"));

CREATE VIEW qryAuswFreiwKontrAnzBestJahr00 AS
SELECT qryAuswFreiwKontrAnzBestJahr01.Name, qryAuswFreiwKontrAnzBestJahr01.BearbeitungsstandAp, qryAuswFreiwKontrAnzBestJahr01.TPopKontrJahr, qryAuswFreiwKontrAnzBestJahr01.TPopKontrTyp, qryAuswFreiwKontrAnzBestJahr01.Zaehleinheit, qryAuswFreiwKontrAnzBestJahr01.Anzahl FROM qryAuswFreiwKontrAnzBestJahr01
UNION SELECT qryAuswFreiwKontrAnzBestJahr02.Name, qryAuswFreiwKontrAnzBestJahr02.BearbeitungsstandAp, qryAuswFreiwKontrAnzBestJahr02.TPopKontrJahr, qryAuswFreiwKontrAnzBestJahr02.TPopKontrTyp, qryAuswFreiwKontrAnzBestJahr02.Zaehleinheit, qryAuswFreiwKontrAnzBestJahr02.Anzahl FROM qryAuswFreiwKontrAnzBestJahr02
UNION SELECT qryAuswFreiwKontrAnzBestJahr03.Name, qryAuswFreiwKontrAnzBestJahr03.BearbeitungsstandAp, qryAuswFreiwKontrAnzBestJahr03.TPopKontrJahr, qryAuswFreiwKontrAnzBestJahr03.TPopKontrTyp, qryAuswFreiwKontrAnzBestJahr03.Zaehleinheit, qryAuswFreiwKontrAnzBestJahr03.Anzahl FROM qryAuswFreiwKontrAnzBestJahr03;

CREATE VIEW qryAuswFreiwKontrAnzBestJahrBearb0 AS
select `tblAdresse`.`AdrName` AS `AdrName`,`ArtenDb_tblFloraSisf`.`Name` AS `Art`,`qryAuswLetzteAnzAnz`.`TPopKontrjahr` AS `TPopKontrjahr`,`qryAuswLetzteAnzAnz`.`TPopKontrTyp` AS `TPopKontrTyp`,`qryAuswLetzteAnzAnz`.`Zaehleinheit` AS `Zaehleinheit`,`qryAuswLetzteAnzAnz`.`Anzahl` AS `Anzahl` from ((`ArtenDb_tblFloraSisf` join `tblAktionsplan` on((`ArtenDb_tblFloraSisf`.`NR` = `tblAktionsplan`.`ApArtId`))) join (`tblPopulation` join (`tblTeilpopulation` join ((`qryAuswLetzteAnzAnz` join `tblTeilPopFeldkontrolle` on((`qryAuswLetzteAnzAnz`.`TPopKontrId` = `tblTeilPopFeldkontrolle`.`TPopKontrId`))) left join `tblAdresse` on((`tblAdresse`.`AdrId` = `tblTeilPopFeldkontrolle`.`TPopKontrBearb`))) on((`tblTeilpopulation`.`TPopId` = `tblTeilPopFeldkontrolle`.`TPopId`))) on((`tblPopulation`.`PopId` = `tblTeilpopulation`.`PopId`))) on((`tblAktionsplan`.`ApArtId` = `tblPopulation`.`ApArtId`))) group by `tblAdresse`.`AdrName`,`ArtenDb_tblFloraSisf`.`Name`,`qryAuswLetzteAnzAnz`.`TPopKontrjahr`,`qryAuswLetzteAnzAnz`.`TPopKontrTyp`,`qryAuswLetzteAnzAnz`.`Zaehleinheit`,`qryAuswLetzteAnzAnz`.`Anzahl` having (`qryAuswLetzteAnzAnz`.`TPopKontrTyp` = 'Freiwilligen-Erfolgskontrolle') order by `tblAdresse`.`AdrName`,`ArtenDb_tblFloraSisf`.`Name`,`qryAuswLetzteAnzAnz`.`TPopKontrjahr`,`qryAuswLetzteAnzAnz`.`TPopKontrTyp`,`qryAuswLetzteAnzAnz`.`Zaehleinheit`,`qryAuswLetzteAnzAnz`.`Anzahl`;

CREATE VIEW qryKontrollen AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Artname, DomainApBearbeitungsstand.DomainTxt AS ApStatus, tblAktionsplan.ApJahr, DomainApUmsetzung.DomainTxt AS ApUmsetzung, tblPopulation.PopGuid, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopGuid, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopBekanntSeit, tblTeilPopFeldkontrolle.TPopKontrGuid, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrDatum, DomainTPopFeldkontrTyp.DomainTxt AS TPopKontrTyp, tblAdresse.AdrName AS TPopKontrBearb, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, DomainTPopKontrMethode.BeurteilTxt AS TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, DomainTPopKontrMethode_2.BeurteilTxt AS TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, DomainTPopKontrMethode_1.BeurteilTxt AS TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrUeberleb, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, DomainPopEntwicklung.EntwicklungTxt AS TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr, tblTeilpopulation.TPopXKoord AS X, tblTeilpopulation.TPopYKoord AS Y, tblTeilPopFeldkontrolle.TPopKontrTxt, tblTeilPopFeldkontrolle.TPopKontrLeb, tblTeilPopFeldkontrolle.TPopKontrFlaeche, tblTeilPopFeldkontrolle.TPopKontrLebUmg, tblTeilPopFeldkontrolle.TPopKontrVegTyp, tblTeilPopFeldkontrolle.TPopKontrKonkurrenz, tblTeilPopFeldkontrolle.TPopKontrMoosschicht, tblTeilPopFeldkontrolle.TPopKontrKrautschicht, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht, tblTeilPopFeldkontrolle.TPopKontrBaumschicht, tblTeilPopFeldkontrolle.TPopKontrBodenTyp, tblTeilPopFeldkontrolle.TPopKontrBodenKalkgehalt, tblTeilPopFeldkontrolle.TPopKontrBodenDurchlaessigkeit, tblTeilPopFeldkontrolle.TPopKontrBodenHumus, tblTeilPopFeldkontrolle.TPopKontrBodenNaehrstoffgehalt, tblTeilPopFeldkontrolle.TPopKontrBodenAbtrag, tblTeilPopFeldkontrolle.TPopKontrWasserhaushalt, DomainTPopKontrIdBiotUebereinst.DomainTxt AS TPopKontrIdealBiotopUebereinst, tblTeilPopFeldkontrolle.TPopKontrHandlungsbedarf, tblTeilPopFeldkontrolle.TPopKontrUebFlaeche, tblTeilPopFeldkontrolle.TPopKontrPlan, tblTeilPopFeldkontrolle.TPopKontrVeg, tblTeilPopFeldkontrolle.TPopKontrNaBo, tblTeilPopFeldkontrolle.TPopKontrUebPfl, tblTeilPopFeldkontrolle.TPopKontrJungPflJN, tblTeilPopFeldkontrolle.TPopKontrVegHoeMax, tblTeilPopFeldkontrolle.TPopKontrVegHoeMit, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung, tblTeilPopFeldkontrolle.MutWann, tblTeilPopFeldkontrolle.MutWer
FROM ((((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN ((((((tblTeilPopFeldkontrolle LEFT JOIN DomainTPopFeldkontrTyp ON tblTeilPopFeldkontrolle.TPopKontrTyp = DomainTPopFeldkontrTyp.DomainTxt) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainPopEntwicklung.EntwicklungId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrIdBiotUebereinst ON tblTeilPopFeldkontrolle.TPopKontrIdealBiotopUebereinst = DomainTPopKontrIdBiotUebereinst.DomainCode
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrDatum;

CREATE ALGORITHM=UNDEFINED DEFINER=`alexande`@`localhost` SQL SECURITY DEFINER VIEW qryKontrollenNoBlob AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Artname, DomainApBearbeitungsstand.DomainTxt AS ApStatus, tblAktionsplan.ApJahr, DomainApUmsetzung.DomainTxt AS ApUmsetzung, tblPopulation.PopGuid, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopGuid, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopBekanntSeit, tblTeilPopFeldkontrolle.TPopKontrGuid, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrDatum, DomainTPopFeldkontrTyp.DomainTxt AS TPopKontrTyp, tblAdresse.AdrName AS TPopKontrBearb, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, DomainTPopKontrMethode.BeurteilTxt AS TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, DomainTPopKontrMethode_2.BeurteilTxt AS TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, DomainTPopKontrMethode_1.BeurteilTxt AS TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrUeberleb, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, DomainPopEntwicklung.EntwicklungTxt AS TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr, tblTeilpopulation.TPopXKoord AS X, tblTeilpopulation.TPopYKoord AS Y, tblTeilPopFeldkontrolle.TPopKontrTxt, tblTeilPopFeldkontrolle.TPopKontrLeb, tblTeilPopFeldkontrolle.TPopKontrFlaeche, tblTeilPopFeldkontrolle.TPopKontrLebUmg, tblTeilPopFeldkontrolle.TPopKontrVegTyp, tblTeilPopFeldkontrolle.TPopKontrKonkurrenz, tblTeilPopFeldkontrolle.TPopKontrMoosschicht, tblTeilPopFeldkontrolle.TPopKontrKrautschicht, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht, tblTeilPopFeldkontrolle.TPopKontrBaumschicht, tblTeilPopFeldkontrolle.TPopKontrBodenTyp, tblTeilPopFeldkontrolle.TPopKontrBodenKalkgehalt, tblTeilPopFeldkontrolle.TPopKontrBodenDurchlaessigkeit, tblTeilPopFeldkontrolle.TPopKontrBodenHumus, tblTeilPopFeldkontrolle.TPopKontrBodenNaehrstoffgehalt, tblTeilPopFeldkontrolle.TPopKontrBodenAbtrag, tblTeilPopFeldkontrolle.TPopKontrWasserhaushalt, DomainTPopKontrIdBiotUebereinst.DomainTxt AS TPopKontrIdealBiotopUebereinst, tblTeilPopFeldkontrolle.TPopKontrHandlungsbedarf, tblTeilPopFeldkontrolle.TPopKontrUebFlaeche, tblTeilPopFeldkontrolle.TPopKontrPlan, tblTeilPopFeldkontrolle.TPopKontrVeg, tblTeilPopFeldkontrolle.TPopKontrNaBo, tblTeilPopFeldkontrolle.TPopKontrUebPfl, tblTeilPopFeldkontrolle.TPopKontrJungPflJN, tblTeilPopFeldkontrolle.TPopKontrVegHoeMax, tblTeilPopFeldkontrolle.TPopKontrVegHoeMit, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung, tblTeilPopFeldkontrolle.MutWann, tblTeilPopFeldkontrolle.MutWer
FROM ((((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN ((((((tblTeilPopFeldkontrolle LEFT JOIN DomainTPopFeldkontrTyp ON tblTeilPopFeldkontrolle.TPopKontrTyp = DomainTPopFeldkontrTyp.DomainTxt) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainPopEntwicklung.EntwicklungId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrIdBiotUebereinst ON tblTeilPopFeldkontrolle.TPopKontrIdealBiotopUebereinst = DomainTPopKontrIdBiotUebereinst.DomainCode
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrDatum;

CREATE VIEW qryBeobachtungen AS
SELECT alexande_beob.tblBeob.BeobId, alexande_beob.tblBeob.NO_NOTE AS "ID Info Flora", alexande_beob.tblBeob.IdEvab AS "ID EvAB", ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS Artname, tblPopulation.PopGuid, tblPopulation.PopNr, tblTeilpopulation.TPopGuid, tblTeilpopulation.TPopNr, CONCAT(tblPopulation.PopNr, ".", tblTeilpopulation.TPopNr) AS "TPop-Nr", alexande_beob.tblBeob.PROJET AS Projekt, alexande_beob.tblBeob.NOM_COMMUNE AS RaumGde, alexande_beob.tblBeob.DESC_LOCALITE AS Ort, alexande_beob.tblBeob.xGIS AS X, alexande_beob.tblBeob.yGIS AS Y, alexande_beob.tblBeob.A_NOTE AS "Datum Jahr", alexande_beob.tblBeob.M_NOTE AS "Datum Monat", alexande_beob.tblBeob.J_NOTE AS "Datum Tag", alexande_beob.tblBeob.Autor, alexande_beob.tblBeob.MutWann, alexande_beob.tblBeob.MutWer
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN alexande_beob.tblBeob ON tblTeilpopulation.TPopId = alexande_beob.tblBeob.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, alexande_beob.tblBeob.M_NOTE DESC, alexande_beob.tblBeob.J_NOTE DESC;






CREATE VIEW qryExportNachEvab_Alle AS 
SELECT ArtenDb_tblFloraSisf.GUID AS Projekt_Id, CONCAT("AP Flora ZH: ", ArtenDb_tblFloraSisf.Name) AS Projekt_Name, CAST(IF(tblAktionsplan.ApJahr Is Not Null,CONCAT("01.01.", tblAktionsplan.ApJahr),"") AS CHAR) AS Projekt_Eröffnung, "Topos" AS Projekt_Autor, CAST(CONCAT("Aktionsplan: ", DomainApBearbeitungsstand.DomainTxt, IF(tblAktionsplan.ApJahr Is Not Null,CONCAT("; Start im Jahr: ", tblAktionsplan.ApJahr),""), IF(tblAktionsplan.ApUmsetzung Is Not Null,CONCAT("; Stand Umsetzung: ", DomainApUmsetzung.DomainTxt),"")) AS CHAR) AS Projekt_Bemerkungen, tblPopulation.PopGuid AS Raum_Id, CAST(CONCAT(tblPopulation.PopName, IF(tblPopulation.PopNr Is Not Null,CONCAT(" (Nr. ", tblPopulation.PopNr + ")"),"")) AS CHAR) AS Raum_Name, CAST(IF(tblPopulation.PopHerkunft Is Not Null,CONCAT("Status: ", DomainPopHerkunft.HerkunftTxt, IF(tblPopulation.PopBekanntSeit Is Not Null,CONCAT("; Bekannt seit: ", tblPopulation.PopBekanntSeit),"")),"") AS CHAR) AS Raum_Bemerkungen, tblTeilpopulation.TPopGuid AS Ort_Id, CAST(CONCAT(tblTeilpopulation.TPopFlurname, IF(tblTeilpopulation.TPopNr Is Not Null,CONCAT(" (Nr. ", tblTeilpopulation.TPopNr, ")"),"")) AS CHAR) AS Ort_Name, tblTeilpopulation.TPopHoehe AS Ort_ObergrenzeHöhe, tblTeilpopulation.TPopXKoord AS Ort_X, tblTeilpopulation.TPopYKoord AS Ort_Y, "+-20m" AS Ort_Genauigkeit, tblTeilpopulation.TPopGemeinde AS Ort_Gemeinde, tblTeilpopulation.TPopFlurname AS Ort_Flurname, tblTeilpopulation.TPopExposition AS Ort_Exposition, tblTeilpopulation.TPopNeigung AS Ort_Hangneigung, tblTeilPopFeldkontrolle.TPopKontrLeb AS Ort_Lebensraum, tblTeilPopFeldkontrolle.TPopKontrLebUmg AS Ort_UmgebungDelarze, tblTeilPopFeldkontrolle.ZeitGuid AS Zeit_Id, CAST(IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,CONCAT(tblTeilPopFeldkontrolle.TPopKontrDatum,"01.01.", tblTeilPopFeldkontrolle.TPopKontrJahr),"") AS CHAR) AS Zeit_Datum, CAST(IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,"Tag","Jahr") AS CHAR) AS Zeit_GenauigkeitDatum, tblTeilPopFeldkontrolle.TPopKontrMoosschicht AS Zeit_DeckungMoose, tblTeilPopFeldkontrolle.TPopKontrKrautschicht AS Zeit_DeckungKräuter, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht AS Zeit_DeckungSträucher, tblTeilPopFeldkontrolle.TPopKontrBaumschicht AS Zeit_DeckungBäume, tblTeilPopFeldkontrolle.TPopKontrGuid AS Beob_Id, tblAdresse.AdrNachname AS Beob_BeobachterinNachname, tblAdresse.AdrVorname AS Beob_BeobachterinVorname, tblAktionsplan.ApArtId AS Beob_NR, ArtenDb_tblFloraSisf.Name AS Beob_WissenschArtname, ArtenDb_tblFloraSisf.Deutsch AS Beob_DeutscherArtname, "Feldbeobachtung" AS Beob_TypDerMeldung, tblTeilPopFeldkontrolle.TPopKontrAnz1 AS Beob_Anzahl1, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS Beob_Einheit1, DomainTPopKontrMethode.BeurteilTxt AS Beob_Genauigkeit1, tblTeilPopFeldkontrolle.TPopKontrAnz2 AS Beob_Anzahl2, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS Beob_Einheit2, DomainTPopKontrMethode_1.BeurteilTxt AS Beob_Genauigkeit2, tblTeilPopFeldkontrolle.TPopKontrAnz3 AS Beob_Anzahl3, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS Beob_Einheit3, DomainTPopKontrMethode_2.BeurteilTxt AS Beob_Genauigkeit3, DomainPopHerkunft_1.ZdsfHerkunft AS Beob_Herkunft, DomainPopHerkunft_1.ZdsfVorhanden AS Beob_Vorhandensein, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung AS Beob_Gefährdung, tblTeilPopFeldkontrolle.TPopKontrVitalitaet AS Beob_VitalitätPflanze, tblTeilpopulation.TPopBeschr AS Beob_BeschreibungStandort
FROM ((((((((((((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
WHERE (((tblTeilpopulation.TPopXKoord) Is Not Null) AND ((tblTeilpopulation.TPopYKoord) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrDatum) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrTyp)="Zwischenbeurteilung" Or (tblTeilPopFeldkontrolle.TPopKontrTyp)="Freiwilligen-Erfolgskontrolle") AND ((tblTeilpopulation.TPopHerkunft)<>1198167213)) OR (((tblTeilpopulation.TPopXKoord) Is Not Null) AND ((tblTeilpopulation.TPopYKoord) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrTyp)="Zwischenbeurteilung" Or (tblTeilPopFeldkontrolle.TPopKontrTyp)="Freiwilligen-Erfolgskontrolle") AND ((tblTeilpopulation.TPopHerkunft)<>1198167213) AND ((tblTeilPopFeldkontrolle.TPopKontrJahr) Is Not Null))
ORDER BY ArtenDb_tblFloraSisf.Name, CONCAT(tblPopulation.PopName, IF(tblPopulation.PopNr Is Not Null,CONCAT(" (Nr. ", tblPopulation.PopNr, ")"),"")), CONCAT(tblTeilpopulation.TPopFlurname, IF(tblTeilpopulation.TPopNr Is Not Null,CONCAT(" (Nr. ", tblTeilpopulation.TPopNr, ")"),"")), IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,tblTeilPopFeldkontrolle.TPopKontrDatum,CONCAT("01.01.", tblTeilPopFeldkontrolle.TPopKontrJahr)), ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryExportNachEvab_Beob AS
SELECT ArtenDb_tblFloraSisf.GUID AS Projekt_Id, tblPopulation.PopGuid AS Raum_Id, tblTeilpopulation.TPopGuid AS Ort_Id, tblTeilPopFeldkontrolle.ZeitGuid AS Zeit_Id, tblTeilPopFeldkontrolle.TPopKontrGuid AS Beob_Id, tblAdresse.AdrNachname AS Beob_BeobachterinNachname, tblAdresse.AdrVorname AS Beob_BeobachterinVorname, tblAktionsplan.ApArtId AS Beob_NR, ArtenDb_tblFloraSisf.Name AS Beob_WissenschArtname, ArtenDb_tblFloraSisf.Deutsch AS Beob_DeutscherArtname, "Feldbeobachtung" AS Beob_TypDerMeldung, tblTeilPopFeldkontrolle.TPopKontrAnz1 AS Beob_Anzahl1, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS Beob_Einheit1, DomainTPopKontrMethode.BeurteilTxt AS Beob_Genauigkeit1, tblTeilPopFeldkontrolle.TPopKontrAnz2 AS Beob_Anzahl2, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS Beob_Einheit2, DomainTPopKontrMethode_1.BeurteilTxt AS Beob_Genauigkeit2, tblTeilPopFeldkontrolle.TPopKontrAnz3 AS Beob_Anzahl3, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS Beob_Einheit3, DomainTPopKontrMethode_2.BeurteilTxt AS Beob_Genauigkeit3, DomainPopHerkunft_1.ZdsfHerkunft AS Beob_Herkunft, DomainPopHerkunft_1.ZdsfVorhanden AS Beob_Vorhandensein, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung AS Beob_Gefährdung, tblTeilPopFeldkontrolle.TPopKontrVitalitaet AS Beob_VitalitätPflanze, tblTeilpopulation.TPopBeschr AS Beob_BeschreibungStandort
FROM ((((((((((((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
WHERE (((tblTeilpopulation.TPopXKoord) Is Not Null) AND ((tblTeilpopulation.TPopYKoord) Is Not Null)) OR (((tblTeilpopulation.TPopXKoord) Is Not Null) AND ((tblTeilpopulation.TPopYKoord) Is Not Null))
GROUP BY ArtenDb_tblFloraSisf.GUID, tblPopulation.PopGuid, tblTeilpopulation.TPopGuid, tblTeilPopFeldkontrolle.ZeitGuid, tblTeilPopFeldkontrolle.TPopKontrGuid, tblAdresse.AdrNachname, tblAdresse.AdrVorname, tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, ArtenDb_tblFloraSisf.Deutsch, "Feldbeobachtung", tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit.ZaehleinheitTxt, DomainTPopKontrMethode.BeurteilTxt, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt, DomainTPopKontrMethode_1.BeurteilTxt, tblTeilPopFeldkontrolle.TPopKontrAnz3, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt, DomainTPopKontrMethode_2.BeurteilTxt, DomainPopHerkunft_1.ZdsfHerkunft, DomainPopHerkunft_1.ZdsfVorhanden, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, tblTeilpopulation.TPopBeschr, tblTeilPopFeldkontrolle.TPopKontrDatum, tblTeilPopFeldkontrolle.TPopKontrTyp, tblTeilpopulation.TPopHerkunft, tblTeilPopFeldkontrolle.TPopKontrJahr
HAVING (((tblTeilPopFeldkontrolle.TPopKontrDatum) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrTyp)="Zwischenbeurteilung" Or (tblTeilPopFeldkontrolle.TPopKontrTyp)="Freiwilligen-Erfolgskontrolle") AND ((tblTeilpopulation.TPopHerkunft)<>1198167213)) OR (((tblTeilPopFeldkontrolle.TPopKontrTyp)="Zwischenbeurteilung" Or (tblTeilPopFeldkontrolle.TPopKontrTyp)="Freiwilligen-Erfolgskontrolle") AND ((tblTeilpopulation.TPopHerkunft)<>1198167213) AND ((tblTeilPopFeldkontrolle.TPopKontrJahr) Is Not Null))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW qryExportNachEvab_Zeit AS
SELECT ArtenDb_tblFloraSisf.GUID AS Projekt_Id, tblPopulation.PopGuid AS Raum_Id, tblTeilpopulation.TPopGuid AS Ort_Id, tblTeilPopFeldkontrolle.ZeitGuid AS Zeit_Id, CAST(IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,tblTeilPopFeldkontrolle.TPopKontrDatum,CONCAT("01.01." + tblTeilPopFeldkontrolle.TPopKontrJahr)) AS CHAR) AS Zeit_Datum, IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,"Tag","Jahr") AS Zeit_GenauigkeitDatum, tblTeilPopFeldkontrolle.TPopKontrMoosschicht AS Zeit_DeckungMoose, tblTeilPopFeldkontrolle.TPopKontrKrautschicht AS Zeit_DeckungKräuter, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht AS Zeit_DeckungSträucher, tblTeilPopFeldkontrolle.TPopKontrBaumschicht AS Zeit_DeckungBäume
FROM ((((((((((((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
WHERE ((tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213)) OR ((tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213) AND (tblTeilPopFeldkontrolle.TPopKontrJahr Is Not Null))
GROUP BY ArtenDb_tblFloraSisf.GUID, tblPopulation.PopGuid, tblTeilpopulation.TPopGuid, tblTeilPopFeldkontrolle.ZeitGuid, IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,tblTeilPopFeldkontrolle.TPopKontrDatum,CONCAT("01.01." + tblTeilPopFeldkontrolle.TPopKontrJahr)), IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,"Tag","Jahr"), tblTeilPopFeldkontrolle.TPopKontrMoosschicht, tblTeilPopFeldkontrolle.TPopKontrKrautschicht, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht, tblTeilPopFeldkontrolle.TPopKontrBaumschicht
ORDER BY IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,tblTeilPopFeldkontrolle.TPopKontrDatum,tblTeilPopFeldkontrolle.TPopKontrJahr);

CREATE VIEW qryExportNachEvab_Ort AS
SELECT ArtenDb_tblFloraSisf.GUID AS Projekt_Id, tblPopulation.PopGuid AS Raum_Id, tblTeilpopulation.TPopGuid AS Ort_Id, CAST(CONCAT(tblTeilpopulation.TPopFlurname, IF(tblTeilpopulation.TPopNr Is Not Null,CONCAT(" (Nr. ", tblTeilpopulation.TPopNr, ")"),"")) AS CHAR) AS Ort_Name, tblTeilpopulation.TPopHoehe AS Ort_ObergrenzeHöhe, tblTeilpopulation.TPopXKoord AS Ort_X, tblTeilpopulation.TPopYKoord AS Ort_Y, "+-20m" AS Ort_Genauigkeit, tblTeilpopulation.TPopGemeinde AS Ort_Gemeinde, tblTeilpopulation.TPopFlurname AS Ort_Flurname, tblTeilpopulation.TPopExposition AS Ort_Exposition, tblTeilpopulation.TPopNeigung AS Ort_Hangneigung, tblTeilPopFeldkontrolle.TPopKontrLeb AS Ort_Lebensraum, tblTeilPopFeldkontrolle.TPopKontrLebUmg AS Ort_UmgebungDelarze
FROM ((((((((((((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
WHERE ((tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213)) OR ((tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213) AND (tblTeilPopFeldkontrolle.TPopKontrJahr Is Not Null))
GROUP BY ArtenDb_tblFloraSisf.GUID, tblPopulation.PopGuid, tblTeilpopulation.TPopGuid, CONCAT(tblTeilpopulation.TPopFlurname, IF(tblTeilpopulation.TPopNr Is Not Null,CONCAT(" (Nr. ", tblTeilpopulation.TPopNr, ")"),"")), tblTeilpopulation.TPopHoehe, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, "+-20m", tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopExposition, tblTeilpopulation.TPopNeigung, tblTeilPopFeldkontrolle.TPopKontrLeb, tblTeilPopFeldkontrolle.TPopKontrLebUmg
HAVING ((tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null)) OR ((tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null))
ORDER BY tblTeilpopulation.TPopFlurname,tblTeilpopulation.TPopNr;

CREATE VIEW qryExportNachEvab_Raum AS
SELECT ArtenDb_tblFloraSisf.GUID AS Projekt_Id, tblPopulation.PopGuid AS Raum_Id, tblPopulation.PopName + IF(tblPopulation.PopNr Is Not Null,CONCAT(" (Nr. ", tblPopulation.PopNr, ")"),"") AS Raum_Name, CAST(IF(tblPopulation.PopHerkunft Is Not Null,CONCAT("Status: ", DomainPopHerkunft.HerkunftTxt, IF(tblPopulation.PopBekanntSeit Is Not Null,CONCAT("; Bekannt seit: ", tblPopulation.PopBekanntSeit),"")),"") AS CHAR) AS Raum_Bemerkungen
FROM ((((((((((((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
WHERE ((tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213) AND (tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null)) OR ((tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213) AND (tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrJahr Is Not Null))
GROUP BY ArtenDb_tblFloraSisf.GUID, tblPopulation.PopGuid, CONCAT(tblPopulation.PopName, IF(tblPopulation.PopNr Is Not Null,CONCAT(" (Nr. ", tblPopulation.PopNr, ")"),"")), IF(tblPopulation.PopHerkunft Is Not Null,CONCAT("Status: ", DomainPopHerkunft.HerkunftTxt, IF(tblPopulation.PopBekanntSeit Is Not Null,CONCAT("; Bekannt seit: ", tblPopulation.PopBekanntSeit), "")),"")
ORDER BY tblPopulation.PopName, tblPopulation.PopNr;

CREATE VIEW qryExportNachEvab_Projekt AS
SELECT ArtenDb_tblFloraSisf.GUID AS Projekt_Id, CONCAT("AP Flora ZH: ", ArtenDb_tblFloraSisf.Name) AS Projekt_Name, CAST(IF(tblAktionsplan.ApJahr Is Not Null,CONCAT("01.01.", tblAktionsplan.ApJahr),"") AS CHAR) AS Projekt_Eröffnung, "Topos" AS Projekt_Autor, CAST(CONCAT("Aktionsplan: ", DomainApBearbeitungsstand.DomainTxt, IF(tblAktionsplan.ApJahr Is Not Null,CONCAT("; Start im Jahr: ", tblAktionsplan.ApJahr),""), IF(tblAktionsplan.ApUmsetzung Is Not Null,CONCAT("; Stand Umsetzung: ", DomainApUmsetzung.DomainTxt),""),"") AS CHAR) AS Projekt_Bemerkungen
FROM ((((((((((((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
WHERE ((tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213) AND (tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null)) OR ((tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213) AND (tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrJahr Is Not Null))
GROUP BY ArtenDb_tblFloraSisf.GUID, CONCAT("AP Flora ZH: ", ArtenDb_tblFloraSisf.Name), IF(tblAktionsplan.ApJahr Is Not Null,CONCAT("01.01.", tblAktionsplan.ApJahr),""), "Topos", CONCAT("Aktionsplan: ", DomainApBearbeitungsstand.DomainTxt, IF(tblAktionsplan.ApJahr Is Not Null,CONCAT("; Start im Jahr: ", tblAktionsplan.ApJahr),""), IF(tblAktionsplan.ApUmsetzung Is Not Null,CONCAT("; Stand Umsetzung: ", DomainApUmsetzung.DomainTxt), ""))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW name AS 

CREATE VIEW name AS

CREATE VIEW name AS 

CREATE VIEW name AS






















CREATE VIEW name AS 

CREATE VIEW qryTblTeilpopulationMitLfnr AS 
SELECT (Select Count (*) FROM tblTeilpopulation as Temp WHERE Temp.TPopId < tblTeilpopulation.TPopId)+1 AS LaufNummer, tblTeilpopulation.*
FROM tblTeilpopulation;





CREATE TRIGGER TPopKontrGuid_insert BEFORE INSERT ON tblTeilPopFeldkontrolle
FOR EACH ROW
SET NEW.TPopKontrGuid = UUID()


DistZurTPop: QWurzel((XGis-Formulare!frmAktionsplan!frmPopulation.Form!frmTPop.Form!TPopXKoord)*(XGis-Formulare!frmAktionsplan!frmPopulation.Form!frmTPop.Form!TPopXKoord)+(YGis-Formulare!frmAktionsplan!frmPopulation.Form!frmTPop.Form!TPopYKoord)*(YGis-Formulare!frmAktionsplan!frmPopulation.Form!frmTPop.Form!TPopYKoord))

QWurzel((XKoord-TPopXKoord)*(XKoord-TPopXKoord)+(YKoord-TPopYKoord)*(YKoord-TPopYKoord))


SQRT

















