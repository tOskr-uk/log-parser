const mongoose = require('mongoose');

const Log = mongoose.model('Log',{
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
    combatData: {
        type: Array,
        required: true
    },
    otherData: {
        type: Array,
        required: true,
        default: []
    } 
})

module.exports = Log;