const mongoose = require('mongoose');
const createRoles = require('../seeds/roleSeeder');
const createSpecializations = require('../seeds/seedSpecializations');
const seedAdmin = require('../seeds/seedAdmin');
// const seedAdmin = require('../seeds/seedAdmin');
const dbcon = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL)
        if (db) {
            console.log('Database Connected Successfully');
            try {
                await createRoles();
                //console.log('All roles seeded successfully!');
            } catch (e) {
                console.log('Roles seeding failed:', e.message);
            }
            try {
                await createSpecializations();
                //console.log('All Specialization seeded successfully!');
            } catch (e) {
                console.log('Specialization seeding failed:', e.message);
            }
            try {
                await seedAdmin();
                //console.log('Admin seeding checked!');
            } catch (e) {
                console.log('Admin seeding failed:', e.message);
            }
        }
    } catch (error) {
        console.log('Database Connection fail');

    }
}
module.exports = dbcon