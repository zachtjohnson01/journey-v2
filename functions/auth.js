const { Sequelize, DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");
const { sequelize, User } = require("../db");

// this is a hack to reset DB and create a test user
// await sequelize.sync({ force: true });
// const salt = bcrypt.genSaltSync(10);
// const hash = bcrypt.hashSync("password", salt);
// const user = await User.create({
//   email: "zachtjohnson01@gmail.com",
//   password: hash,
// });

// const count = await User.count();
exports.handler = async (event) => {
  try {
    const { name, pass } = basicAuth(event);
    const user = await User.findOne({
      where: {
        email: {
          [Sequelize.Op.iLike]: name,
        },
      },
    });

    if (user) {
      const passwordsMatch = await bcrypt.compare(pass, user.password);
      if (passwordsMatch) {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.JWT_SECRET
        );
        return {
          statusCode: 200,
          body: token,
        };
      }
    }

    return {
      statusCode: 401,
      body: "Incorrect email/password combination",
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: `We encountered an error: ${error}`,
    };
  }
};
