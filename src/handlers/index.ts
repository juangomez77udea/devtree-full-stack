import type { Request, Response} from 'express';
import { validationResult } from 'express-validator';
import slug from 'slug';    
import User from "../models/User";
import { hashPassword } from '../utils/auth';

export const createAccount = async(req:Request, res:Response) => {

      // Manejo de errores
      let errors = validationResult(req);
      if(!errors.isEmpty()) {
            console.log(errors)
            return res.status(400).json({errors: errors.array()})
      }


      const { email, password } = req.body;

      console.log(email);

      const userExists = await User.findOne({email})
      if(userExists) {
            const error = new Error('El usuario ya existe');
            return res.status(409).json({error : error.message})
      }

      const handle = slug(req.body.handle, '') 
      const handleExists = await User.findOne({handle})
      if(handleExists) {
            const error = new Error('Nombre de usuario no disponible');
            return res.status(409).json({error : error.message})
      }

      const user = new User(req.body);
      user.password =  await hashPassword(password);
      user.handle = handle;

      console.log(slug(handle, ''))

      await user.save();
      res.status(201).send({message: 'Registro exitoso'});
}
