const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) =>   {
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
  };

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.send("Error logging in");
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken, username
      };
      return res.send("User successfully logged in");
    } else {
      return res.send("Invalid Login. Check username and password");
    }

  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization ? req.session.authorization['username'] : null;
  
    if (!review) {
      return res.send("Review content is required as a query parameter.");
    }
  
    if (!username) {
      return res.send("User not authenticated.");
    }
  
    if (books[isbn]) {
      // Add or update review under the username key
      books[isbn].reviews[username] = review;
      return res.send(`The review for the book with ISBN ${isbn} has been added/updated.`);
    } else {
      return res.send("Book not found.");
    }
  });

  // Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization ? req.session.authorization['username'] : null;
  
    if (!username) {
      return res.send("User not authenticated.");
    }
  
    if (books[isbn]) {
      let book = books[isbn];
      if (book.reviews[username]) {
        delete book.reviews[username];
        return res.send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`);
      } else {
        return res.send("No review found for this user on the given book.");
      }
    } else {
      return res.send("Book not found.");
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
