const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const Users = require('../../users/models/users');


async function findUser(email) {
    const user = await Users.findOne({ email });
    return user;
}

async function createUser(email, password) {
    const salt = bcrypt.genSaltSync(10);
    const cryptPassword = bcrypt.hashSync(password, salt);

    const user = await Users.create({
        email,
        password: cryptPassword,
    });

    return user;
}

async function verifyPassword(email, password) {
    const user = await Users.findOne({ email }).lean();

    if (!user) {
        return null;
    }

    const compare = bcrypt.compareSync(password, user.password);

    if (!compare) {
        return null;
    }

    return user;
}

function generateToken() {
    const token = sign({
        exp: parseInt(process.env.JWT_EXP, 10) || Math.round((new Date().getTime() / 1000)) + 3600,
    }, process.env.JWT_KEY || 'token');

    return token;
}

const authentication = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUser(email);

        if (user) {
            res.status(400);
            return res.json({ error: "User already exist for this email!" });
        }

        const newUser = await createUser(email, password);

        const token = generateToken();

        return res.json({ token, userId: newUser["_id"] });

    } catch (error) {
        res.status(500);
        return res.json({ error: error.message });

    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await verifyPassword(email, password);

        if (!user) {
            res.status(400);
            return res.json({ error: "Incorrect email or password, cannot complete login!" });
        }

        const token = generateToken();

        return res.json({ token, userId: user["_id"] });
    } catch (error) {
        res.status(500);
        return res.json({ error: error.message });
    }
};

module.exports = {
    authentication,
    login
}