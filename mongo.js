/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('Please provide the password as an argument: node mongo.js <password>')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ngange:${password}@cluster0.cg1sj.mongodb.net/phonebook-db?retryWrites=true&w=majority`
mongoose
	.connect(url)

mongoose.connection.on('connected', () => {
	console.log('mongoose is connected!!!')
})

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
	name: process.argv[3],
	number: process.argv[4],
})

person.save().then(result => {
	console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
})

Person.find({}).then(result => {
	console.log('Phonebook:')
	result.forEach(person => {
		console.log(`${person.name} ${person.number}`)
	})
	mongoose.connection.close()
})