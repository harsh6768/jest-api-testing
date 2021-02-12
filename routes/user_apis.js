const express = require('express');
const Router = express.Router();

// controllers
const ActivityController = require('../controllers/activity_controller');


// activity routes
Router.post('/activity', ActivityController.create);
Router.get('/activity/list/:id', ActivityController.list);
Router.get('/activity/:id', ActivityController.get);
Router.post('/activity/:id', ActivityController.update);
Router.delete('/activity/:id', ActivityController.delete);



module.exports=Router;

