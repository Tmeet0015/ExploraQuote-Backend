import { AppDataSource } from './data-source'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import mainRouter from './routes/index.routes'
import http from 'http'
import dotenv from "dotenv"

dotenv.config()

AppDataSource.initialize()
    .then(async () => {
        console.log('Connected To MySql')

        const app = express()
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader(
                'Access-Control-Allow-Methods',
                'GET, POST, OPTIONS, PUT, PATCH, DELETE'
            )
            res.setHeader(
                'Access-Control-Allow-Headers',
                'X-Requested-With,content-type'
            )
            res.setHeader('Access-Control-Allow-Credentials', true as any)
            next()
        })
        app.use(cors())
        app.use(express.static('public'))

        app.get('/', (req, res) => {
            res.json({ message: 'Welcome to Explore Tours-Travel backend.' })
        })
        app.use('/api', mainRouter)
        app.use(express.static(__dirname + '/'))

        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof SyntaxError) {
                // Handle other errors
                console.error(err.stack);
                res.status(500).send('Internal Server Error!!!');
            }
        });

        const options: any = {
            // key: fs.readFileSync('private.key'),
            // cert: fs.readFileSync('certificate.crt'),
            // ca: [fs.readFileSync('ca_bundle.crt')],
            requestCert: false,
            rejectUnauthorized: false,
        }

        const server = http.createServer(options, app)
        server.listen(process.env.APP_PORT || 8080, () => {
            console.log(`Now running on port ${process.env.APP_PORT}`);
        });

    })
    .catch((error) => console.log(error))