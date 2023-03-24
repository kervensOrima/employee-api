


module.exports = (message, timestamp, code, error) => {
    return {
        message: message,
        timestamp: timestamp ,
        code: code ,
        error: error
    }
}