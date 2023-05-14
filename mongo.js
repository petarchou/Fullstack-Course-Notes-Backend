const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];

const url =
    `mongodb+srv://admin:${password}@cluster01-fullstackopen.dksmkwb.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url)
.catch(err => {
    console.log('Connection to database failed');
    console.log(err.message);
    process.exit(1);
})

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

// const note = new Note({
//     content: '0GET and POST are the most important methods of HTTP protocol',
//     important: true,
// });

// note.save()
//     .then(result => {
//         console.log('note saved!');
//         mongoose.connection.close();
//     });

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note);
    })
    mongoose.connection.close();
})
