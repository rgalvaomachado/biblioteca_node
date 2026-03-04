import {Request, Response} from 'express'
import AppDatabase from '../database'
import Product from '../entities/product.entity'
import { validate } from 'class-validator'

class ProductController {
    private productRepository

    constructor(){
        this.productRepository = AppDatabase.getRepository(Product)
    }

    findAll = async (request: Request, response: Response) => {
        const products = await this.productRepository.find()

        return response.status(200).send({
            products: products
        })
    }

    findOne = async (request: Request, response: Response) => {
        const uuid = request.params.uuid
        const product = await this.productRepository.findOneBy({uuid})

        if (product) {
            return response.status(200).send({
                product: product,
                message: "Produto recuperado com sucesso"
            })
        } else {
            return response.status(404).send({
                message: "Produto não encontrado"
            })
        }
    }

    create = async (request: Request, response: Response) => {
        const newProduct = new Product
        newProduct.name = request.body.name
        newProduct.description = request.body.description

        const errors = await validate(newProduct)

        if (errors.length > 0) {
            return response.status(422).send({
                errors: errors
            })
        }

        const product = await this.productRepository.save(newProduct)

        return response.status(201).send({
            product: product,
            message: 'Produto criado com sucesso'
        })
    }

    update = async (request: Request, response: Response) => {
        const uuid = request.params.uuid
        const editProduct = await this.productRepository.findOneBy({uuid})

        if (editProduct) {
            editProduct.name = request.body.name
            editProduct.description = request.body.description

            try {
                const product = await this.productRepository.save(editProduct)

                return response.status(200).send({
                    product: product,
                    message: "Produto editado com sucesso"
                })
            } catch {
                return response.status(204).send({
                    message: "Erro ao editar"
                })
            }
        } else {
            return response.status(404).send({
                message: "Produto não encontrado"
            })
        }

    }

    delete = async (request: Request, response: Response) => {
        const uuid = request.params.uuid
        const deleteProduct = await this.productRepository.findOneBy({uuid})

        if (deleteProduct) {
            try {
                await this.productRepository.delete(uuid)
                return response.status(204).send({
                    message: "Produto deletado com sucesso"
                })
            } catch (error) {
                return response.status(404).send({
                    message: "Erro ao deletar"
                })
            }
           
        } else {
            return response.status(404).send({
                message: "Produto não encontrado"
            })
        }
    }
}

export default new ProductController