import { Request, Response, Router } from 'express';
import userController from '../controllers/userController';

const userRouter = Router();

userRouter.post("/accounts/login", userController.loginUser);

userRouter.post("/accounts/register", userController.registerUser);

userRouter.post("/accounts/refresh", userController.refreshUser);

export default userRouter;