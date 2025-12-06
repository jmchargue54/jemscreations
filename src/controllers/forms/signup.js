// render sign up page
const signupPage = (req, res) => {
    res.render('forms/signup', { 
        title: "Sign Up",
    });
};

export { signupPage };