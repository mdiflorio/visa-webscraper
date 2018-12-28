DELETE FROM restrictions;
load data local infile './output/data.csv' into table restrictions 
           fields terminated by ';' 
           enclosed by '"' 
           lines terminated by '\n' 
           IGNORE 1 LINES;