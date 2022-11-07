const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

//localhost:3001/
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    //get the attribute 'name' of the User model associated with each Post
                    attributes: ['name']
                },
            ],
        });

        const posts = postData.map((post)=> post.get({plain: true}))
        console.log(posts) //for the homepage.handlebars 

        // you need to pass object to handlebar, posts is an object 
        // homepage.handlebars, where you have {{#each posts as |post| }}, posts is an array
        res.render('homepage',{
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/post/:id', async (req, res) => {
    try{
        const postData = await this.post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const post = postData.get({ plain: true });

        res.render('post', {
            ...post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err)
    }
});

router.get('/profile', withAuth, async (req, res) => {
    try{
        const userData = await User.findByPk(req.session.user_id, {
            attributes: {exclude: ['password']},
            include: [{ model: Post}],
        });

        const user = userData.get({ plain: true });

        res.render('profile', {
            user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err)
    }
});


//localhost:3001/login
router.get('/login', (req, res) => {
    //app.use(session(sess))
    //question: where to find session.logged_in? 
    if(req.session.logged_in){
        res.redirect('/profile');
        return;
    }

    res.render('login')
})

module.exports = router;