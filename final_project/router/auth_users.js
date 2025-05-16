    const express = require('express');
    const jwt = require('jsonwebtoken');
    let books = require("./booksdb.js");
    const regd_users = express.Router();

    let users = [ { username: 'user3', password: 'pass123' } ];

    const isValid = (username)=>{ //returns boolean
        if(username.length>1 && username.length<14){
            return true
        }else{
            return false
        }
    }

    const authenticatedUser = (username,password)=>{ //returns boolean
        return users.some(user => user.username === username && user.password === password);
    };


    //only registered users can login
    regd_users.post("/login", (req,res) => {
        console.log(req.body)
        const username = req.body.username;
        const password = req.body.password;

        console.log(username)
        console.log(password)
        console.log(users)


        if (!username || !password) {
            return res.status(404).json({ message: "username or password is missing" });
        }

        if (!authenticatedUser(username,password)) {
            return res.status(404).json({ message: "Invalid detials! check username or password" });
        }else{
            let accesstoken = jwt.sign({data: password},'access',{expiresIn:60*60})
            req.session.authorization = {accesstoken,username}
            return res.status(200).json({message:"login successful!"})
        }
    });

    // Add a book review
    regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn_no = req.params.isbn

    const review = req.query.review; 

    if (!review) {
        return res.status(400).json({ message: "review content is missing!" });
    }
    let bookreviews={}

    if(req.session.authorization){
        let token = req.session.authorization['accesstoken']

        jwt.verify(token,'access',(err,user)=>{
            if(!err){
                req.session.authorization.user = user
                if(!bookreviews[isbn_no]){
                    bookreviews[isbn_no]={}
                }
                bookreviews[isbn_no].user = review
                
                console.log(bookreviews[isbn_no].user)
                console.log(bookreviews)
                return res.status(200).json({message:"review logged",bookreviews})
                
            }else{
                return res.status(404).json({message:"could not verify user"})
            }
        })
    }
    else{
        return res.status(404).json({message:"user not logged in!"})
    }
    });

    //test data
     books = { "2": { "title": "...", "author": "...", "reviews": { "user3": "Awesome book" } } }
    
    regd_users.delete('/auth/review/:isbn', (req, res) => {
        let isbn_no = req.params.isbn;
    
        if (req.session.authorization) {
            let token = req.session.authorization['accesstoken'];
    
            jwt.verify(token, 'access', (err, user) => {
                if (!err) {
                    req.session.authorization.user = user;
                    const username = req.session.authorization.username;
    
                    if (books[isbn_no] && books[isbn_no].reviews && books[isbn_no].reviews[username]) {
                        delete books[isbn_no].reviews[username];
                        console.log(books)
                        return res.status(200).json({ message: "Review deleted successfully.",books });
                        
                    } else {
                        return res.status(404).json({ message: "No review found for this user to delete." });
                    }
                } else {
                    return res.status(403).json({ message: "Could not verify user." });
                }
            });
        } else {
            return res.status(401).json({ message: "User not logged in!" });
        }
    });
    

    module.exports.authenticated = regd_users;
    module.exports.isValid = isValid;
    module.exports.users = users;
