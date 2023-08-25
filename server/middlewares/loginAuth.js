export function mustLoggedIn(req, res, next) {
  if (!req.session.login) {
    console.log(`"${req.path}" | (Unauthorized)`);
    return res.redirect('/login');
  }
  next();
}

export function mustLoggedOut(req, res, next) {
  if (req.session.login) {
    console.log(`"${req.path}" | ${req.session.login}`);
    return res.redirect(req.originalUrl);
  }
  next();
}
