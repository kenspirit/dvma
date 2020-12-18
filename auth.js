const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserService = require('./modules/user/user-service')

function init(app) {
  passport.use(new LocalStrategy(
    function (username, password, done) {
      UserService.findOneByUserName(username)
        .then((user) => {
          if (!user) {
            return { isMatched: false, user }
          }

          return UserService.verifyUserPassword(user.passwordHash, password)
            .then((isMatched) => {
              return { isMatched, user }
            })
        })
        .then(({ isMatched, user }) => {
          if (isMatched) {
            done(null, user)
          } else {
            done(null, false, { message: 'Unmatched username/password combination.' })
          }
        })
        .catch(done)
    }
  ))

  passport.serializeUser(function (user, done) {
    done(null, user._id)
  });

  passport.deserializeUser(function (id, done) {
    UserService.findOneById(id)
      .then((user) => {
        done(null, user)
      })
      .catch(done)
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

      UserService.registerUser({ username, password: body.password })
        .then((createdUser) => {
          req.login(createdUser, (err) => {
            if (err) {
              return res.redirect('/auth/signup?error=unknown-error')
            }

            return res.redirect('/');
          })
        })
        .catch((err) => {
          if (err instanceof BusinessError && err.code === 'BERR_USER_EXISTED') {
            return res.redirect('/auth/signup?error=user-existed')
          }
          res.redirect('/auth/signup?error=unknown-error')
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
