# cs348-project

To test our sample code, in db2:
First connect to the CS348 server.
````
    db2 -stvf connectCS348.sql
````
Then, create and populate tables
````
    db2 -stvf create_tables.sql
    db2 -stvf populatetables.sql
````
Then, test the sample code:
````
    db2 -stvf test-sample.sql
````
The terminal will display the output, which can be also viewed in `test-sample.out`.
  
After execution of sample code, the tables should be dropped
````
    db2 -stvf drop_tables.sql
````

Members:
Rujing Li
Moneta Wang
Kristine Yuan
Weiyu Wang

