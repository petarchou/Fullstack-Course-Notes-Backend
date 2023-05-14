require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express();
const Note = require('./models/note');


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
  Note.find({}).then(notes => {
    response.json(notes);
  })
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  Note.findById(id).then(note => {
    response.json(note)
  });
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id;

  Note.deleteOne({_id: id}).then(note => {
    response.status(204).end();
  })

})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : -1;
  return maxId + 1;
}

app.post('/api/notes', (request, response) => {
  const { content, important } = request.body;

  if (!content) {
    response.status(400).json({
      error: 'content missing',
    })
  } else {
    const note = new Note({
      content,
      important: important || false,
    });
    note.save().then(savedNote => {
      response.status(201).send(savedNote);
    })

  }

})


const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`Server running on port ${PORT}`)