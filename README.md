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
  

## Supported Features
**Feature 1**: User login System  
User can login the system through a login website.

**Feature 2**: User Registration  
New Users can register themselves and new user information will be added into the database.  

**Feature 3**: Search for Carpool by Destination and Time  
User can filter out carpool posts that corresponds to their required location and time.  

**Feature 4**: Edit User Profile  
User can view the information on their profile and edit them.  

**Feature 5**: Become a Driver  
A regular (passenger) user can register their car, driver liscence and car plate to become a driver.
A user with *Driver* status can post carpool rides.  

**Feature 6**: Post/Delete/Edit a Carpool  
A *Driver* user can post, delete, and edit a carpool ride. They can view their current posts.  


*Remark*: We also support a web interface for database driven application login system.  
  

## References
The information (car plate, driver licenses, user id, etc.) are generated using random functions in excel. User???s legal name as well as car descriptions are generated by websites.
URLs for online random data generators:

https://fossbytes.com/tools/random-name-generator

https://randomlistgenerator.com/cars


## Members:
Rujing Li  
Moneta Wang  
Kristine Yuan  
Weiyu Wang  

