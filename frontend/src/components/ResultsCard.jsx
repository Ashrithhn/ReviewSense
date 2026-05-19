import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function ResultsCard({ results }) {
  // We format data for the Recharts BarChart
  const chartData = [
    {
      name: 'Sentiment',
      score: results.sentiment_score,
    }
  ];

  return (
    <div className="results-section">
      <h2>Analysis Results</h2>
      
      <div className="dashboard-grid">
        {/* Left Column: Summary and Chart */}
        <div className="results-card">
          <h3>Overview</h3>
          <p><strong>Overall Sentiment:</strong> {results.overall_sentiment}</p>
          <p><strong>Summary:</strong> {results.summary}</p>
          
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="score" fill="#3498db" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Praises, Complaints, Themes */}
        <div className="results-card">
          <h3>Top Praises</h3>
          <ul className="praise-list">
            {results.top_praises.map((praise, idx) => <li key={idx}>✅ {praise}</li>)}
          </ul>

          <h3>Top Complaints</h3>
          <ul className="complaint-list">
            {results.top_complaints.map((complaint, idx) => <li key={idx}>⚠️ {complaint}</li>)}
          </ul>

          <h3>Key Themes</h3>
          <div className="themes-container">
            {results.themes.map((theme, idx) => (
              <span key={idx} className="theme-tag">{theme}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsCard;
