import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import './BookRecommendationForm.css';

interface Book {
  title: string;
  author: string;
  summary: string;
  link: string;
  image?: string;
}

const BookRecommendationForm: React.FC = () => {
  const [interest, setInterest] = useState<string>('');
  const [bookRecommendations, setBookRecommendations] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false); 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const apiKey = process.env.REACT_APP_HUGGING_FACE_API_KEY;
      const googleBooksApiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;
      if (!apiKey) {
        throw new Error('Hugging Face API key is missing');
      }
      if (!googleBooksApiKey) {
        throw new Error('Google Books API key is missing');
      }

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
        {
          inputs: `Suggest 10 books based on the interest of "${interest}". For each book, provide the title, author, and a brief description in the following format: "Title" by Author: Description.`,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response && response.data) {
        const rawText = response.data[0]?.generated_text || '';
        console.log('Raw Text:', rawText);

        const bookEntries = rawText.split('\n').filter((entry: string) => entry.trim() !== '');

        const books: Book[] = bookEntries.map((entry: string) => {
          const match = entry.match(/"([^"]+)"\sby\s([^:]+):\s(.+)/);
          if (match) {
            const [, title, author, summary] = match;
            if (title === "Title" && author === "Author" && summary === "Description.") {
              return null;
            }
            return {
              title: title.trim(),
              author: author.trim(),
              summary: summary.trim(),
              link: `https://www.google.com/search?q=${encodeURIComponent(title)} by ${encodeURIComponent(author)}`,
            };
          }
          return null;
        }).filter((book: Book | null): book is Book => book !== null);

        if (books.length === 0) {
          throw new Error('No books found in the response');
        }

        const booksWithImages = await Promise.all(
          books.map(async (book): Promise<Book> => {
            try {
              const googleBooksResponse = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(book.title)}+inauthor:${encodeURIComponent(book.author)}&key=${googleBooksApiKey}`
              );
              const image = googleBooksResponse.data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
              return { ...book, image };
            } catch (imageError) {
              console.error('Error fetching image from Google Books API:', imageError);
              return book;
            }
          })
        );

        console.log('Books:', booksWithImages);
        setBookRecommendations(booksWithImages);
      } else {
        throw new Error('Invalid response from Hugging Face API');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrorMessage('Unauthorized: Invalid API key');
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
      console.error('Error fetching book recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'dark-mode' : ''}`}>
      <div className="container w-full">
        <div className="form-container">
          <div className="flex justify-between items-center mb-4">
            <h1 className="header">AI-Based Book Recommendations</h1>
            <label className="toggle-switch">
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <span className="slider"></span>
            </label>
          </div>
          <p className="subheader">Get personalized book recommendations based on your interests.</p>
          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
            <label htmlFor="interest" className="text-lg mb-2 text-blue-700 dark:text-blue-300">
              What's your interest? (e.g., business, love, horror, etc.)
            </label>
            <input
              type="text"
              id="interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="Type your interest..."
              className="input mb-4 bg-white dark:bg-gray-800"
            />
            <button 
              type="submit" 
              disabled={loading} 
              className="button bg-white dark:bg-gray-800"
            >
              {loading ? 'Loading...' : 'Get Book Recommendations'}
            </button>
          </form>

          {errorMessage && (
            <div className="mt-4 text-red-500 text-center">
              <p>{errorMessage}</p>
            </div>
          )}
        </div>

        {bookRecommendations.length > 0 && (
          <div className="mt-8">
            <h2 className="header">Recommended Books for Your Interest: {interest}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookRecommendations.map((book, index) => (
                <div key={index} className="card">
                  {book.image && <img src={book.image} alt={book.title} className="w-full h-auto rounded-md mb-4" />}
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{book.title}</h3>
                  <p className="text-md text-gray-600 dark:text-gray-300"><strong>Author:</strong> {book.author}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{book.summary}</p>
                  <a href={book.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-md mt-2 inline-block">
                    Search Online
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRecommendationForm;
