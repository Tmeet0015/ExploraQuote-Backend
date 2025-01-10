import fs from 'fs'
import { AppDataSource } from '../data-source';
import { logs_error } from '../entity/logs_error'
import jwt from 'jsonwebtoken';

const LogErrorRepository = AppDataSource.getRepository(logs_error);


export const writeErrorLog = async (data) => {
    try {

        if (!fs.existsSync('src/logs')) {
            fs.mkdirSync('src/logs', { recursive: true })
        }
        const path =
            './src/logs/' +
            new Date().getDate() +
            '_' +
            (new Date().getMonth() + 1) +
            '_' +
            new Date().getFullYear() +
            '.txt'

        data =
            JSON.stringify(data) +
            '\n------------------------------------------ \n' +
            new Date().toUTCString()
        fs.appendFile(path, data, (err) => {
            if (err) console.log(err)
        })

    } catch (error) {
        console.log(error)
    }

}

export const writeTableErrorLog = async (data) => {
    try {
        const token = data?.token || null;
        let token_data: any

        let obj_log = {
            cameFrom: data?.cameFrom,
            message: data?.data.toString(),
            user: null,
            body : data?.body
        }

        if (token != undefined || token != null) {
            token_data = jwt.decode(token);
            obj_log.user = { id: parseInt(token_data.id) }

        } else
            delete obj_log.user;


        writeErrorLog({
            cameFrom: obj_log.cameFrom,
            data: obj_log.message,
            body : obj_log.body
        });

        await LogErrorRepository.insert(obj_log);



    } catch (error) {
        console.log(error)
    }

}
