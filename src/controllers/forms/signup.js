// render sign up page
const signupPage = (req, res) => {
    res.render('signup', { 
        title: "Sign Up",
    });
};

export { signupPage };