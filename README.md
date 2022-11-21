# cs348-project

## Working with Sample Dataset

1. To load sample database, first download the `.csv` files for sample data. 
2. Download **mySQL** into your local machine, make sure the path to `/bin` is added into environmental variable. 

2. Establish connection with **mySQL** server. Open mySQL workbench, create a schema for storing sample database, name it whatever you want. (We named the database as `rideshare` for convenience).
3. Create tables for the dataset with queries specified in `sql/create_tables.sql`
4. Populate the table with the `.csv` files by copying and pasting queries specified in `sql/populatetables.sql`, remember to change the path to where you stored the `.csv` files in local computer.
5. Now you have set up and loaded sample data into the database, you can test it by looking at the tables or with `SELECT * FROM <table-name>`.  



## Opening Application

1. Make sure `Node.js (npm)` is installed. Navigate to home directory of the project, use `npm install` to install all dependencies and add-ons.
2. In terminal, enter `node app.js` to start the web-application, the default address should be `localhost:3000`. Open it in browser and the app interface should show up.  


## Working with Production Dataset
1. Same with loading sample dataset.
2. *Remark*: remember to change the path from where you store sample files to where production data files are stored, when executing commands to populate tables.  
  

## Currently Supporting Features
**Feature 1**: User login System  

**Feature 2**: User Registration  

**Feature 3**: Search for Carpool by Destination and Time  

**Feature 4**: Edit User Profile

*Remark*: We also support a web interface for database driven application login system.  

## Members:
Rujing Li  
Moneta Wang  
Kristine Yuan  
Weiyu Wang  

