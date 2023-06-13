import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/Book';
import Author from '../models/Author';

const createBook = (req: Request, res: Response, next: NextFunction) => {
    const { author, title } = req.body;

    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        author,
        title
    });

    return book
        .save()
        .then((book) => res.status(201).json({ book }))
        .catch((error) => res.status(500).json({ error }));
};


const readBook = (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    return Book.findById(bookId)
        .populate('author')
        .then((book) => (book ? res.status(200).json({ book }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Book.find()
        .then((books) => res.status(200).json({ books }))
        .catch((error) => res.status(500).json({ error }));
};

const updateBook = (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    return Book.findById(bookId)
        .then((book) => {
            if (book) {
                book.set(req.body);

                return book
                    .save()
                    .then((book) => res.status(201).json({ book }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteBook = (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    return Book.findByIdAndDelete(bookId)
        .then((book) => (book ? res.status(201).json({ book, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

//Write a function that returns all books by a given author
const readAllByAuthor = (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId;

    return Book.find({ author: authorId })
        .then((books) => res.status(200).json({ books }))
        .catch((error) => res.status(500).json({ error }));
};

//Find the Author name from a book title. The function must use the book title to find the book Id then use the book Id to find the author Id then use the author Id to find the author name. The author and book database models are linked by the author Id.
const findAuthorNameFromBookTitle = (req: Request, res: Response, next: NextFunction) => {
 const bookId = req.params.bookId; // Assuming the book ID is passed as a request parameter

    Book.findById(bookId)   
    .then((book) => {
      if (book) {
        return Author.findById(book.author)
          .then((author) => {
            if (author) {
              res.status(200).json({ author: author.name });
            } else {
              res.status(404).json({ message: 'Author not found' });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};



export default { createBook, readBook, readAll, updateBook, deleteBook, readAllByAuthor, findAuthorNameFromBookTitle };
