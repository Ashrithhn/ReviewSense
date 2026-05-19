import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import ResultsCard from './components/ResultsCard';
import './App.css';

function App() {
  const [reviewsText, setReviewsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Use PapaParse to read the CSV file
    Papa.parse(file, {
      header: true, // Tells PapaParse the first row contains column names
      skipEmptyLines: true,
      complete: (parsedResults) => {
        const rows = parsedResults.data;
        if (rows.length === 0) {
          setError('The CSV file is empty.');
          return;
        }

        // Try to find the column that contains the reviews
        const columns = Object.keys(rows[0]);
        // Look for common column names like "Review" or "Text", otherwise just grab the first column
        const reviewCol = columns.find(col => 
          col.toLowerCase().includes('review') || col.toLowerCase().includes('text')
        ) || columns[0];

        // Extract just the text from that column and join it with line breaks
        const extractedReviews = rows.map(row => row[reviewCol]).filter(Boolean).join('\n');
        
        // Append the extracted text to our textarea
        setReviewsText(prev => prev ? prev + '\n' + extractedReviews : extractedReviews);
        setError(''); // Clear any previous errors
      },
      error: (err) => {
        setError('Failed to parse CSV file: ' + err.message);
      }
    });
    
    // Reset the input so they can upload the same file again if needed
    e.target.value = null;
  };

  const handleAnalyze = async () => {
    if (!reviewsText.trim()) {
      setError('Please paste some reviews or upload a CSV first.');
      return;
    }

    setError('');
    setLoading(true);
    setResults(null);

    try {
      // Use environment variable for the API URL so it works in both development and production
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await axios.post(`${apiUrl}/analyze`, {
        reviews: reviewsText
      });
      
      setResults(response.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Something went wrong. Is your backend running?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>ReviewSense</h1>
        <p>AI-Powered Customer Feedback Analyzer</p>
      </header>
      
      <main className="main-content">
        <div className="input-section">
          <h2>Paste Your Reviews</h2>
          <textarea 
            className="reviews-textarea"
            placeholder="Paste customer reviews here (one per line)..."
            value={reviewsText}
            onChange={(e) => setReviewsText(e.target.value)}
            rows={8}
          />
          
          <div className="upload-container">
            <span className="upload-label">Or upload a CSV file:</span>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload} 
              className="file-input"
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          
          <button 
            className="analyze-button" 
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : 'Analyze Reviews'}
          </button>
        </div>

        {results && <ResultsCard results={results} />}
      </main>
    </div>
  );
}

export default App;
