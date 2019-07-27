// Node.js + Express server backend for petsapp
// v2 - use SQLite (https://www.sqlite.org/index.html) as a database
//
// COGS121 by Philip Guo
// https://github.com/pgbovine/COGS121

// run this once to create the initial database as the pets.db file
//   node create_database.js

// to clear the database, simply delete the pets.db file:
//   rm pets.db

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('plot.db');

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE plot (x TEXT, time INTEGER)");
for (i = 0; i < 0; i++) { 
var date = new Date();
var timestamp = date.getTime();
  // insert 3 rows of data:
  db.run("INSERT INTO plot VALUES ('"+getRandomArbitrary(1,10) +"', "+getRandomArbitrary(1000,timestamp) +");");
}

  console.log('successfully created the users_to_pets table in pets.db');

  // print them out to confirm their contents:
  db.each("SELECT x, time FROM plot ORDER BY time", (err, row) => {
      console.log(row.x + ": " + row.time);
  });
});

db.close();
