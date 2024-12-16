import express from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../data-source';
import {  User } from '../entity/users';
import { CreateErrorResponse } from '../helpers/responseHelper';

const UserRepository = AppDataSource.getRepository(User);

export const authMiddleware = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): unknown => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader?.split(' ')[1]
        if (!token) {
            return res.status(403).send('Unauthorized Access')
        }
        const tokenSecret = process.env.SECRET_KEY
        if (tokenSecret && token) {
            jwt.verify(token, tokenSecret, async (err) => {
                if (err) {
                    return res.status(403).send('Unauthorized Access!')
                }
                const token_data: any = jwt.decode(token);

                const isAuth = await UserRepository.findOne({ where: { id: parseInt(token_data.id), is_active: true } });

                if (isAuth == null) {
                    return res
                        .status(403)
                        .send(
                            CreateErrorResponse(
                                'Error',
                                'UnAuthorized Action!',
                                `UnAuthorized`
                            )
                        )
                }
                res.locals.token = token;
                next()
            })
        }
    } catch (error) {
        return res
            .status(500)
            .send(
                CreateErrorResponse(
                    'Error',
                    'Something Went Wrong!!',
                    'Something Wrong'
                )
            )
    }
}
