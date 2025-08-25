import { Router } from 'express';
import {
   updateProfilePreferences,
   getOrganizationSettings,
   updateOrganizationSettings,
} from '../controllers/settings.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

// Preferencias de Usuario (Cualquiera autenticado)
router.put('/profile/preferences', updateProfilePreferences);

// Configuración de Organización
router.get('/organization', getOrganizationSettings);
router.put('/organization', requireRole(['admin', 'super_admin']), updateOrganizationSettings);

export default router;
