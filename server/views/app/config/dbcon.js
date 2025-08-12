const mongoose = require('mongoose')
const dbcon = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL)
        if (db) {
            console.log('Database Connected Successfully');

        }
    } catch (error) {
        console.log('Database Connection fail');

    }
}
module.exports=dbcon