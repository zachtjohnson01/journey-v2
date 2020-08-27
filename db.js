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
class Listing extends Model {
  async createAndAddContacts(contactsInput) {
    const contacts = await Contact.bulkCreate(contactsInput, {
      returning: true,
    });
    return this.addContacts(contacts);
  }
}

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

class Contact extends Sequelize.Model {}
Contact.init(
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    notes: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
  },
  {
    sequelize,
    modelName: "contact",
  }
);

Listing.belongsToMany(Contact, { through: "listing_contacts" });
Contact.belongsToMany(Listing, { through: "listing_contacts" });

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

// sequelize.sync();

exports.sequelize = sequelize;
exports.User = User;
exports.Listing = Listing;
exports.Company = Company;
exports.Contact = Contact;
