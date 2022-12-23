const mongoose = require('mongoose');

// MONGOOSE SCHEMA
const encounterSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: 'Unknown'
    },
    duration: {
        type: Number,
        required: true,
        trim: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    data: {
        type: Array,
        required: true
    }
})

// CREATE MODEL AND EXPORT
const Encounter = mongoose.model('Encounter', encounterSchema);
module.exports = Encounter;