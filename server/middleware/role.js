const check =
  (...roles) =>
  (req, res, next) => {
    console.log('Role check middleware:', {
      hasUser: !!req.user,
      userRole: req.user?.role,
      requiredRoles: roles,
      userEmail: req.user?.email
    });

    if (!req.user) {
      console.log('Role check failed: No user in request');
      return res.status(401).send('Unauthorized');
    }

    const hasRole = roles.find(role => req.user.role === role);
    console.log('Role check result:', {
      hasRole: !!hasRole,
      matchingRole: hasRole
    });

    if (!hasRole) {
      console.log('Role check failed: User role does not match required roles');
      return res.status(403).send('You are not allowed to make this request.');
    }

    console.log('Role check passed');
    return next();
  };

const role = { check };
module.exports = role;
