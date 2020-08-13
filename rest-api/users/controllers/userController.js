const { verify } = require('jsonwebtoken');
const Users = require('../models/users');

async function getProjects(userId) {
    const user = await Users.findOne({ _id: userId });

    return user.projects || [];
}

async function addProject(userId, name) {
    const user = await Users.findOne({ _id: userId });

    if (user) {
        const projects = [...(user.projects || [])];

        projects.push({ name, tasks: [] });

        await Users.updateOne({ _id: userId }, { projects });
    }
}
async function deleteProject(userId, name) {
    const user = await Users.findOne({ _id: userId });

    if (user) {
        let projects = [...(user.projects || [])];

        let newProjectArray = [];
        
        projects.map(project => {
            if(project.name !== name) newProjectArray.push(project);
        })

        projects = newProjectArray;

        await Users.updateOne({ _id: userId }, { projects });

    }
}

async function addTask(userId, index, tasks) {
    const user = await Users.findOne({ _id: userId });

    if (!user) throw true;

    const projects = [...user.projects];

    projects[index].tasks = tasks;

    await Users.updateOne({ _id: userId }, { projects });
}

function verifyToken(token) {
    verify(token, process.env.JWT_KEY || 'token');
}

const allProjects = async (req, res) => {
    try {

        const { userId } = req.params;
        const { authorization } = req.headers;

        await verifyToken(authorization);

        const projects = await getProjects(userId);

        return res.json(projects);
    } catch (error) {
        res.status(500);
        return res.json({ error: error.message });
    }
};

const newProject = async (req, res) => {
    const userId = req.params.userId;
    const authorization = req.headers.authorization;
    const name = req.body.name;

    await verifyToken(authorization);

    await addProject(userId, name);

    return res.status(200).send('Project added');
}

const newTask = async (req, res) => {
    try {
        const { userId } = req.params;
        const { authorization } = req.headers;
        const { index, tasks } = req.body;

        await verifyToken(authorization);

        await addTask(userId, index, tasks);

        res.status(204);
        return res.send('');
    } catch (error) {
        res.status(500);
        return res.json({ error: error.message });
    }
};

const removeProject = async (req, res) => {

    try {
        const { userId, projectName } = req.params;
        const { authorization } = req.headers;

        await verifyToken(authorization);

        await deleteProject(userId, projectName);

        res.status(204);
        return res.send('');
    } catch (error) {
        res.status(500);
        return res.json({ error: error.message });
    }
}

module.exports = {
    allProjects,
    newProject,
    removeProject,
    newTask
};