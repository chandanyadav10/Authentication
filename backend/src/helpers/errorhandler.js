// error handler middleware
const errorHandler = (err, req, res, next) => {
    // check if response headers have already been sent to the client
    if(res.headersSent){
        // if true, pass the error to the next error-handling middleware
        return next(err);
    }

    // set response status code
    const statusCode = res.statusCode && res.statusCode >=400    ? res.statusCode : 500;
    res.status(statusCode);
    
    // log error stack trace to the console if not in production --> for debugging
    if(process.env.NODE_ENV !== "production"){
        console.log(err);
    }

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
}

export default errorHandler