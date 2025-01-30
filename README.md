# AI Book Recommender

AI Book Recommender is a React application that provides personalized book recommendations based on user interests. It uses the Hugging Face API to generate book suggestions and the Google Books API to fetch book details and images.

## Features

- Personalized book recommendations based on user interests
- Dark mode support
- Responsive design

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Axios
- Hugging Face API
- Google Books API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/ai-book-recommender.git
   cd ai-book-recommender
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```properties
   REACT_APP_HUGGING_FACE_API_KEY=your_hugging_face_api_key
   REACT_APP_GOOGLE_BOOKS_API_KEY=your_google_books_api_key
   ```

### Running the Application

1. Start the development server:
   ```sh
   npm start
   # or
   yarn start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

### Building for Production

1. Build the application:
   ```sh
   npm run build
   # or
   yarn build
   ```

2. The production-ready files will be in the `build` directory.

### Testing

1. Run tests:
   ```sh
   npm test
   # or
   yarn test
   ```

## Deployment

### Deploying to Vercel

1. Install Vercel CLI (if not already installed):
   ```sh
   npm install -g vercel
   ```

2. Login to Vercel:
   ```sh
   vercel login
   ```

3. Initialize Vercel in your project directory:
   ```sh
   vercel
   ```

4. Follow the prompts:
   ```
   ? Set up and deploy “./”? yes
   ? Which scope should contain your project? 'select your project'
   ? Link to existing project? no
   ? What’s your project’s name? ai-book-recommender
   ? In which directory is your code located? ./
   ```

5. Deploy your application:
   ```sh
   vercel --prod
   ```

6. Add environment variables in the Vercel dashboard under the "Environment Variables" section:
   - `REACT_APP_HUGGING_FACE_API_KEY`
   - `REACT_APP_GOOGLE_BOOKS_API_KEY`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Hugging Face](https://huggingface.co/)
- [Google Books API](https://developers.google.com/books)
- [Create React App](https://create-react-app.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
