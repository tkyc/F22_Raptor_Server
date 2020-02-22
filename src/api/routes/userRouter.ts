import { Request, Response, Router } from 'express';
import { validateAccessToken } from '../../utils/authorization';
import userController from '../controllers/userController';

const userRouter = Router();

userRouter.post("/accounts/login", userController.loginUser);

userRouter.post("/accounts/register", userController.registerUser);

userRouter.post("/accounts/refresh", userController.refreshUser);

userRouter.get("/accounts/user_details", validateAccessToken, userController.fetchUserDetails);

export default userRouter;