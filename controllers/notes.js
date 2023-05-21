const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id;
  
    const note = await Note.findById(id)

    if (note) {
      response.json(note)
    }
    else {
      response.status(404).end();
    }
  
})

notesRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  await Note.deleteOne({ _id: id })

  response.status(204).end();

})

notesRouter.post('/', async (request, response, next) => {
  const { content, important } = request.body;
  const note = new Note({
    content,
    important: important || false,
  })
    const savedNote = await note.save()
    response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response, next) => {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

notesRouter.put('/:id', async (request, response, next) => {
  const { content, important } = request.body;
  const note = {
    content,
    important,
  }
  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
    runValidators: true,
    context: 'query'
  })
      if (!updatedNote) {
        //throw error for not existing note
        return response.status(404).json({error:'Note not found'})
      }
      response.json(updatedNote)
})

module.exports = notesRouter;
