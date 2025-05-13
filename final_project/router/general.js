const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

users = []
public_users.post("/register", (req,res) => {
    const username= req.body.username
    const password= req.body.password
    console.log(req.body)
    console.log(username)
    console.log(password)

    let existing_users = users.filter((e)=>{
       return e.username === username;
    })

    if(username && password ){
        if(isValid(username)){
            if(existing_users.length>0){
                return res.status(404).json("username already exists!")
            }else{
                console.log(users)
                users.push({"username":username,"password":password})
                console.log(users)
                res.status(201).json("user successfully registered!")
            }

        }else{
            return res.send("This username is invalid")
        }
    }else{
        return res.status(404).json("username or password not provided")
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let booklist=JSON.stringify(books);
  return res.send("List of all books:"+"\n" + booklist);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn_no = req.params.isbn;
  let book = books[isbn_no]

  if(book){
  return res.status(300).json(book);
  }
  else{
    return res.send("Book not found.")
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author_name = req.params.author
  let book_author ={}
  for(let i = 1; i <= 10; i++){
    if(books[i]&&books[i].author===author_name){
        book_author[i] = books[i];
    }
  }
  if(Object.keys(book_author).length===0){
    return res.status(404).json("Book details not found!")
  }else{
  return res.status(300).json(book_author);
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let book_title ={}
  for(let i=1;i<=10;i++){
    if(books[i].title === title){
        book_title[i] =  books[i];
    }
  }
  if(Object.keys(book_title).length===0){
    return res.status(404).json("Book details not found!")
  }else{
  return res.status(300).json(book_title);
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let review = books[req.params.isbn].reviews
  if(review){
    return res.status(300).json(`Review for this book is ${review}`);
  }else{
    return res.status(404).json("This book has no review")
  }
  
});

module.exports.general = public_users;
