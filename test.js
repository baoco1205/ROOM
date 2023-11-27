const jwt = require("jsonwebtoken");
const token = "$2b$10$QiXJkF07x.q3GDYebejb9OdkzwdJnHNK5YxcEYuK.ri8zc/XxtPxy";
const decod = jwt.verify(token, "keyToken2");
console.log(decod);
