const express = require('express');
const bodyParser = require('body-parser');
const { connect, Todo } = require('./connect');
const app = express();
const ejs = require('ejs');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.set('view engine', 'ejs');

// Connect to MongoDB
connect().then(() => {
    // Start the server after successfully connecting to the database
    app.listen(8080, () => {
        console.log('Server is running on port 8080');
    });
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});

// Render the todo list page
app.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({});
        const todoItems = todos.map(todo => todo.item); // Extract only the item names
        let today = new Date();
        let options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        let day = today.toLocaleDateString("en-US", options);

        res.render("list", { Day: day, newItems: todoItems, todos: todos });
    } catch (error) {
        console.error('Error retrieving todos:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add a new todo item
app.post('/', async (req, res) => {
    try {
        const newItem = req.body.newItem;
        const todo = new Todo({ item: newItem });
        await todo.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete a todo item
app.post('/delete/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        await Todo.findByIdAndDelete(todoId);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Toggle completion status of a todo item
app.post('/toggle/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        const todo = await Todo.findById(todoId);
        todo.completed = !todo.completed; // Toggle completion status
        await todo.save();
        res.sendStatus(200);
    } catch (error) {
        console.error('Error toggling completion status:', error);
        res.status(500).send('Internal Server Error');
    }
});
