import { unlink } from 'fs'
const multer = require('multer')


export const unlinkFile = (file: string) => {
    unlink(file, (err) => {
        if (err) throw err
        console.log(file + ' was deleted')
    })
}

