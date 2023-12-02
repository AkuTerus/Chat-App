export default {
  // GET /logout
  index: async (req, res) => {
    req.session.login = undefined;
    req.session.destroy((err) => console.error(err));
    res.redirect('/login');
  },
};
