const { Client } = require('pg')
const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DBPORT
})
client.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("DoorBell Is Connected To Database Successfully")
    }

})
module.exports = client