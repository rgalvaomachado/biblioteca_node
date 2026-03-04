import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

import productController from './controllers/product.controller'
import authorController from './controllers/author.controller'
import subjectController from './controllers/subject.controller'
import bookController from './controllers/book.controller'

const port = process.env.PORT || 8080

const app = express()
app.use(express.json())

app.get('/api/products', productController.findAll)
app.get('/api/products/:uuid', productController.findOne)
app.post('/api/products', productController.create)
app.put('/api/products/:uuid', productController.update)
app.delete('/api/products/:uuid', productController.delete)

app.get('/api/authors', authorController.findAll)
app.get('/api/authors/:uuid', authorController.findOne)
app.post('/api/authors', authorController.create)
app.put('/api/authors/:uuid', authorController.update)
app.delete('/api/authors/:uuid', authorController.delete)

app.get('/api/subjects', subjectController.findAll)
app.get('/api/subjects/:uuid', subjectController.findOne)
app.post('/api/subjects', subjectController.create)
app.put('/api/subjects/:uuid', subjectController.update)
app.delete('/api/subjects/:uuid', subjectController.delete)

app.get('/api/books', bookController.findAll)
app.get('/api/books/:uuid', bookController.findOne)
app.get('/api/books/author/:uuid', bookController.findByAuthor)
app.get('/api/books/subject/:uuid', bookController.findBySubject)
app.post('/api/books', bookController.create)
app.put('/api/books/:uuid', bookController.update)
app.delete('/api/books/:uuid', bookController.delete)

app.get('/', function (request, response) {
    response.send('Hello World')
})

// app.listen(port, () => {
app.listen(port, function () {
    console.log(`servidor executando na porta ${port}`)
})