const mongoose = require('mongoose');

const LogEntry = mongoose.model('LogEntry',{
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
    } 
})

module.exports = LogEntry;