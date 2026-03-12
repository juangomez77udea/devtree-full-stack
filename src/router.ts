import { Router } from 'express';
import { body } from 'express-validator'
import { createAccount, getUser, getUserByHandle, login, searchByHandle, updateProfile, uploadImage } from './handlers';
import { handleInputErrors } from './middleware/validation';
import { authenticate } from './middleware/auth';

const router = Router();

/** Autenticación y registro */
router.post('/auth/register',

      body('handle')
            .notEmpty()
            .withMessage('El handle no puede estar vacío'),
      body('name')
            .notEmpty()
            .withMessage('El nombre no puede estar vacío'),
      body('email')
            .isEmail()
            .withMessage('Email no válido'),
      body('password')
            .isLength({ min: 8 })
            .withMessage('La contraseña debe tener al menos 8 caracteres'),
      handleInputErrors,
      createAccount
);

router.post('/auth/login',
      body('email')
            .isEmail()
            .withMessage('Email no válido'),
      body('password')
            .notEmpty()
            .withMessage('El password es obligatorio'),
      login
)

router.get('/user', authenticate, getUser)
router.patch('/user',
      body('handle')
            .notEmpty()
            .withMessage('El handle no puede estar vacío'),
      
      handleInputErrors,
      authenticate,
      updateProfile
)

router.post('/user/image', authenticate, uploadImage)

router.get('/:handle', getUserByHandle)

router.post('/search', 
      body('handle')
      .notEmpty()
      .withMessage('El handle no puede ir vacío'),
      handleInputErrors,
      searchByHandle
)

export default router;