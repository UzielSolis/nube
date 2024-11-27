import { Router, Request, Response } from 'express';
import { ClientControllers } from '../controllers/client.controllers';

const router = Router();
const clientControllers = new ClientControllers();

router.get('', clientControllers.getClient);

router.get('/:id', clientControllers.getClientById);

router.post('', clientControllers.createClient);

router.put('/:id', clientControllers.updateClient);

router.delete('/:id', clientControllers.deleteClient);

export default router;
