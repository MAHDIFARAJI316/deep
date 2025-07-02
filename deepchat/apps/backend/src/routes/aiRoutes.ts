import { Router } from 'express';
import { 
    getAIReplyHandler,
    getAIOnboardingQuestionsHandler,
    submitAIOnboardingAnswersHandler,
    toggleAIHandler,
} from '@backend/controllers/aiController';
import { protect } from '@backend/middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/onboarding', getAIOnboardingQuestionsHandler);
router.post('/onboarding', submitAIOnboardingAnswersHandler);
router.post('/reply', getAIReplyHandler);
router.patch('/toggle/:lineId', toggleAIHandler);

export default router; 