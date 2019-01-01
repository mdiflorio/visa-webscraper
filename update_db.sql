-- Wipe DB. 
DELETE FROM restrictions;

--  Load data from file. 
load data local infile './output/data.csv' into table restrictions 
           fields terminated by ';' 
           enclosed by '"' 
           lines terminated by '\n' 
           IGNORE 1 LINES;

-- Delete useless entries. 
DELETE FROM restrictions 
WHERE nationality = 'crew members' 
OR country = 'eVisa'
OR country = 'eVisitor'
OR visaType = '90 days'
OR visaType = '';




