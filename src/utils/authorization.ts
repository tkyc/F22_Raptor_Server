import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Request, Response } from 'express';

//If refresh token, set tokenId otherwise null
export const issueToken = (token: String, userId: number, tokenId: number = null) => {
    switch(token) {
        case "ACCESS":
            return jwt.sign({
                iss: "F22",
                sub: userId
            }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "10s"});

        case "REFRESH":
            return jwt.sign({
                iss: "F22",
                sub: userId,
                ver: tokenId
            }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "2m"});
    }
};

export const validateAccessToken = async (req: Request, res: Response, next): Promise<void> => {
    const accessToken: String = req.headers["authorization"].split(" ")[1];

    if (!accessToken) return res.status(401).send("Unauthorized");

    try {
        const decoded: any = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.sub;
        next();
    } catch (exception) {
        console.log(exception.message);
        res.status(401).send(exception.message);
    }
};