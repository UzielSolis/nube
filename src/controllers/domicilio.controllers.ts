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

export class DomicilioController {

    async getDomicilios(req: Request, res: Response) {
        const tableName = 'Domicilios';
        const params = {
            TableName: tableName
        };

        try {
            const data = await dynamoDb.scan(params).promise();
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json({ message: 'Error al obtener los domicilios', error: error.message });
        }
    }

    async getDomicilioById(req: Request, res: Response) {
        const tableName = 'Domicilios';
        const params = {
            TableName: tableName,
            Key: { id: Number(req.params.id) }
        };
    
        try {
            const data = await dynamoDb.get(params).promise();
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json({ message: 'Error al obtener el domicilio', error: error.message });
        }
    }

    async createDomicilio(req: Request, res: Response) {
        const tableName = 'Domicilios';
        const data = {
            id: req.body.id,
            domicilio: req.body.domicilio,
            colonia: req.body.colonia,
            municipio: req.body.municipio,
            estado: req.body.estado,
            tipoDireccion: req.body.tipoDireccion
        };

        const params = {
            TableName: tableName,
            Item: data,
        };
    
        try {
            await dynamoDb.put(params).promise();
            res.status(201).json({ message: 'Domicilio creado correctamente', data });
        } catch (error) {
            res.status(400).json({ message: 'Error al crear el domicilio', error: error.message });
        }
    }

    // Actualizar domicilio
    async updateDomicilio(req: Request, res: Response) {
        const tableName = 'Domicilios';
        const params = {
            TableName: tableName,
            Key: { id: Number(req.params.id) },
            UpdateExpression: 'set domicilio = :d, colonia = :c, municipio = :m, estado = :e, tipoDireccion = :t',
            ExpressionAttributeValues: {
            ':d': req.body.domicilio,
            ':c': req.body.colonia,
            ':m': req.body.municipio,
            ':e': req.body.estado,
            ':t': req.body.tipoDireccion
            },
            ReturnValues: 'UPDATED_NEW'
        };
    
        try {
            const data = await dynamoDb.update(params).promise();
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json({ message: 'Error al actualizar el domicilio', error: error.message });
        }
    }

    async deleteDomicilio(req: Request, res: Response) {
        const tableName = 'Domicilios';
        const params = {
            TableName: tableName,
            Key: { id: Number(req.params.id) }
        };
    
        try {
            await dynamoDb.delete(params).promise();
            res.status(200).json({ message: 'Domicilio eliminado correctamente' });
        } catch (error) {
            res.status(400).json({ message: 'Error al eliminar el domicilio', error: error.message });
        }
    }
}