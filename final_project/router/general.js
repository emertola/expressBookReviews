const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if both username and password are provided
    if (!username || !password) {
      return res.send("Username and password are required.");
    }
  
    // Check if user already exists using the isValid helper function (or directly array filtering)
    if (isValid(username)) {
      return res.send("User already exists!");
    }
  
    // Register new user
    users.push({ "username": username, "password": password });

    return res.send("Customer successfully registered. Now you can login.");

  });

// Get book list using Async-Await
public_users.get('/', async function (req, res) {
  try {
    // Creating an asynchronous promise wrapper
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };
    
    const bookList = await getBooks();
    
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    const bookByIsbn = JSON.stringify(books[isbn], null, 4);
    return res.send(bookByIsbn);
  }

  return res.send('Book not found');
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const matchingBooks = [];

  bookKeys.forEach((key) => {
    const hasFoundAuthors = books[key].author.toLowerCase().includes(author.toLowerCase());

    if (hasFoundAuthors) {
        matchingBooks.push(books[key]);
    }

})
if (matchingBooks.length) {
    return res.send(JSON.stringify(matchingBooks, null, 4))
}

return res.send("No books found by this author");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const matchingBooks = [];
  
    bookKeys.forEach((key) => {
      const hasFoundTitle = books[key].title.toLowerCase().includes(title.toLowerCase());
  
      if (hasFoundTitle) {
          matchingBooks.push(books[key]);
      }
  
    })
    if (matchingBooks.length) {
        return res.send(JSON.stringify(matchingBooks, null, 4))
    }

    return res.send("No books found with this title");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
  }

  return res.send("Book not found")
});

module.exports.general = public_users;
