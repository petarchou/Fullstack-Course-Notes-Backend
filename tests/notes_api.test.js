const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Note = require('../models/note')
const helper = require('./test_helper')
const logger = require('../utils/logger')

const api = supertest(app)


const initialNotes = helper.initialNotes

beforeEach(async () => {
    await Note.deleteMany({})
    console.log('cleared')
    const noteObjects = initialNotes.map(note => new Note(note))
    const promiseArray = noteObjects.map(note => note.save())
    await Promise.all(promiseArray)
    console.log('done')
    logger.info('Test DB Initialized')
})

test('notes are returned as json', async () => {
    console.log('entered test')
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
    const response = await api
        .get('/api/notes')

    expect(response.body).toHaveLength(initialNotes.length)
})

test('a note exists that says JS is fun', async () => {
    const response = await api
        .get('/api/notes/')

    const contents = response.body.map(r => r.content)

    expect(contents).toContain('JavaScript is fun')
})

test('a valid note can be added', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }
  
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(initialNotes.length + 1)
  
    const contents = notesAtEnd.map(r => r.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('note without content is not added', async () => {
    const newNote = {
      important: true
    }
  
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)
  
    const response = await api.get('/api/notes')
  
    expect(response.body).toHaveLength(initialNotes.length)
  })

afterAll(async () => {
    await mongoose.connection.close()
})