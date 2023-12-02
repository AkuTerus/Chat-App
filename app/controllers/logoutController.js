export default {
  // GET /logout
  index: async (req, res) => {
    req.session.login = undefined;
    req.session.destroy();
    res.redirect('/login');
  },
};
