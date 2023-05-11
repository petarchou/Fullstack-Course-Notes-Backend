const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

  app.get('/api/notes', (request, response) => {
    response.json(notes)
  })

  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    if(note) {
      response.json(note)
    } else {
      response.status(404).end();
    }
  })

  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const prevSize = notes.length;
    notes = notes.filter(note => note.id !== id);

    if(notes.length === prevSize) {
      response.status(404).end(`Note with id ${id} not found`);
    }
    else {
      response.status(204).end();
    }
  })

  const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : -1;
    return maxId+1;
  }

  app.post('/api/notes', (request,response) => {
    const {content} = request.body;

    if(!content) {
      response.status(400).json({
        error: 'content missing',
      })
    } else {
      const note = {
        id: generateId(),
        content,
        important: false,
      }
      notes.push(note);
      
      response.status(201).send(note);
    }
    
  })


const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`Server running on port ${PORT}`)