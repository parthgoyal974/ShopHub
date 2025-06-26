export function adminPasskeyMiddleware(req, res, next) {
  if (req.session && req.session.adminAuthenticated) {
    // Session is valid
    return next();
  }
  // If not authenticated, redirect to passkey form
  return res.redirect('/admin/passkey');
}
