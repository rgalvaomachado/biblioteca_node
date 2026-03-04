import {Request, Response} from 'express'
import AppDatabase from '../database'
import Subject from '../entities/subject.entity'
import { validate } from 'class-validator'

class SubjectController {
    private subjectRepository

    constructor(){
        this.subjectRepository = AppDatabase.getRepository(Subject)
    }

    findAll = async (request: Request, response: Response) => {
        const subjects = await this.subjectRepository.find()

        return response.status(200).send({
            subjects: subjects
        })
    }

    findOne = async (request: Request, response: Response) => {
        const uuid = request.params.uuid
        const subject = await this.subjectRepository.findOneBy({uuid})

        if (subject) {
            return response.status(200).send({
                product: subject,
                message: "Assunto recuperado com sucesso"
            })
        } else {
            return response.status(404).send({
                message: "Assunto não encontrado"
            })
        }
    }

    create = async (request: Request, response: Response) => {
        const newSubject = new Subject
        newSubject.name = request.body.name

        const errors = await validate(newSubject)

        if (errors.length > 0) {
            return response.status(422).send({
                errors: errors
            })
        }

        const subject = await this.subjectRepository.save(newSubject)

        return response.status(201).send({
            subject: subject,
            message: 'Assunto criado com sucesso'
        })
    }

    update = async (request: Request, response: Response) => {
        const uuid = request.params.uuid
        const editSubject = await this.subjectRepository.findOneBy({uuid})

        if (editSubject) {
            editSubject.name = request.body.name

            try {
                const subject = await this.subjectRepository.save(editSubject)

                return response.status(200).send({
                    subject: subject,
                    message: "Assunto editado com sucesso"
                })
            } catch {
                return response.status(204).send({
                    message: "Erro ao editar"
                })
            }
        } else {
            return response.status(404).send({
                message: "Assunto não encontrado"
            })
        }

    }

    delete = async (request: Request, response: Response) => {
        const uuid = request.params.uuid
        const deleteSubject = await this.subjectRepository.findOneBy({uuid})

        if (deleteSubject) {
            try {
                await this.subjectRepository.delete(uuid)
                return response.status(204).send({
                    message: "Assunto deletado com sucesso"
                })
            } catch (error) {
                return response.status(404).send({
                    message: "Erro ao deletar"
                })
            }
           
        } else {
            return response.status(404).send({
                message: "Assunto não encontrado"
            })
        }
    }
}

export default new SubjectController