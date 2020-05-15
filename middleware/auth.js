exports.isAdmin = function (req, res, next) {
	if (req.user.admin) 	// if user is authorised(admin), carry on
        return next();   
	res.redirect('/'); // if they aren't redirect them to the home page
}

exports.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated())	// if user is authenticated in the session, carry on
        return next();   
    req.flash('error_msg', 'Please log in to begin creating!');
    res.redirect('/users/login');// if they aren't redirect them to log in
}
