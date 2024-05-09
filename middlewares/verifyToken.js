const jwt = require("jsonwebtoken");



// verify token 
function verifyToken(req, res, next) {
    // Get token from header if it exists. If not, return a 403 forbidden error
    let token = req.headers.token;   
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
    
    try {
        // Verify the token with our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add the decoded user data to the request so that we can access it in other routes
        req.user = decoded;
        
        if (req.params.id != req.user.id &&  !req.user.isAdmin ) {
          return res
            .status(401)
            .json({ message: "You don't have permission to perform this action" });
        }
        next();
    } catch (err) {
        console.error(err);
        // Return a 403 forbidden error upon verification failure
        res.status(403).send({ auth: false, message: 'Failed to authenticate token.' })
    }
};




// verify Token & Admin
function verifyTokenAndAdmin(res, req, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "you are not allowed, only admin" });
    }
  });
}

module.exports = { verifyToken };
