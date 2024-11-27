import { Router, Request, Response } from 'express';
import { DomicilioController } from '../controllers/domicilio.controllers'; 

const router = Router();
const domicilioController = new DomicilioController();

router.get('', domicilioController.getDomicilios);

router.get('/:id', domicilioController.getDomicilioById);

router.post('', domicilioController.createDomicilio);

router.put('/:id', domicilioController.updateDomicilio);

router.delete('/:id', domicilioController.deleteDomicilio);

export default router;
