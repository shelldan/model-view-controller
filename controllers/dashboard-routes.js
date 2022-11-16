const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/',withAuth, async (req, res) => {
    try{
        const postData = await Post.findAll({
            where: {
                user_id: req.session.user_id,
            },
            attributes: ['id','title','content','created_at'],
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        const posts = postData.map((post) => post.get({plain: true }));

        res.render('dashboard', {
            posts,
            // logged_in: true,
            // creating a variable called 'logged_in' 
            logged_in: req.session.logged_in, //true
            username: req.session.username,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/edit/:id', withAuth, async (req, res) => {
    try{
        //findOne is not an array, findAll will gives you an array
        const postData = await Post.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ['id', 'title', 'content', 'created_at'],
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });
        
        //map will return with array
        // const post = postData.map((post) => post.get({ plain: true }))
        const post = postData.get({ plain: true })

        res.render('edit-post', {
            post,
            logged_in: true,
            username: req.session.username,
        });
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

router.get('/new', (req, res) => {
    res.render('new-post', { username: req.session.username});
});

module.exports = router;