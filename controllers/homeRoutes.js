const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    // try {
    //     const postData = await Post.findAll({
    //         include: [
    //             {
    //                 model: User,
    //                 attributes: ['title']
    //             },
    //         ],
    //     });

    //     const posts = postData.map((post)=> post.get({plain: true}))

    //     res.render('homepage',{
    //         posts,
    //         // need login information here
    //     });
    // } catch (err) {
    //     res.status(500).json(err)
    // }
    res.render('homepage')
})

router.get('/post/:id', async (req, res) => {
    try{
        const postData = await this.post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['title'],
                },
            ],
        });

        const post = postData.get({ plain: true });

        res.render('post', {
            ...post,
            // need login information here
        })
    } catch (err) {
        res.status(500).json(err)
    }
});



module.exports = router;