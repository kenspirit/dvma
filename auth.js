const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const argon2 = require('argon2')
const DB = require('./db')

function init(app) {
  passport.use(new LocalStrategy(
    function (username, password, done) {
      DB.users.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, { message: 'Unmatched username/password combination.' })
        }
        
        return argon2.verify(user.passwordHash, password)
          .then((isMatched) => {
            if (isMatched) {
              done(null, user)
            } else {
              done(null, false, { message: 'Unmatched username/password combination.' })
            }
          })
          .catch(done)
      })
    }
  ))

  passport.serializeUser(function (user, done) {
    done(null, user._id)
  });

  passport.deserializeUser(function (id, done) {
    DB.users.findOne({ _id: id }, function (err, user) {
      done(err, user)
    })
  })

  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    if (!/^\/auth\/.+$/.test(req.path) && !req.isAuthenticated()) {
      return res.redirect('/auth/login')
    }

    next()
  })

  app.get('/', (req, res) => {
    // Sample unsafe cookie
    res.cookie('main-3rd-party', 'main-3rd-party',
      {
        path: '/',
        domain: 'www.dvwa.com',
        maxAge: 900000,
        httpOnly: false
      })
    res.cookie('main-session', 'main-session',
      {
        path: '/',
        domain: 'www.dvwa.com',
        httpOnly: false
      })
    res.cookie('sub-3rd-party', 'sub-3rd-party',
      {
        path: '/',
        domain: 'sub.dvwa.com',
        maxAge: 900000,
        httpOnly: false
      })
    res.cookie('sub-session', 'sub-session',
      {
        path: '/',
        domain: 'sub.dvwa.com',
        httpOnly: false
      })

    res.render('home')
  })

  app.get('/auth/login', (req, res) => {
    res.render('login')
  })

  app.post('/auth/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true
    }),
    function (req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.

      res.redirect('/')
    })

  app.get('/auth/signup', (req, res) => {
    res.render('signup')
  })

  app.post('/auth/signup',
    function (req, res, next) {
      const body = req.body;
      if (body.password !== body.confirmedPassword) {
        return res.redirect('/auth/signup?error=password_not_match')
      }

      const username = body.username
      DB.users.findOne({ username }, (err, dbUser) => {
        if (err) {
          return res.redirect('/auth/signup?error=unknown-error')
        }

        if (dbUser) {
          return res.redirect('/auth/signup?error=user-existed')
        }

        argon2.hash(body.password)
          .then((passwordHash) => {
            const user = {
              username,
              passwordHash
            }

            DB.users.insert(user, (err, createdUser) => {
              if (err) {
                return res.redirect('/auth/signup?error=unknown-error')
              }

              req.login(createdUser, function (err) {
                if (err) {
                  return res.redirect('/auth/signup?error=unknown-error')
                }

                return res.redirect('/');
              })
            })
          })
          .catch((err) => {
            return res.redirect('/auth/signup?error=unknown-error')
          })
      })
    })

  app.get('/auth/logout', function (req, res) {
    req.logout()
    res.redirect('/auth/login')
  })
}

module.exports = {
  init
}
