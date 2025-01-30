import React from 'react';
import BookRecommendationForm from './components/BookRecommendationForm';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <BookRecommendationForm />
    </div>
  );
};

export default App;
