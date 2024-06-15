import bcrypt from 'bcryptjs'

const pass = {};

pass.encryptPassword = (user_password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user_password, salt);
    return hash;
}
pass.comparaPassword = (user_password, savePassword) => {
    try {
        return bcrypt.compareSync(user_password, savePassword)
    } catch (e) {
        console.log(e);
    }
}

export default pass;