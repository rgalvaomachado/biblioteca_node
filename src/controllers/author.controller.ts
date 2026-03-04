import {Request, Response} from 'express'
import AppDatabase from '../database'
import Author from '../entities/author.entity'
import { validate } from 'class-validator'

class AuthorController {
    private authorRepository

    constructor(){
        this.authorRepository = AppDatabase.getRepository(Author)
    }

    findAll = async (request: Request, response: Response) => {
        const authors = await this.authorRepository.find()

        return response.status(200).send({
            authors: authors
        })
    }

    findOne = async (request: Request, response: Response) => {
        const uuid = request.params.uuid
        const author = await this.authorRepository.findOneBy({uuid})

        if (author) {
            return response.status(200).send({
                product: author,
                message: "Autor recuperado com sucesso"
            })
        } else {
            return response.status(404).send({
                message: "Autor não encontrado"
            })
        }
    }

    create = async (request: Request, response: Response) => {
        const newAuthor = new Author
        newAuthor.name = request.body.name

        const errors = await validate(newAuthor)

        if (errors.length > 0) {
            return response.status(422).send({
                errors: errors
            })
        }

        const author = await this.authorRepository.save(newAuthor)

        return response.status(201).send({
            author: author,
            message: 'Autor criado com sucesso'
        })
    }

    update = async (request: Request, response: Response) => {
        const uuid = request.params.uuid
        const editAuthor = await this.authorRepository.findOneBy({uuid})

        if (editAuthor) {
            editAuthor.name = request.body.name

            try {
                const author = await this.authorRepository.save(editAuthor)

                return response.status(200).send({
                    author: author,
                    message: "Autor editado com sucesso"
                })
            } catch {
                return response.status(204).send({
                    message: "Erro ao editar"
                })
            }
        } else {
            return response.status(404).send({
                message: "Autor não encontrado"
            })
        }

    }

    delete = async (request: Request, response: Response) => {
        const uuid = request.params.uuid
        const deleteProductAuthor = await this.authorRepository.findOneBy({uuid})

        if (deleteProductAuthor) {
            try {
                await this.authorRepository.delete(uuid)
                return response.status(204).send({
                    message: "Autor deletado com sucesso"
                })
            } catch (error) {
                return response.status(404).send({
                    message: "Erro ao deletar"
                })
            }
           
        } else {
            return response.status(404).send({
                message: "Autor não encontrado"
            })
        }
    }
}

export default new AuthorController