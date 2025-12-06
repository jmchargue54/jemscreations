// render login page
const loginPage = (req, res) => {
    res.render('forms/login', { 
        title: "Login",
    });
};

export { loginPage };