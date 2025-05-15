const config              = require('./dbConfig'),
    sql                   = require('mssql');

//Construct and perform sql query to retrieve specified list of drivers
const getDrivers = async(Name, Nationality, champMin, champMax, entryMin, entryMax, startMin, startMax, poleMin, poleMax, winMin, winMax, podiumMin, podiumMax, fastestMin, fastestMax, pointMin, pointMax, orderBy, desc) => {
    try {
        let pool = await sql.connect(config);
        let query = `SELECT * from New_Formula WHERE Name LIKE '%${Name}%'`;

        if (Nationality != '') {
            query += ` AND Nationality LIKE '%${Nationality}%'`;
        }

        query += ` AND Championships BETWEEN ${champMin} AND ${champMax}`;
        query += ` AND Entries BETWEEN ${entryMin} AND ${entryMax}`;
        query += ` AND Starts BETWEEN ${startMin} AND ${startMax}`;
        query += ` AND Poles BETWEEN ${poleMin} AND ${poleMax}`;
        query += ` AND Wins BETWEEN ${winMin} AND ${winMax}`;
        query += ` AND Podiums BETWEEN ${podiumMin} AND ${podiumMax}`;
        query += ` AND Fastest BETWEEN ${fastestMin} AND ${fastestMax}`;
        query += ` AND Points BETWEEN ${pointMin} AND ${pointMax}`;

        if (orderBy != null) {
            if (orderBy == 'Name') {
                query += ` ORDER BY LASTNAME ${desc}`;
            } else {
                query += ` ORDER BY ${orderBy} ${desc}, LASTNAME ASC`;
            }
        }
        
        let drivers = pool.request().query(query);
        return drivers;
    }
    catch(error) {
        console.log(error);
    }
}

module.exports = {
    getDrivers
}