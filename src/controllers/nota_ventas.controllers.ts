import { Request, Response } from 'express';
import aws from 'aws-sdk';
import PDFDocument from 'pdfkit';
import upload from '../middlewares/upload-s3';
import { PassThrough } from 'stream';

aws.config.update({
    region: process.env._REGION,
    credentials: {
        accessKeyId: process.env._AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env._AWS_SECRET,
        sessionToken: process.env._AWS_SESSION_TOKEN
    }
});

const dynamoDb = new aws.DynamoDB.DocumentClient();
const notification = new aws.SNS();
const s3 = new aws.S3();
const arn = process.env._ARN;

// Función para enviar notificaciones
async function notify(endpoint: string): Promise<void> {
    const params = {
        Message: `Tu nota de venta ha sido creada: ${endpoint}`,
        Subject: 'Nota de venta',
        TopicArn: arn,
    };

    try {
        await notification.publish(params).promise();
    } catch (error) {
        throw new Error('Error al enviar la notificación');
    }
}

// Función para generar el PDF de la nota de venta
async function generateNotaVentaPDF(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        // Contenido del PDF
        doc.fontSize(16).text(`Nota de Venta: ${data.id}`);
        doc.fontSize(12).text(`Cliente: ${data.cliente}`);
        doc.text(`Dirección de Facturación: ${data.direccionFacturacion}`);
        doc.text(`Dirección de Envío: ${data.direccionEnvio}`);
        doc.text(`Total: $${data.total}`);
        doc.end();
    });
}

// Función para subir el PDF a S3 (usando el middleware ya configurado)
async function uploadPDFToS3(id: string, pdfBuffer: Buffer) {
    const params = {
        Bucket: process.env.BUCKET_NAME,  // Ya está definido en el middleware
        Key: `notas-venta/${id}.pdf`,     // Nombre del archivo PDF en S3
        Body: pdfBuffer,
        ContentType: 'application/pdf',
    };

    return s3.upload(params).promise();
}

export class NotaVentaController {

    // Crear una nota de venta, generar PDF, subir a S3 y notificar
    async createNotaVenta(req: Request, res: Response) {
        const tableName = 'NotasVenta';
        const data = {
            id: req.body.id,
            cliente: req.body.cliente,
            direccionFacturacion: req.body.direccionFacturacion,
            direccionEnvio: req.body.direccionEnvio,
            total: req.body.total,
        };

        const params = {
            TableName: tableName,
            Item: data,
        };

        const endpoint = `http://${process.env._URL}/notas-venta/${data.id}`;

        try {
            // Guardar la nota de venta en DynamoDB
            await dynamoDb.put(params).promise();

            // Generar PDF de la nota de venta
            const pdfBuffer = await generateNotaVentaPDF(data);

            // Subir PDF a S3
            const s3Response = await uploadPDFToS3(data.id, pdfBuffer);

            // Enviar notificación con el enlace del PDF en S3
            await notify(endpoint);

            res.status(200).json({
                message: 'Nota de venta creada, PDF subido a S3, y notificación enviada',
                data,
                pdfUrl: endpoint,
            });
        } catch (error) {
            res.status(400).json({
                message: 'Error al crear la nota de venta',
                error: error.message,
            });
        }
    }

    // Crear el contenido de la nota de venta
    async createContenidoNotaVenta(req: Request, res: Response) {
        const tableNameContent = 'ContenidoNotasVenta';
        const data = {
            id: req.body.id,
            producto: req.body.producto,
            cantidad: req.body.cantidad,
            precioUnitario: req.body.precioUnitario,
            importe: req.body.importe,
            notaVentaId: req.body.notaVentaId,
        };

        const params = {
            TableName: tableNameContent,
            Item: data,
        };

        try {
            await dynamoDb.put(params).promise();
            res.status(200).json({ message: 'Contenido de la nota de venta creado', data });
        } catch (error) {
            res.status(400).json({ message: 'Error al crear el contenido de la nota de venta', error: error.message });
        }
    }
}
