const jwt = require("jsonwebtoken");
require("dotenv").config();

const fetchUser = async (req, res, next) => {
  const token = await req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "not autherised" });
  }
  const jwt_token = process.env.JWT_SECRET;
  try {
    const data = jwt.verify(token, "hhhhhh");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "not autherised 2" });
  }
};

module.exports = fetchUser;
