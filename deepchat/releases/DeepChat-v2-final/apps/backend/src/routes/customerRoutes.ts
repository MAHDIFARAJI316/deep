import { Router } from 'express';
import { getCustomersHandler, getCustomerByIdHandler, updateCustomerHandler } from '@backend/controllers/customerController';
import { protect } from '@backend/middlewares/authMiddleware';

const router = Router();

// All CRM routes are protected
router.use(protect);

router.get('/', getCustomersHandler);
router.get('/:id', getCustomerByIdHandler);
router.patch('/:id', updateCustomerHandler);

export default router; 