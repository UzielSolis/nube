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

export class ClientControllers {

    createClient(req: Request, res: Response) {
        const tableName = 'Clientes';

        const data = {
            id: req.body.id,
            razonSocial: req.body.razonSocial,
            nombreComercial: req.body.nombreComercial,
            correo: req.body.correoElectronico
        };

        const params = {
            TableName: tableName,
            Item: data,
        };

        dynamoDb.put(params)
            .promise()
            .then(() => {
                res.status(201).json({ message: 'User created successfully', data });
            })
            .catch((e: Error) => {
                res.status(400).json({ message: 'Failed to create user', error: e.message });
            });
    }

    async getClient(req: Request, res: Response) {
        const tableName = 'Clientes';
        
        const params = {
            TableName: tableName
        };

        try {
            const data = await dynamoDb.scan(params).promise();
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json({ message: 'Error al obtener los clientes', error: error.message });
        }
    }

    async getClientById(req: Request, res: Response) {
        const tableName = 'Clientes';
        const params = {
            TableName: tableName,
            Key: { id: Number(req.params.id) }
        };

        try {
            const data = await dynamoDb.get(params).promise();
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json({ message: 'Error al obtener el cliente', error: error.message });
        }
    }

    async updateClient(req: Request, res: Response) {
        const tableName = 'Clientes';
        
        const params = {
            TableName: tableName,
            Key: { id: Number(req.params.id) },
            UpdateExpression: 'set razonSocial = :r, nombreComercial = :n, correo = :c',
            ExpressionAttributeValues: {
                ':r': req.body.razonSocial,
                ':n': req.body.nombreComercial,
                ':c': req.body.correo
            },
            ReturnValues: 'UPDATED_NEW'
        };

        try {
            const data = await dynamoDb.update(params).promise();
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json({ message: 'Error al actualizar el cliente', error: error.message });
        }
    }

    async deleteClient(req: Request, res: Response) {
        const tableName = 'Clientes';

        const params = {
            TableName: tableName,
            Key: { id: Number(req.params.id) }
        };

        try {
            await dynamoDb.delete(params).promise();
            res.status(200).json({ message: 'Cliente eliminado correctamente' });
        } catch (error) {
            res.status(400).json({ message: 'Error al eliminar el cliente', error: error.message });
        }      
    }
}