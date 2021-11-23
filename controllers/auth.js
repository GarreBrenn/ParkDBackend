const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const promisify = require('util');

// found in app.js
const db = mysql.createConnection({
    host: 'localhost', // or change to public IP if using an SQL server on another computer
    user: 'root',
    password: '00098636', //not my phone password
    database: 'parkD'
});

exports.register = (req, res) =>{
    console.log(req.body);

    // match req.body.XXX with the matching "name=XXX" in the register.hbs file
    const email = req.body.Email;
    const password = req.body.Password;
    const passwordConfirm = req.body.passwordConfirm;

    // Check to see if a user has already registered with that email.
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results)=>{
        if(error){
            console.log(error);
        }
        // get back an array of emails matching the registered email.
        // Get the length of that array. If it's above 0, they already registered.
        if(results.length > 0){
            res.send("Email is already registered. Use a different email or login instead")
            
            //return res.render('http://localhost:3006/register', {
            //    message: 'Email is already registered, dum dum.'
            //})  
        }
        else if(password != passwordConfirm){
            res.send("Password mismatch")
            //return res.render('http://localhost:3006/register', {
            //    message: "Password mismatch."
            //})
        }
        // password is hashed 8 times for safety.
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        // COLUMN: XXX
        db.query('INSERT INTO users SET ?', {email: email, password: hashedPassword}, (error, results)=>{
            if(error){
                console.log(error);
            }
            else{
                res.send("Registered. You may login with these credentials");
                //return res.render('http://localhost:3006/register',{
                //    message: 'Successfully registered!'
                //});
            }
        })
    });

    
    //const{email, password, passwordConfirm} = req.body;

    //res.send("Form submitted");

    
}
exports.login = async (req, res) =>{
    console.log(req.body);

    // match req.body.XXX with the matching "name=XXX" in the register.hbs file
    
    try{
        const email = req.body.Email;
        const password = req.body.Password; 
        if (!email || !password){
            res.send("Provide an email and/or password")
            //return res.status(400).render('http://localhost:3006/login', {
            //    message: 'Provide email and/or password'
            //})
        }
    // for testing = deez@nuts.com, pass: 1234 is a valid login
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results)=>{
        // their email doesn't come back OR their password doesn't match the hashed one on the DB.
        if(!results || !(await bcrypt.compare(password, results[0].password))){
            res.send("Email and/or password incorrect. Try again")
            //res.status(401).render('http://localhost:3006/login', {
            //    message: 'Email and/or password is incorrect. Try again.'
            //})
        } else{
            // cookie stuff
            const id = results[0].id;

            // Cookie expiration date and password are stored in a separate file ".env".
            // Can change the cookie password and expiration date according to our needs.
            
            const token = jwt.sign({id: id}, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            console.log("TOKEN IS: " + token);

            const cookieOptions = {
                expires: new Date (
                    // 24 hours in a day, 60 minutes in an hour, 60 seconds in a minute, 1000ms in a second
                    Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000

                    ),
                    // just for security so naughty people can't steal muh data
                    httpOnly: true
            }
            // the user's been logged in, now put the cookie in the browser.
            res.cookie('jwt', token, cookieOptions);
            // TODO: CHANGE THIS TO GARRETT'S HOMEPAGE
            res.status(200).redirect("http://localhost:3006"); // redirect user to homepage


        }
        
        
    })
    
    
    }catch(error){
        console.log(error);
    }
}

exports.logout = async(req, res)=>{
    res.cookie('jwt', 'logout', {
        // change cookie expire date to 2 seconds from now (or whatever)
        expires: new Date(Date.now() + 2*1000),
        // again making sure to thwart naughty people
        httpOnly: true
    });
    // dump them back to the homepage
    res.status(200).redirect('/')
}


exports.isLoggedIn = async(req, res, next) =>{
    // check to see if jwt a cookie exists
    console.log(req.cookies);
    if (req.cookies.jwt){
        try{
            // check if the cookie token matches my super secret password as defined in the .env file
            const decoded = await promisify(jwt.verify)(req.cookies.jtw, process.env.JWT_SECRET);
            console.log(decoded);

            // check if the user still exists
            db.query('SELECT * FROM users WHERE email = ?', [decoded.email], (error, result) =>{
                console.log(result);
                if(!result){
                    return next();
                }
                req.user = result[0]; // email is the 0'th collumn in the database
                return next();
            });
        }
        catch(error){
        console.log(error);
        return next();
        }
    }
    else{
        // the nerd isn't logged in
        //res.status(403).redirect('/login')
        next();
    }
    // do something else with the next()
    next();
}