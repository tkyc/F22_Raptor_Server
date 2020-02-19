import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Request, Response } from 'express';

//If refresh token, set tokenId
export const issueToken = (token: String, userId: number, tokenId: number = null) => {
    switch(token) {
        case "ACCESS":
            return jwt.sign({
                iss: "F22",
                sub: userId
            }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1m"});

        case "REFRESH":
            return jwt.sign({
                iss: "F22",
                sub: userId,
                ver: tokenId
            }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "2m"});
    }
};

export const authenticate = (req: Request, __: Response, next) => {

};