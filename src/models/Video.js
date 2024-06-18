import Sequelize from "sequelize"
import db from '../configs/db.js'
import Usuario from './Usuario.js'

const Video = db.define('videos', {
    id_video: {
        autoIncrement: true,
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true
    },
    titulo: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    url: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    descripcion: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    estado: {
        type: Sequelize.ENUM('1', '2', '3'),
        allowNull: false,
        defaultValue: '1'
    },
    creado_el: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    id_user: {
        type: Sequelize.INTEGER(11),
        allowNull: false
    }
});

Video.belongsTo(Usuario, {
    foreignKey: 'id_user',
    targetKey: 'id'
})

export default Video