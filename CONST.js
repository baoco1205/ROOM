const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
const KEY_TOKEN = { keyToken: "keyToken2" };
const ROLE = {
  USER: 1,
  MANAGER: 2,
  ADMIN: 3,
};
const DELETE = {
  UNDELETED: 0,
  DELETED: 1,
};
const ROOM = {
  OPEN: 0,
  CLOSE: 1,
};
const REQUEST = {
  OFF: 0,
  ON: 1,
  DOING: 2,
};
const SESSION = { MORNING: 0, EVENING: 1 };
//Map<Object,Object> maps = {'key':value}
const CHECKSCHEMA = {
  CREATESCHEMA: Joi.object({
    date: Joi.date().format("YYYY-MM-DD").required(),
    session: Joi.number().valid(0, 1).required(),
    numberCustomer: Joi.number().required(),
    // status: Joi.number().required(),
    floor: Joi.number().valid(1, 2, 3, 4, 5).required(),
  }),
  UPDATESCHEMA: Joi.object({
    date: Joi.date().format("YYYY-MM-DD").required(),
    session: Joi.number().valid(SESSION.MORNING, SESSION.EVENING).required(),
    floor: Joi.number().valid(1, 2, 3, 4, 5).required(),
    _id: Joi.string().required(),
  }),
  CANCELSCHEMA: Joi.object({
    date: Joi.date().format("YYYY-MM-DD").required(),
    session: Joi.number().valid(0, 1).required(),
    // status: Joi.number().required(),
    floor: Joi.number().valid(1, 2, 3, 4, 5).required(),
    status: Joi.number().valid(0, 1, 2),
  }),
};

module.exports = {
  KEY_TOKEN,
  ROLE,
  DELETE,
  ROOM,
  REQUEST,
  SESSION,
  CHECKSCHEMA,
};
