const mongoose = require('mongoose');

// Define schema
const Schema = mongoose.Schema;
const todoSchema = new Schema({
    item: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// Define model
const Todo = mongoose.model('Todo', todoSchema);

// Connection URI
const uri = 'mongodb://localhost:27017/todoList';

// Create a function to establish the connection and return the connection object
async function connect() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        return mongoose.connection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// Export the connect function and the Todo model
module.exports = { connect, Todo };
