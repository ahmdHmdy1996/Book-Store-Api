const logger = (req,res,next) => {
console.log(`Method: ${req.method} URL: ${req.url}`);  // Printing the request method and url in the log file
    let logData = `${new Date()} \t ${req.method}\t${req.url}\t`;
    req.requestTime = new Date().toISOString();   // Adding a new property to store time of incoming requests
    if(req.method === 'POST'){                      // If it is POST request then add data to the log also
        logData += JSON.stringify(req.body);         // Convert json object into string format for logging
    }
    console.log(logData);                              // Logging the complete details of each request
    next();                                           // Moving to the next middleware function
}
module.exports = logger;