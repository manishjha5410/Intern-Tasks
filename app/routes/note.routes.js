module.exports = async (app) => {
    const weather = require('../controllers/note.controller.js');

    app.get('/all', weather.showAll);

    app.get('/one/:lat&:lon', weather.showOne);
}