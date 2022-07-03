const User = require('../models/User');
const bcrypt = require('bcryptjs');


exports.getLogin = (req, res) => {
    let message = req.flash('error');
    message = message.length > 0 ? message[0] : null;
    console.log(message)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
}

exports.postLogin = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password,  (error, result) => {
                        if (error) {
                            return res.redirect('/login');
                        }
                        if (result) {
                            req.session.userId = user._id;
                            req.session.isAuthenticated = true;
                            return res.redirect('/');
                        }
                        return res.redirect('/login');
                    }
                )
            }else{
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
        });
}

exports.getSignup = (req, res) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    })
}

exports.postSignup = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email: email})
        .then(user => {
            if (!user && password === confirmPassword) {
                return bcrypt.hash(password, 12)
                    .then(hashedPassword => {
                        const user = new User({
                            email: email,
                            password: hashedPassword,
                            cart: {items: [], total: 0}
                        });
                        return user.save();
                    })
                    .then(() => {
                        res.redirect('/login');
                    });
                ;
            }
            return res.redirect('/signup')
        });

}

exports.getLogout = (req,res) => {
    req.session.destroy((err) => {
        if(err) console.error(err);
        res.render('auth/login',{
            path:'login',
            pageTitle: 'Login',
            isAuthenticated: false
        })
    })
}