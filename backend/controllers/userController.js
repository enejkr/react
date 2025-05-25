var UserModel = require('../models/userModel.js');
const PhotoModel = require('../models/photoModel');
const CommentModel = require('../models/commentModel');
const axios = require('axios');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({ _id: id }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    /**
     * userController.create()
     */
    create: function (req, res) {
        const { username, password, email, captchaToken } = req.body;

        axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: captchaToken,
            }
        })
        .then(captchaRes => {
            if (!captchaRes.data.success) {
                return res.status(400).json({ message: "CAPTCHA preverjanje ni uspelo." });
            }

            const user = new UserModel({
                username,
                password,
                email,
            });

            user.save(function (err, savedUser) {
                if (err) {
                    return res.status(500).json({
                        message: 'Napaka pri ustvarjanju uporabnika',
                        error: err,
                    });
                }

                return res.status(201).json(savedUser);
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: "Napaka pri preverjanju CAPTCHA.",
                error: err,
            });
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({ _id: id }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
            user.password = req.body.password ? req.body.password : user.password;
            user.email = req.body.email ? req.body.email : user.email;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    showRegister: function (req, res) {
        res.render('user/register');
    },

    showLogin: function (req, res) {
        res.render('user/login');
    },

    login: function (req, res, next) {
        UserModel.authenticate(req.body.username, req.body.password, function (err, user) {
            if (err || !user) {
                var err = new Error('Wrong username or paassword');
                err.status = 401;
                return next(err);
            }
            req.session.userId = user._id;
            //res.redirect('/users/profile');
            return res.json(user);
        });
    },

    profile: async function (req, res, next) {
        try {
            const user = await UserModel.findById(req.session.userId);
            if (!user) {
                return res.status(404).json({ message: 'Not authorized, go back!' });
            }

            const photos = await PhotoModel.find({ postedBy: user._id });
            const totalLikes = photos.reduce((acc, photo) => acc + (photo.likes || 0), 0);

            const commentCount = await CommentModel.countDocuments({ author: user._id });

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                avatarPath: user.avatarPath || null,
                photoCount: photos.length,
                totalLikes: totalLikes,
                commentCount: commentCount
            });
        } catch (err) {
            next(err);
        }
    },

    logout: function (req, res, next) {
        if (req.session) {
            req.session.destroy(function (err) {
                if (err) {
                    return next(err);
                } else {
                    //return res.redirect('/');
                    return res.status(201).json({});
                }
            });
        }
    },



    uploadAvatar: function (req, res) {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        UserModel.findByIdAndUpdate(
            req.session.userId,
            { avatarPath: req.file.path.replace(/^public[\\/]/, "") },
            { new: true },
            function (err, user) {
                if (err) return res.status(500).json({ message: 'Upload error', error: err });
                res.json({ avatarPath: user.avatarPath });
            }
        );
    }
};
