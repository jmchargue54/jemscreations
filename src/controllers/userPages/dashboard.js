// render dashboard page
const dashboardPage = (req, res) => {
    res.render('dashboard', { 
        title: "Dashboard", 
        user: { 
            id: 1, 
            name: "Jane Doe", 
            email: "janedoe@email.com" 
        } 
    });
};

export { dashboardPage };
