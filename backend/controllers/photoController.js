var PhotoModel = require('../models/photoModel.js');

/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find()
            .populate('postedBy')
            .exec(function (err, photos) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.',
                        error: err
                    });
                }
                var data = [];
                data.photos = photos;
                //return res.render('photo/list', data);
                return res.json(photos);
            });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({ _id: id })
            .populate('postedBy')
            .exec(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.',
                        error: err
                    });
                }

                if (!photo) {
                    return res.status(404).json({
                        message: 'No such photo'
                    });
                }

                const userId = req.session?.userId;
                const photoObj = photo.toObject();
                photoObj.hasVoted = userId ? photo.votedBy.map(id => id.toString()).includes(userId) : false;

                return res.json(photoObj);
            });
    },

    /**
     * photoController.create()
     */
    create: function (req, res) {
        var photo = new PhotoModel({
            name: req.body.name,
            description: req.body.description,
            path: "/images/" + req.file.filename,
            postedBy: req.session.userId,
            views: 0,
            likes: 0
        });

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            return res.status(201).json(photo);
            //return res.redirect('/photos');
        });
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.name = req.body.name ? req.body.name : photo.name;
            photo.path = req.body.path ? req.body.path : photo.path;
            photo.postedBy = req.body.postedBy ? req.body.postedBy : photo.postedBy;
            photo.views = req.body.views ? req.body.views : photo.views;
            photo.likes = req.body.likes ? req.body.likes : photo.likes;

            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PhotoModel.findByIdAndRemove(id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    publish: function (req, res) {
        return res.render('photo/publish');
    },

    vote: function (req, res) {
        const { id, voteType } = req.params;
        const userId = req.session.userId;

        PhotoModel.findById(id)
            .then(photo => {
                if (!photo) {
                    return res.status(404).json({ message: "Photo not found." });
                }

                if (photo.votedBy.includes(userId)) {
                    return res.status(400).json({ message: "User already voted." });
                }

                if (voteType === 'like') {
                    photo.likes = (photo.likes || 0) + 1;
                } else if (voteType === 'dislike') {
                    photo.dislikes = (photo.dislikes || 0) + 1;
                } else {
                    return res.status(400).json({ message: "Invalid vote type." });
                }

                photo.votedBy.push(userId);

                return photo.save().then(() => {
                    res.json({
                        likes: photo.likes,
                        dislikes: photo.dislikes
                    });
                });
            })
            .catch(err => {
                res.status(500).json({ message: "Error processing vote", error: err.message });
            });
    },
    report: function (req, res) {
        const photoId = req.params.id;
        const userId = req.session.userId;

        PhotoModel.findById(photoId, function (err, photo) {
            if (err || !photo) return res.status(404).json({ message: "Photo not found" });

            if (photo.reportedBy.includes(userId)) {
                return res.status(400).json({ message: "Already reported" });
            }

            photo.reports += 1;
            photo.reportedBy.push(userId);

            photo.save(function (err, updated) {
                if (err) return res.status(500).json({ message: "Error reporting photo", error: err });

                res.json({ message: "Photo reported" });
            });
        });
    },

    sortedByScore: function (req, res, next) {
        PhotoModel.find()
            .then(photos => {
                const MAX_REPORTS = 5;
                const sorted = photos
                    .map(photo => {
                        const score = decayScore(photo.likes || 0, photo.date);
                        console.log(`Photo: ${photo._id}, Likes: ${photo.likes}, Date: ${photo.date}, Score: ${score}`);
                        return {
                            ...photo.toObject(),
                            score
                        };
                    })
                    .sort((a, b) => b.score - a.score)
                    .filter(photo => (photo.reports || 0) < MAX_REPORTS);

                res.json(sorted);
            })
            .catch(err => {
                console.error("Napaka v sortedByScore:", err);
                next(err);
            });
    }

};
