import {Request, Response} from 'express'
import AppDatabase from '../database'
import Book from '../entities/book.entity'
import { validate } from 'class-validator'

class BookController {
    private bookRepository

    constructor(){
        this.bookRepository = AppDatabase.getRepository(Book)
    }

    findAll = async (request: Request, response: Response) => {
        const books = await this.bookRepository.find({
            relations: ["author", "subject"]
        })
        
        return response.status(200).send({
            books: books
        })
    }

    findOne = async (request: Request, response: Response) => {
        const uuid = request.params.uuid
        const book = await this.bookRepository.findOne({
            where: {uuid: uuid},
            relations: ["author", "subject"]
        })

        if (book) {
            return response.status(200).send({
                product: book,
                message: "Livro recuperado com sucesso"
            })
        } else {
            return response.status(404).send({
                message: "Livro não encontrado"
            })
        }
    }

    create = async (request: Request, response: Response) => {
        const newBook = new Book
        newBook.name = request.body.name
        newBook.authorUUID = request.body.authorUUID
        newBook.subjectUUID = request.body.subjectUUID

        const errors = await validate(newBook)

        if (errors.length > 0) {
            return response.status(422).send({
                errors: errors
            })
        }

        const product = await this.bookRepository.save(newBook)

        return response.status(201).send({
            product: product,
            message: 'Produto criado com sucesso'
        })
    }

    update = async (request: Request, response: Response) => {
        const uuid = request.params.uuid
        const editBook = await this.bookRepository.findOneBy({uuid})

        if (editBook) {
            editBook.name = request.body.name
            editBook.authorUUID = request.body.authorUUID
            editBook.subjectUUID = request.body.subjectUUID

            try {
                const book = await this.bookRepository.save(editBook)

                return response.status(200).send({
                    book: book,
                    message: "Livro editado com sucesso"
                })
            } catch {
                return response.status(204).send({
                    message: "Erro ao editar"
                })
            }
        } else {
            return response.status(404).send({
                message: "Livro não encontrado"
            })
        }
    }

    delete = async (request: Request, response: Response) => {
        const uuid = request.params.uuid
        const deleteBook = await this.bookRepository.findOneBy({uuid})

        if (deleteBook) {
            try {
                await this.bookRepository.delete(uuid)
                return response.status(204).send({
                    message: "Livro deletado com sucesso"
                })
            } catch (error) {
                return response.status(404).send({
                    message: "Erro ao deletar"
                })
            }
           
        } else {
            return response.status(404).send({
                message: "Livro não encontrado"
            })
        }
    }

    findByAuthor = async (request: Request, response: Response) => {
        const authorUUID = request.params.uuid
        const book = await this.bookRepository.findOneBy({authorUUID})

        if (book) {
            return response.status(200).send({
                product: book,
                message: "Livro recuperado com sucesso"
            })
        } else {
            return response.status(404).send({
                message: "Livro não encontrado"
            })
        }
    }

    findBySubject = async (request: Request, response: Response) => {
        const subjectUUID = request.params.uuid
        const book = await this.bookRepository.findOneBy({subjectUUID})

        if (book) {
            return response.status(200).send({
                product: book,
                message: "Livro recuperado com sucesso"
            })
        } else {
            return response.status(404).send({
                message: "Livro não encontrado"
            })
        }
    }
}

export default new BookController