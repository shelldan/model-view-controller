const router = require('express').Router();
const { User, Post } = require('../../models');


/**
 * localhost:3001/api/user/ -> api info, use insomnia to see the array of the users
 */
router.get('/', async (req, res) => {
    try{
        const userData = await User.findAll({
            attributes: {exclude: ['password']},
        });
        res.status(200).json(userData);
    } catch (err) {
        res.status(400).json(err);
    }
});

/**
 * localhost:3001/api/user/1 -> api info, use insomnia
 * 
 */
router.get('/:id', async (req, res) => {
    try{
        const userData = await User.findOne({
            attributes: { exclude: ['password']},
            where: {id: req.params.id },
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'content', 'created_at'],
                },
                {
                    model: Post,
                    attributes: ['title'],
                }
            ]
        });
        //console.log(userData);
        if(!userData){
            res.status(404).json({ message: `No such user id ${req.params.id}`});
            return;
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(400).json(err)
    }
});


/**
 * connect to the public/js/login.js, where it fetch('/api/user) = sign up 
 * localhost:3001/api/user/ since this is a post request, you will not able to see the information on google chrome, use insomnia
 */
router.post('/', async (req, res) => {
    try{
        const userDate = await User.create(req.body);
        //console.table(req.body)
        //creating session variable, and assign the key and value 
        req.session.save(()=>{
            req.session.user_id = userDate.id;
            req.session.username = userDate.username;
            req.session.logged_in = true;

            res.status(201).json(`Successfully created ${userDate.username}`);
        })
    } catch (err){
        res.status(400).json(err)
    }
})

/**
 * connect to the public/js/login.js, where it fetch('/api/user/login') = login 
 * localhost:3001/api/user/login, since this is a post request, you will not able to see the information on google chrome, use insomnia
 */
router.post('/login', async (req, res) => {
    //console.log(req.body, 'I made it here')
    try{
        const userData = await User.findOne({ where : {username: req.body.username }});

        if(!userData){
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again'});
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if(!validPassword){
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again'});
            return;
        }
        
        //console.log(userData)

        //we are creating some property under session key, and req has the access to it in all the routes
        req.session.save(()=> {
            //user_id is key for session
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'You are now logged in!'});
        })
    } catch (err){
        res.status(400).json(err);
    }
});

router.post('/logout', async (req, res) => {
    try{
        if (req.session.logged_in){
            const userData = await req.session.destroy(()=> {
                res.status(204).end();
            });
        } else {
            res.status(404).end();
        }        
    } catch (err){
        console.log(err)
        res.status(400).end();
    }
});

module.exports = router;