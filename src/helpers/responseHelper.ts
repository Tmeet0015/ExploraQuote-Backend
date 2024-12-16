require('dotenv').config()
// On Error Response
export const CreateErrorResponse = (
    field: string,
    error: string,
    type: string,
    data?: any
) => {
    return {
        status: 'error',
        success: false,
        errors: {
            [field]: {
                type: type,
                message: error,
                data: data
            },
        },
    }
}

// On Success Response
export const CreateSuccessResponse = (message: string, data?: any) => {

    return {
        status: 'success',
        success: true,
        message: message,
        data: data                


    }
}