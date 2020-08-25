const { Sequelize, DataTypes, Model } = require("sequelize");

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
class Listing extends Model {}

Listing.init(
  {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    description: {
      type: DataTypes.TEXT,
      // allowNull defaults to true
    },
    url: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    notes: {
      type: DataTypes.TEXT,
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "listing", // We need to choose the model name
  }
);

Listing.belongsTo(User);
User.hasMany(Listing);

class Company extends Model {}
Company.init(
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "company", // We need to choose the model name
  }
);

Listing.belongsTo(Company);
Company.hasMany(Listing);

// Listing.sync({ force: true });
// Company.sync({ force: true });
// Listing.sync({ force: false }).then(function (err) {
//   if (err) {
//     console.log("An error occur while creating table");
//   } else {
//     console.log("Item table created successfully");
//   }
// });
// Company.sync({ force: false }).then(function (err) {
//   if (err) {
//     console.log("An error occur while creating table");
//   } else {
//     console.log("Item table created successfully");
//   }
// });
// await sequelize.sync({ force: true });

exports.sequelize = sequelize;
exports.User = User;
exports.Listing = Listing;
exports.Company = Company;
