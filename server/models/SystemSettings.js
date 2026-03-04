const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    messagesPerInterval: {
        type: Number,
        required: true,
        default: 7,
        min: 5,
        max: 10
    },
    keyClicksThreshold: {
        type: Number,
        required: true,
        default: 40,
        enum: [20, 30, 40, 50]
    }
}, {
    timestamps: true
});

// We only ever want ONE settings document.
// This ensures there's only a single config payload retrieved globally.
module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
