var CommentModel = require('../models/commentModel.js');

/**
 * commentController.js
 *
 * @description :: Server-side logic for managing comments.
 */
module.exports = {
    list: (req, res) => {
        CommentModel.find({ photo: req.params.photoId })
            .populate('author')
            .then(comments => {
                res.json(comments);
            })
            .catch(err => {
                res.status(500).json({ message: 'Napaka pri pridobivanju komentarjev', error: err });
            });
    },

    create: (req, res) => {
        const comment = new CommentModel({
            content: req.body.content,
            author: req.session.userId,
            photo: req.params.photoId
        });

        comment.save()
            .then(savedComment => savedComment.populate('author'))
            .then(populatedComment => {
                res.status(201).json(populatedComment);
            })
            .catch(err => {
                res.status(500).json({ message: 'Napaka pri shranjevanju komentarja', error: err });
            });
    }
};
