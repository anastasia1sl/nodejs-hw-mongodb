import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import waterRouter from './water.js';

const router = Router();

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);
router.use('/water', waterRouter);

export default router;
