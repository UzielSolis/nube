import { Router, Request, Response } from 'express';
import { ProductosControllers } from '../controllers/productos.controllers';

const router = Router();
const productosControllers = new ProductosControllers();

router.get('', productosControllers.getProductos);

router.get('/:id', productosControllers.getProductoById);

router.post('', productosControllers.createProducto);

router.put('/:id', productosControllers.updateProducto);

router.delete('/:id', productosControllers.deleteProducto);

export default router;
