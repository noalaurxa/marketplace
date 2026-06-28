/**
 * Middleware factory that checks if the authenticated user has one of the allowed roles.
 * Usage: `app.use('/admin', authMiddleware, roleMiddleware(['ADMIN']), adminRouter);`
 */
function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    next();
  };
}

module.exports = roleMiddleware;
