const { Sequelize, DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
  dialectOptions: {
    ssl: true,
  },
});

class User extends Model {}

User.init(
  {
    // Model attributes are defined here
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "user", // We need to choose the model name
  }
);

exports.handler = async (event) => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ force: true });

    // const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync("password", salt);
    // const user = await User.create({
    //   email: "zachtjohnson01@gmail.com",
    //   password: hash,
    // });

    // const count = await User.count();

    // TODO: authenticate our user
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
