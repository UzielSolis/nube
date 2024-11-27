import { Router, Request, Response } from 'express';
import { NotaVentaController } from '../controllers/nota_ventas.controllers';
import { S3Client, GetObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../middlewares/upload-s3';

const router = Router();
const notaVentaController = new NotaVentaController();

const BUCKET_NAME = process.env.BUCKET_NAME;

router.post('', notaVentaController.createNotaVenta);
router.post('/contenido', notaVentaController.createContenidoNotaVenta);
router.get('/:nombreArchivo', async (req: Request, res: Response) => {
    const nombreArchivo = req.params.nombreArchivo;
    console.log('aqui');

    try {
        console.log('aqui1');
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: nombreArchivo
        });

        // Obtener una URL firmada para la descarga del archivo
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL válida por 1 hora
        res.redirect(signedUrl);
    } catch (error) {
        res.status(404).json({ message: 'Archivo no encontrado en el bucket', error });
    }
});

router.get('/hola', (req: Request, res: Response) => {
    res.send('Hola desde notas de venta');
});

export default router;
