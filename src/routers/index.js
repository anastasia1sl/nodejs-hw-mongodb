import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import waterRouter from './water.js';
import vodaRouter from './voda.js';
import testRouter from './test.js';

const router = Router();

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);
router.use('/water', waterRouter);
router.use('/voda', vodaRouter);
router.use('/test', testRouter);

export default router;
