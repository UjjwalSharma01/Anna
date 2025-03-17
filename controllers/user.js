const { saveRedirectUrl } = require("../middleware");
const User = require("../models/user")

module.exports.renderSignupPage = (req, res) => {
    res.render("signup_login.ejs")
};

module.exports.signup = async (req, res, next) => {
    try {
        // Destructure username, email, password, location, land_area, and income from req.body
        let { username, email, password, location, land_area, income } = req.body;

        // Create a new user object with the provided data
        const newUser = new User({ username, email, location, land_area, income });

        // Register the new user with the provided password
        const registeredUser = await User.register(newUser, password);

        console.log(registeredUser);

        // Log in the registered user
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash("failure", err);
                return next(err);
            } else {
                req.flash("success", "Welcome to Annadata");
                res.redirect("/annadata");
            }
        });
    } catch (e) {
        // If an error occurs, redirect to the signup page with an error message
        req.flash("error" ,e.message);
        res.redirect("/signup")
    }
};

// Convert user login to return JWT instead of setting session
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !await user.validatePassword(password)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    const token = generateJWT(user);
    
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logedout!");
        res.redirect("/annadata")
    })
};
