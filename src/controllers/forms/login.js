// render login page
const loginPage = (req, res) => {
    res.render('login', { 
        title: "Login",
    });
};

export { loginPage };