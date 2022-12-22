const mongoose = require('mongoose');

const Encounter = mongoose.model('Encounter',{
    name: {
        type: String,
        trim: true,
        default: 'No Name'
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
module.exports = Encounter;