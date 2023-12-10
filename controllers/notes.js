const jwt = require('jsonwebtoken')

const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
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

notesRouter.post('/', async (request, response) => {
  const { content, important} = request.body;
  const token = getTokenFrom(request)
  console.log(token)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({
      error: 'Invalid token'
    })
  }

  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content,
    important: important || false,
    user: user.id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', async (request, response) => {
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
    return response.status(404).json({ error: 'Note not found' })
  }
  response.json(updatedNote)
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer')) {
    return authorization.replace('Bearer', '')
  }
  return null
}

module.exports = notesRouter;
