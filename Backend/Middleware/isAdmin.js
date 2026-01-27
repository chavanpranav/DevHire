const isAdmin = (req, res, next) => {

    if(req.headers.role === "admin") {
        next();
    }
    else {
        res.status(403).json({ message: "Admin only" });
    }
};

module.exports = isAdmin;