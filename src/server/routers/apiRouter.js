import { Router } from 'express';

var apiRouter = Router();
function restrict(req, res, next) {
    if(req.session.user) next();
    else res.redirect('/login');
}
apiRouter.get('/', restrict, (req, res) => {
    res.send('api');
})

export default apiRouter;