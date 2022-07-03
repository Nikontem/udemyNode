const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require('../models/User');

var transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "ntemkas_eurocamp@hotmail.com",
        pass: "udlckjmipjrounyt",
    },
});

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
    });
}

exports.postLogin = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, (error, result) => {
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
            } else {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
        });
}

exports.getSignup = (req, res) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
    })
}

exports.postSignup = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const mailOptions = {
        from: "ntemkas_eurocamp@hotmail.com",
        to: email,
        subject: "Sending New Email using Node.js",
        html: "<h1>Hello Man, Guess who just sent you an email!</h1>",
    };
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
                        return transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.error(error);
                            } else {
                                console.info("Email Sent:" + info.response);
                            }
                        })
                    })
                    .catch(error => console.error(error));
            }
            return res.redirect('/signup')
        });

}

exports.getReset = (req, res) => {

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
    })
}

exports.postReset = (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {

        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('error', "No account with this email found");
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save()
                    .then(() => {
                        res.redirect('/');
                        const mailOptions = {
                            from: "ntemkas_eurocamp@hotmail.com",
                            to: req.body.email,
                            subject: "Password Reset",
                            html: `Click <a href="http://localhost:3000/reset-password/${token}">here</a> to set a new password`,
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.error(error);
                            } else {
                                console.info("Email Sent:" + info.response);
                            }
                        })
                    });
            })

            .catch(err => {
                console.error(err);
            })
    })
}

exports.getResetPassword = (req, res) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .select("_id")
        .then((userId) => {
            if (!userId) {
                req.flash('error', "Link Not Valid");
                console.log('redirecting');
                return res.redirect('/login');
            }
            return res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                userId: id,
                resetToken: token
            })
        })

}

exports.postResetPassword = (req, res, next) => {
    let resetUser;
    User.findOne({_id: req.body.userId, resetToken: req.body.resetToken, resetTokenExpiration: {$gt: Date.now()}})
        .then((user) => {
            if (!user) {
                req.flash('error', "Link Not Valid");
                return res.redirect('/reset');
            }
            resetUser = user;
            return bcrypt.hash(req.body.password, 12);
        })
        .then(hashedPsw => {
            resetUser.password = hashedPsw
            resetUser.resetToken = null;
            resetUser.resetTokenExpiration = null;
            return resetUser.save();
        })
        .then(() => {
            return res.redirect('/login');
        })
        .catch(error => {
                req.flash('error', error);
                next();
            }
        );
}

exports.getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/login');
    });
}