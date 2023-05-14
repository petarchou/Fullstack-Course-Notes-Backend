require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express();
const Note = require('./models/note');


app.use(express.static('build'))
app.use(express.json())
app.use(cors())

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes);
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id;
  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    }
    else {
      response.status(404).end();
    }
  }).catch(err => next(err));
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id;

  Note.deleteOne({ _id: id }).then(note => {
    response.status(204).end();
  })

})

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

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(err => next(err));
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body;
  const note = {
    content,
    important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      if(!updatedNote) {
      }
      response.json(updatedNote);
    })
    .catch(err => next(err));
})

app.use((request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
})

//Error Handling
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  //can be made into an object if gets bigger
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  } 

  next(error);
}

app.use(errorHandler);


const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`Server running on port ${PORT}`)