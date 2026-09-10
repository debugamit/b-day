const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: false
});

const Surprise = sequelize.define('Surprise', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    recipientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subtitle: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    countdownDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    traits: {
        type: DataTypes.JSON, // Array of strings
        allowNull: false
    },
    soloPhotos: {
        type: DataTypes.JSON, // Array of filenames
        allowNull: false
    },
    deckPhotos: {
        type: DataTypes.JSON, // Array of filenames
        allowNull: false
    },
    shayari: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

// Sync database
sequelize.sync().then(() => {
    console.log('Database synced successfully');
}).catch(err => {
    console.error('Failed to sync database:', err);
});

module.exports = { sequelize, Surprise };
