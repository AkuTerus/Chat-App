import loginModel from './../models/loginModel.js';

export default {
  index: (req, res) => {
    res.render('login', {
      title: 'Login',
      errors: req.flash('validation_errors'),
    });
  },

  store: async (req, res) => {
    // insert login_details
    const data = [req.body.email, req.session.token, req.ip];
    const insert = await loginModel.insertLoginDetails(data);

    res.redirect('/');
  },
};
