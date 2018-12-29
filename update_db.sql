DELETE FROM restrictions;

load data local infile './output/data.csv' into table restrictions 
           fields terminated by ';' 
           enclosed by '"' 
           lines terminated by '\n' 
           IGNORE 1 LINES;

DELETE FROM restrictions 
WHERE nationality = 'crew members' 
OR country = 'eVisa'
OR visaType = '';

UPDATE restrictions
SET 
    nationality = 'Maltese'
WHERE 
    nationality = 'holders of passports issued by the Sovereign Military Order of Malta';

