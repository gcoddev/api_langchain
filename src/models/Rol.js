import Sequelize from "sequelize"
import db from '../configs/db.js'

const Rol = db.define('roles', {
    id_rol: {
        autoIncrement: true,
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.STRING(25),
        allowNull: false
    },
    descripcion: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    estado: {
        type: Sequelize.ENUM('0', '1', '2'),
        allowNull: false,
        defaultValue: '1'
    }
});

export default Rol