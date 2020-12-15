import express from 'express';

const router = express.Router();

router.get('/', (request, response) => {

    const myQuery = request.query.myQuery;

    response.render('index/index');

});

export default router;