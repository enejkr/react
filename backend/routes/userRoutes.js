const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const multer = require('multer');
const upload = multer({ dest: 'public/images/' });

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        const err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

router.get('/', userController.list);
router.get('/profile', userController.profile);
router.get('/logout', userController.logout);
router.get('/:id', userController.show);

router.post('/', csrfProtection, userController.create);
router.post('/login', userController.login);
router.post('/upload-avatar', upload.single('avatar'), requiresLogin, userController.uploadAvatar);

router.put('/:id', csrfProtection, userController.update);
router.delete('/:id', csrfProtection, userController.remove);

module.exports = router;
