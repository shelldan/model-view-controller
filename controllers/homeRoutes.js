const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

/* localhost:3001/ -> home page */
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            attributes: ['id','title','content','created_at'],
            include: [
                {
                    model: Comment,
                    //get the attribute 'name' of the User model associated with each Post
                    attributes: ['id', 'comment_text','post_id','user_id','created_at'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
                {
                    model: User,
                    attributes: ['username'],
                }
            ],
        });

        const posts = postData.map((post)=> post.get({plain: true}))
        //console.log(posts) //for the homepage.handlebars 
        
        // you need to pass object to handlebar, posts is an object 
        // homepage.handlebars, where you have {{#each posts as |post| }}, posts is an array
        res.render('homepage',{
            posts,
            logged_in: req.session.logged_in,
            username: req.session.username,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})


/* localhost:3001/login -> login page */ 
router.get('/login', (req, res) => {
    //app.use(session(sess))
    //question: where to find session.logged_in? 
    if(req.session.logged_in){
        res.redirect('/');
        return;
    }

    //console.log(req.session.logged_in)
    res.render('login')
})


router.get('/signup', (req, res) => {
    res.render('signup');
})


router.get('/post/:id', async (req, res) => {
    try{
        const postData = await Post.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ['id','content','title','created_at'],
            include: [
                {
                    model: Comment,
                    attributes: ['id','comment_text','post_id','user_id','created_at'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        const post = postData.get({ plain: true });

        res.render('single-post', {
            post,
            logged_in: req.session.logged_in,
            username: req.session.username,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

router.get('/posts-comments', withAuth, async (req, res) => {
    try{
        const postData = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'content', 'title', 'created_at'],
            include: [
                {
                    model: Comment,
                    attributes: ['id','comment_text','post_id','user_id','created_at'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
                {
                    model: User,
                    attributes: ['username'],
                }
            ]
        })

        const post = postData.get({ plain: true });
        
        res.render('posts-comments', {
            post,
            logged_in: req.session.logged_in,
            username: req.session.username,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

module.exports = router;