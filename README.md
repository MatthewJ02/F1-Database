# Formula 1 Database

This project allows the user to search for Formula 1 drivers filtered by various criteria (Name, Nationality, Championships, Wins, etc.) and displays the list in a table which can be ordered in ascending or descending order of any of those criteria. Once the user has searched for drivers, they can put two of them in a head to head which directly compares career statistics between the drivers.

This project uses React and Vite.

The dbConfig.js file allows the project to connect to a SQL server. I have omitted my login information from the file. The project can be recreated via SQL Server Management Studio. The Database.txt contains the data which comprises the SQL database used for this project.

Running the project requires the command "nodemon server.js" to be run in one terminal and "npm run dev" to be run in another.
