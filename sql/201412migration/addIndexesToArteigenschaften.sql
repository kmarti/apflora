ALTER TABLE alexande_beob.ArtenDb_Arteigenschaften ADD UNIQUE INDEX `guid` (`GUID`);
ALTER TABLE alexande_beob.ArtenDb_Arteigenschaften ADD INDEX `taxonomieid` (TaxonomieId);
