import Sequelize from "sequelize"
import db from '../configs/db.js'
import Usuario from './Usuario.js'

const Blog = db.define('blogs', {
    id_blog: {
        autoIncrement: true,
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true
    },
    titulo: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    descripcion: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    imagen: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    contenido: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    estado: {
        type: Sequelize.ENUM('1', '2', '3'),
        allowNull: false,
        defaultValue: '1'
    },
    creado_el: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    id_user: {
        type: Sequelize.INTEGER(11),
        allowNull: false
    }
});

Blog.belongsTo(Usuario, {
    foreignKey: 'id_user',
    targetKey: 'id'
})

export default Blog