import multer from 'multer'
import path from 'path'
import fs from 'fs'

let storage: any;
try {
    storage = multer.diskStorage({
        destination: (
            req: Express.Request,
            file: Express.Multer.File,
            callback: (error: Error | null, destination: string) => void
        ) => {
            let directoryPath: any;
            if (file.fieldname === 'location_img') {
                directoryPath = path.join(__dirname, '../public/location')
            }
            if (file.fieldname === 'activities_img') {
                directoryPath = path.join(__dirname, '../public/activities')
            }
           

            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true })
            }
            callback(null, directoryPath)
        },
        filename: (
            req: Express.Request,
            file: Express.Multer.File,
            callback: (errror: Error | null, destination: string) => void
        ) => {
            if (file.originalname) {
                const extension: Array<string> = file.originalname.split('.')

                callback(
                    null,
                    `${Date.now() + "_" + extension[0]}.${extension[1]}`
                )
            }
        },
    })
} catch (err) {
    console.log('****ERROR****', err)
}
export const uploadFile = multer({
    storage: storage,
})