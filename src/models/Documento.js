import Sequelize from "sequelize"
import db from '../configs/db.js'
import Usuario from './Usuario.js'

const Documento = db.define('documentos', {
    id_doc: {
        autoIncrement: true,
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true
    },
    titulo: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    documento: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    estado: {
        type: Sequelize.ENUM('0', '1', '2'),
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

Documento.belongsTo(Usuario, {
    foreignKey: 'id_user',
    targetKey: 'id'
})

export default Documento