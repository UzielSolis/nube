import { Router, Request, Response } from 'express';
import aws from 'aws-sdk';

aws.config.update({
    region: process.env._REGION,
    credentials: {
        accessKeyId: process.env._aws_ACCESS_KEY_ID,
        secretAccessKey: process.env._aws_SECRET,
        sessionToken: process.env._aws_SESSION_TOKEN
    }
});

const dynamoDb = new aws.DynamoDB.DocumentClient();

export class ProductosControllers {

    async getProductos(req: Request, res: Response) {
        const tableName = 'Productos';
        const params = {
            TableName: tableName
        };

        try {
            const data = await dynamoDb.scan(params).promise();
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json({ message: 'Error al obtener los productos', error: error.message });
        }
    }

    async getProductoById(req: Request, res: Response) {
        const tableName = 'Productos';
        const params = {
            TableName: tableName,
            Key: { id: Number(req.params.id) }
        };
    
        try {
            const data = await dynamoDb.get(params).promise();
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json({ message: 'Error al obtener el producto', error: error.message });
        }
    }

    async createProducto(req: Request, res: Response) {
        const tableName = 'Productos';
        const data = {
            id: req.body.id,
            nombre: req.body.nombre,
            unidad: req.body.unidad,
            precio: req.body.precio,
        };

        const params = {
            TableName: tableName,
            Item: data,
        };
    
        try {
            await dynamoDb.put(params).promise();
            res.status(201).json({ message: 'Producto creado correctamente', data });
        } catch (error) {
            res.status(400).json({ message: 'Error al crear el producto', error: error.message });
        }
    }

    // Actualizar producto
    async updateProducto(req: Request, res: Response) {
        const tableName = 'Productos';
        const params = {
            TableName: tableName,
            Key: { id: Number(req.params.id) },
            UpdateExpression: 'set nombre = :n, unidadMedida = :u, precioBase = :p',
            ExpressionAttributeValues: {
                ':n': req.body.nombre,
                ':u': req.body.unidadMedida,
                ':p': req.body.precioBase
            },
            ReturnValues: 'UPDATED_NEW'
        };
    
        try {
            const data = await dynamoDb.update(params).promise();
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json({ message: 'Error al actualizar el producto', error: error.message });
        }
    }

    async deleteProducto(req: Request, res: Response) {
        const tableName = 'Productos';
        const params = {
            TableName: tableName,
            Key: { id: Number(req.params.id) }
        };
    
        try {
            await dynamoDb.delete(params).promise();
            return { message: 'Producto eliminado' };
        } catch (error) {
            throw new Error('Error al eliminar el producto: ' + error);
        }
        }
}