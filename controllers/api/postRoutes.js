const router = require('express').Router();
const { Post, User } = require('../../models');
const withAuth = require('../../utils/auth');

/**
 * localhost:3001/api/post
 * use insomnia to see the response, better than console.log()
 */
router.get('/', async (req, res) => {
    try{
        const postData = await Post.findAll({
            //'created_at from Post timestamps: true (default)
            attributes: ['id', 'title', 'content', 'created_at'],
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: User, attributes: ['username']
                },
            ],
        });
        res.status(200).json(postData.reverse());
    } catch (err){
        res.status(400).json(err)
    }
})

/**
 * question: why I can't get this id? 
 */
router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findOne({
            where : {id: req.params.id},
            attributes: ['id','title','content','created_at'],
            order: [['created_at','DESC']],
            include: [
                {model: User, attributes: ['username']},
            ],
        });
        if(!postData){
            res.status(404).json({ message: `no posts with id = ${req.params.id}`});
            return;
        }
        res.status(200).json(postData);
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

router.post('/', withAuth, async (req, res) => {
    try{
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const updatedPost = await Post.update(
            {
                title: req.body.title,
                content: req.body.content,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        if(!updatedPost){
            res.status(404).json({ message: 'No post found with this id'});
            return;
        }

        res.json(updatedPost);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/:id', withAuth, async (req, res) => {
    try{
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if(!postData) {
            res.status(404).json({ message: `No post owned by user_id = ${req.session.user_id} found with id = ${req.params.id}`});
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;