const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userModel = require('./models/user.js');
const bookingModel = require('./models/booking.js')

const app = express();
app.use(express.json());
app.use(cors());
let uri = 'mongodb+srv://senthan:Msenthan0307@consultancy.kg8vmwv.mongodb.net/ThindalPunjabi'
mongoose.connect(uri);

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.email === 'admin@gmail.com') {
                    if (password === 'Admin-01') {
                        res.json("Login Admin");
                    } else {
                        res.status(401).json({ error: 'Incorrect Password', message: 'Incorrect password for admin account. Please try again.' });
                    }
                } else if (user.password === password) {
                    res.json("Login successful");
                } else {
                    res.status(401).json({ error: 'Incorrect Password', message: 'Incorrect password. Please try again.' });
                }
            } else {
                res.status(404).json({ error: 'User Not Found', message: 'No user found with the provided email.' });
            }
        })
        .catch(err => {
            console.error('Error during login:', err);
            res.status(500).json({ error: 'Server Error', message: 'An error occurred while processing your request. Please try again later.' });
        });
});

app.post('/register', (req, res) => {
    userModel.findOne({ email: req.body.email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ error: "Email already exists", message: "An account with this email address already exists. Please use a different email address." });
            } else {
                userModel.create(req.body)
                    .then(user => res.json(user))
                    .catch(err => res.status(500).json({ error: "Internal server error" }));
            }
        })
        .catch(err => res.status(500).json({ error: "Internal server error" }));
});

app.post('/hall', async (req, res) => {
    const { date } = req.body;
    try {
        const existingBooking = await bookingModel.findOne({ date });
        if (existingBooking) {
            return res.status(400).json({ error: "Date already booked", message: "The selected date is already booked. Please choose another date." });
        }
        const newBooking = await bookingModel.create(req.body);
        console.log('Booking created:', newBooking);
        res.status(201).json({ message: "Hall booked successfully" });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/admin', async (req, res) => {
    try {
        const bookings = await bookingModel.find();
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/admin/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedHall = await bookingModel.findByIdAndDelete(id);
        if (!deletedHall) {
            return res.status(404).json({ error: 'Hall not found' });
        }
        res.json({ message: 'Hall deleted successfully' });
    } catch (error) {
        console.error('Error deleting hall:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(3001, () => {
    console.log("Server is running");
});
