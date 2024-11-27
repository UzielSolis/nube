import { Router, Request, Response } from 'express';
import clienteRoutes from './clientes';
import domicilioRoutes from './domicilios';
import productos from './productos';
import notas_venta from './nota_venta';

const router = Router();

router.use("/clientes", clienteRoutes);
router.use("/domicilios", domicilioRoutes);
router.use("/productos", productos);
router.use("/notas-venta", notas_venta);

export default router;