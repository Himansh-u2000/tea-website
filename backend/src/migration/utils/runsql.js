import { pool } from "../../util/pool.js"
import fs from "fs/promises"

const runSQL = async () => {
    let sqlFile;
    try {
        sqlFile = await fs.readFile("../models/user.model.sql", "utf-8")
    } catch (error) {
        console.error("error while reading sql file", error)
    }

    try{
        await pool.query(sqlFile)

        console.log("user table created successfully")
    }catch(error){
        console.error("error while creating user table", error)
    }finally{
        await pool.end();
    }
}

runSQL()