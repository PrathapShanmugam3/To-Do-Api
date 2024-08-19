const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express application
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://pofahon545:6ptyUq3Zc6AjOBZR@cluster0.t0h0y.mongodb.net/todo?retryWrites=true&w=majority')
.then(() => console.log('DB connected'))
.catch(err => {
    console.error('DB connection error:', err);
    process.exit(1); // Exit the process if connection fails
});

// Define the schema and model
const List = mongoose.model('todo', new mongoose.Schema({
    description: String,
    date: String
}));

// Routes
app.post('/post', async (req, res) => {
    try {
        const list = new List(req.body);
        const savedList = await list.save();
        res.status(201).send(savedList);
    } catch (err) {
        console.error('Error saving the list:', err);
        res.status(500).send({ error: 'Error saving the list' });
    }
});

app.get('/getAll', async (req, res) => {
    try {
        const lists = await List.find();
        res.status(200).send(lists);
    } catch (err) {
        console.error('Error retrieving lists:', err);
        res.status(500).send({ error: 'Error retrieving lists' });
    }
});

app.get('/getById/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const list = await List.findById(id);
        if (!list) {
            return res.status(404).send({ error: 'List not found' });
        }
        res.status(200).send(list);
    } catch (err) {
        console.error('Error retrieving list:', err);
        res.status(500).send({ error: 'Error retrieving list' });
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await List.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'List not found' });
        }
        res.status(200).send({ message: 'List deleted successfully' });
    } catch (err) {
        console.error('Error deleting list:', err);
        res.status(500).send({ error: 'Error deleting list' });
    }
});

app.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { description, date } = req.body;
        const result = await List.updateOne({ _id: id }, { $set: { description, date } });
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'List not found' });
        }
        res.status(200).send({ message: 'List updated successfully' });
    } catch (err) {
        console.error('Error updating list:', err);
        res.status(500).send({ error: 'Error updating list' });
    }
});

// Start the server
app.listen(10000, () => {
    console.log('Server is running on port 10000');
});
