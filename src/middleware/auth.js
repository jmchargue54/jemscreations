/**
 * Middleware to require authentication for protected routes
 * Redirects to login page if user is not authenticated
 * Sets res.locals.isLoggedIn = true for authenticated requests
 */
const requireLogin = (req, res, next) => {
    // Check if user is logged in via session
    if (req.session && req.session.user) {
        // User is authenticated - set UI state and continue
        res.locals.isLoggedIn = true;
        next();
    } else {
        // User is not authenticated - redirect to login
        res.redirect('/login');
    }
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * Uses flash messages to communicate authorization failures
 * 
 * @param {string} roleName - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (roleName) => {
    return (req, res, next) => {
        if (!req.session.user) {
            req.session.flash = req.session.flash || {};
            req.session.flash.error = ['You must be logged in to access this page.'];
            
            // Save session before redirecting
            return req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                }
                res.redirect('/login');
            });
        }

        if (req.session.user.role_name !== roleName) {
            req.session.flash = req.session.flash || {};
            req.session.flash.error = ['You do not have permission to access this page.'];
            
            // Save session before redirecting
            return req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                }
                res.redirect('/');
            });
        }

        next();
    };
};

export { requireLogin, requireRole };