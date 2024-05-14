const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    place: String,
    phone: String,
    eventName: String,
    date: String,
    time: String
});

const bookingModel = mongoose.model("booking", bookingSchema);
module.exports = bookingModel;
