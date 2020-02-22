import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { issueToken } from '../../utils/authorization';

//Path to read .env at root of project
dotenv.config({path: resolve(__dirname, "../../../.env")});

const userController = {

    loginUser: async (req: Request, res: Response): Promise<void> => {
        const { username, password }: { username: String, password: String } = req.body;
        try {
            const user: any = (await req.db.execute("SELECT users.id, users.username, users.password, users.tokenId FROM users WHERE username = ?", [username]))[0][0];
            const isMatch: Boolean = await bcrypt.compare(password, user.password);

            if (user && isMatch) {
                res.cookie("refresh_token", issueToken("REFRESH", user.id, user.tokenId), {httpOnly: true});
                res.status(200).send(issueToken("ACCESS", user.id));
            } else {
                res.status(400).send("Invalid credentials.");
            }

        } catch (exception) {
            console.log(exception.message);
            res.status(500).send(exception.message);
        }
    },

    registerUser: async (req: Request, res: Response): Promise<void> => {
        const { username, password, firstname, lastname, email, birthday }:
              { username: String, password: String, firstname: String, lastname: String, email: String, birthday: Date } = req.body;

        try {
            const usernameIsAvailable: Boolean = (await req.db.execute("SELECT * FROM users where users.username = ?", [username]))[0].length == 0;

            if (usernameIsAvailable) {
                const hashedPassword: String = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

                await req.db.execute("INSERT INTO users (username, password, firstname, lastname, email, birthday) VALUES (?, ?, ?, ?, ?, ?)",
                                     [username, hashedPassword, firstname, lastname, email, birthday]);

                res.status(201).send("Registration successful.");
            } else {
                res.status(409).send("Username taken.");
            }

        } catch (exception) {
            console.log(exception.message);
            res.status(500).send(exception.message);
        }
    },

    refreshUser: async (req: Request, res: Response): Promise<void> => {
        const refreshToken: String = req.cookies["refresh_token"];

        if (!refreshToken) {
            res.status("401").send("Unauthorized.");
        } else {
            try {
                const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const user: any = (await req.db.execute("SELECT users.id, users.username, users.tokenId FROM users WHERE id = ?", [decoded.sub]))[0][0];

                if (user) {
                    //Compare issued token version with version recorded in database
                    if (decoded.ver !== user.tokenId) return res.status("401").send("Unauthorized. Version does not match.");

                    res.cookie("refresh_token", issueToken("REFRESH", decoded.sub, user.tokenId), {httpOnly: true});
                    res.status(200).send(issueToken("ACCESS", decoded.sub));
                } else {
                    res.status("401").send("User not found. Unauthorized.");
                }

            } catch (exception) {
                console.log(exception.message);
                res.status("401").send(exception.message);
            }
        }
    },

    fetchUserDetails: async (req: Request, res: Response): Promise<void> => {
        try {
            const { username, firstname, lastname, email, birthday }: 
                  { username: String, firstname: String, lastname: String, email: String, birthday: Date } 
                  = (await req.db.execute("SELECT * FROM users WHERE users.id = ?", [req.userId]))[0][0];

            res.status(200).json({username: username, firstname: firstname, lastname: lastname, email: email, birthday: birthday});
        } catch (exception) {
            console.log(exception.message);
            res.status(500).send(exception.message);
        }
    }
};

export default userController;

//JSON format for registering user
//{
//	"username": "a",
//	"password": "a",
//	"firstname": "a",
//	"lastname": "a",
//	"email": "a@test.com",
//	"birthday": "1900-01-01"
//}