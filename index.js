const express = require('express');
const app = express();
const PORT = 3000;

// Parse JSON request bodies
app.use(express.static('public'));
app.use(express.json()); 

const tasks = [
    { id: 1, title: 'Buy groceries', completed: false },
    { id: 2, title: 'Read a book', completed: true }
  ];

let idCounter = 3;

// Get all tasks or filter by status (completed/pending)
app.get('/api/tasks', (req, res) => {
  const { status } = req.query;
  if (status === 'completed') return res.json(tasks.filter(t => t.completed));
  if (status === 'pending') return res.json(tasks.filter(t => !t.completed));
  res.json(tasks);
});

// Add a new task with validation
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') 
    return res.status(400).json({ error: 'Title is required' });
  const newTask = { id: idCounter++, title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Mark task as completed by ID
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id == id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.completed = true;
  res.json(task);
});

// Delete task by ID
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id == id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});