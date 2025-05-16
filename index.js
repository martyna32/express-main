const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json()); 
const cors = require('cors');
app.use(cors());
app.use(morgan('tiny'));

let notes = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(notes);
});

app.get('/api/info', (request, response) => {
  const currentTime = new Date();
  const numberOfEntries = notes.length;
  response.send(`
    <div>
      <p>Phonebook has info for ${numberOfEntries} people</p>
      <p>${currentTime}</p>
    </div>
  `);
});


app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = notes.find(p => p.id === id); 

  if (person) {
    response.json(person);
  } else {
    response.status(404).send({ error: 'Person not found' });
  }
});


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const initialLength = notes.length;
  notes = notes.filter(p => p.id !== id);

  if (notes.length < initialLength) {
    response.status(204).end(); 
  } else {
    response.status(404).json({ error: 'Person not found' });
  }
});


app.post('/api/persons', (request, response) => {
  const body = request.body;


  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' });
  }


  const nameExists = notes.some(p => p.name === body.name);
  if (nameExists) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number
  };

  notes.push(person);
  response.status(201).json(person); // 201 = Created
});

morgan.token('body', (req, res) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const PORT = process.nasew.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
