import Sequelize from "sequelize"
import db from '../configs/db.js'
import Rol from './Rol.js'

const Usuario = db.define('usuarios', {
    id: {
        autoIncrement: true,
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true
    },
    ci: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    expedido: {
        type: Sequelize.STRING(5),
        allowNull: false
    },
    paterno: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    materno: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    nombres: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    nacimiento: {
        type: Sequelize.DATE,
        allowNull: false
    },
    celular: {
        type: Sequelize.INTEGER(25),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    estado: {
        type: Sequelize.ENUM('0', '1', '2'),
        allowNull: false,
        defaultValue: '1'
    },
    id_rol: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: 3
    },
})

Usuario.belongsTo(Rol, {
    foreignKey: 'id_rol',
    targetKey: 'id_rol'
})

export default Usuario