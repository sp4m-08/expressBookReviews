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

// Get the book list available in the shop using promise
public_users.get('/',async function (req, res) {
  const getallbooks = () => {
    return new Promise((resolve, reject) => {
      let booklist = JSON.stringify(books)
      if (booklist) {
        resolve(booklist)
      } else {
        reject("unable to retrieve books!")
      }
    })
  }

  try {
    let booklist = await getallbooks();
    return res.status(201).send(booklist)
  } catch (err) {
    return res.status(500).json({message:err})
  }
});

// Get book details based on ISBN using promises 
public_users.get('/isbn/:isbn',async function (req, res) {
  let isbn_no = req.params.isbn;

  const getbook = () => {
    return new Promise((resolve, reject) => {
      let book = books[isbn_no];
      if (book) {
        resolve(book)
      } else {
        reject("book not found")
      }
    })
  }

  try {
    let book = await getbook()
    return res.status(300).json({message:book})
  } catch (err) {
    return res.status(500).json({message:err})
  }
  // let book = books[isbn_no]

  // if(book){
  // return res.status(300).json(book);
  // }
  // else{
  //   return res.send("Book not found.")
  // }
 });
  
// Get book details based on author using aync-await promises
public_users.get('/author/:author', async function (req, res) {
  let author_name = req.params.author
  let book_author = {}
  for(let i = 1; i <= 10; i++){
    if(books[i] && books[i].author===author_name){
        book_author[i] = books[i];
    }
  }

  const getauthorbook = () => {
    return new Promise((resolve, reject) => {
      if(Object.keys(book_author).length!==0){
        resolve(book_author)
      }else{
       reject("Book details not found!");
      }
      
    })

    
  }

  try {
    let authorbook = await getauthorbook()
    return res.status(200).json({message:authorbook})
  } catch (err) {
    return res.status(500).json({message:err})
  }
  // let book_author ={}
  // for(let i = 1; i <= 10; i++){
  //   if(books[i]&&books[i].author===author_name){
  //       book_author[i] = books[i];
  //   }
  // }
  // if(Object.keys(book_author).length===0){
  //   return res.status(404).json("Book details not found!")
  // }else{
  // return res.status(300).json(book_author);
  // }
});

// Get all books based on title using asynce-await promises
public_users.get('/title/:title',async function (req, res) {
  let title_name = req.params.title
  let book_title = {}
  for(let i = 1; i <= 10; i++){
    if(books[i] && books[i].title===title_name){
        book_title[i] = books[i];
    }
  }

  const gettitlebook = () => {
    return new Promise((resolve, reject) => {
      if(Object.keys(book_title).length!==0){
        resolve(book_title)
      }else{
       reject("Book details not found!");
      }
      
    })

    
  }

  try {
    let titlebook = await gettitlebook()
    return res.status(200).json({message:titlebook})
  } catch (err) {
    return res.status(500).json({message:err})
  }
  // let title = req.params.title;
  // let book_title ={}
  // for(let i=1;i<=10;i++){
  //   if(books[i].title === title){
  //       book_title[i] =  books[i];
  //   }
  // }
  // if(Object.keys(book_title).length===0){
  //   return res.status(404).json("Book details not found!")
  // }else{
  // return res.status(300).json(book_title);
  // }
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
