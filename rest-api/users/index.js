const { Router } = require('express');
const userController = require('./controllers/userController');

const router = Router();

router.get('/:userId/projects', userController.allProjects);
router.put('/:userId/projects', userController.newProject);
router.put('/:userId/projects/:projectName', userController.removeProject);
router.put('/:userId/projects/tasks', userController.newTask);

module.exports = router;