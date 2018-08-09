import dotenv from 'dotenv';
dotenv.config();

const pg = require('pg');
const pool = new pg.Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
});

exports.clearDb = function () {
    pool.query("DELETE from currencies where datetime < CURRENT_TIMESTAMP - INTERVAL '30 days'"
          , (err, res) => {
            console.log(err, res);

        })
}

exports.saveToDb = function (name, price) {
    console.log(name, price);
    if (isNaN(price)) return;
    pool.query("SELECT count(*) from currencies where name='" + name + "'", (err, res) => {


            //console.log(res.rows[0].count)
            pool.query("INSERT INTO currencies (name,price,datetime) " +
                "VALUES ('" + name + "','" + price + "',current_timestamp)", (err, res) => {
                //console.log(err, res);

            })
            //pool.end();


    });


}

