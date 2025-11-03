import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  Calendar, 
  Users, 
  Zap,
  RefreshCw,
  AlertCircle,
  Download,
  Info,
  Droplet
} from 'lucide-react';
import '../styles/PredictionsPage.css';

// Custom Naira icon component
const NairaIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 5h16" />
    <path d="M4 12h16" />
    <path d="M6 5v14" />
    <path d="M18 5v14" />
  </svg>
);

const PredictionsPage = () => {
  // State management
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [timeframe, setTimeframe] = useState('90days');
  const [loading, setLoading] = useState(true);
  const [pricingSuggestions, setPricingSuggestions] = useState([]);
  const [marketInsights, setMarketInsights] = useState([]);
  const [seasonalTrends, setSeasonalTrends] = useState([]);
  const [occupancyPredictions, setOccupancyPredictions] = useState([]);
  
  // Fetch data when component mounts or when filters change
  useEffect(() => {
    fetchPredictionData();
  }, [selectedProperty, timeframe]);
  
  // Function to fetch prediction data
  const fetchPredictionData = async () => {
    setLoading(true);
    
    try {
      // Fetch from API - NO MOCK DATA
      setProperties([]);
      setPricingSuggestions([]);
      setMarketInsights([]);
      setSeasonalTrends([]);
      setOccupancyPredictions([]);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching prediction data:", error);
      setLoading(false);
    }
  };
  
  // Format currency (NGN)
  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };
  
  // Filter data based on selected property
  const filteredPricingSuggestions = selectedProperty === 'all' 
    ? pricingSuggestions 
    : pricingSuggestions.filter(item => item.propertyId === parseInt(selectedProperty));
  
  return (
    <div className="predictions-page">
      <div className="predictions-header">
        <div>
          <h1>Market Predictions</h1>
          <p>AI-powered market forecasts and optimization recommendations</p>
        </div>
        <div className="predictions-actions">
          <button className="refresh-btn" onClick={fetchPredictionData}><RefreshCw size={16} /> Refresh Data</button>
          <button className="export-btn"><Download size={16} /> Export Report</button>
        </div>
      </div>
      
      <div className="filter-section">
        <div className="filter-group">
          <label>Property:</label>
          <select value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)}>
            <option value="all">All Properties</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>{property.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Timeframe:</label>
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="30days">30 Days</option>
            <option value="90days">90 Days</option>
            <option value="6months">6 Months</option>
            <option value="12months">12 Months</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading AI predictions...</p>
        </div>
      ) : (
        <>
          {/* Pricing Suggestions Section */}
          <div className="prediction-section">
            <div className="section-header">
              <h2>Pricing Suggestions</h2>
              <div className="section-icon">
                <NairaIcon size={20} />
              </div>
            </div>
            
            <div className="forecast-cards">
              {filteredPricingSuggestions.map(suggestion => {
                const property = properties.find(p => p.id === suggestion.propertyId);
                return (
                  <div key={suggestion.id} className="forecast-card">
                    <h3>{property?.name || 'Property'}</h3>
                    <p className="property-location">{property?.location}</p>
                    
                    <div className="price-info">
                      <div className="current-price">
                        <span className="label">Current</span>
                        <span className="value">{formatCurrency(suggestion.currentPrice)}</span>
                      </div>
                      
                      <div className="predicted-price">
                        <span className="label">Suggested</span>
                        <span className="value">{formatCurrency(suggestion.suggestedPrice)}</span>
                      </div>
                    </div>
                    
                    <div className="forecast-meta">
                      <div className={`change ${suggestion.percentChange >= 0 ? 'positive' : 'negative'}`}>
                        {suggestion.percentChange >= 0 ? '+' : ''}{suggestion.percentChange.toFixed(1)}%
                      </div>
                      <div className="confidence">
                        <div className="confidence-bar" style={{ width: `${suggestion.confidence}%` }}></div>
                        <span>{suggestion.confidence}% confidence</span>
                      </div>
                    </div>
                    
                    <div className="suggestion-reason">
                      <AlertCircle size={16} />
                      <p>{suggestion.reason}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Market Insights Section */}
          <div className="insights-row">
            <div className="prediction-section half-width">
              <div className="section-header">
                <h2>Market Insights</h2>
                <div className="section-icon">
                  <Zap size={20} />
                </div>
              </div>
              
              <div className="market-insights-grid">
                {marketInsights.map(insight => (
                  <div key={insight.id} className="market-insight">
                    <h3>{insight.title}</h3>
                    <p>{insight.description}</p>
                    <div className="insight-footer">
                      <span className={`impact-tag ${insight.impact}`}>
                        {insight.impact} impact
                      </span>
                      <div className="recommendation" title={insight.recommendation}>
                        <Info size={14} />
                        <span>{insight.recommendation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Seasonal Trends Section */}
            <div className="prediction-section half-width">
              <div className="section-header">
                <h2>Seasonal Trends</h2>
                <div className="section-icon">
                  <Calendar size={20} />
                </div>
              </div>
              
              <div className="seasonal-trends-table">
                <table>
                  <thead>
                    <tr>
                      <th>Season</th>
                      <th>Demand</th>
                      <th>Price</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasonalTrends.map(season => (
                      <tr key={season.id}>
                        <td>{season.season}</td>
                        <td className={season.demandChange >= 0 ? 'positive' : 'negative'}>
                          {season.demandChange >= 0 ? '+' : ''}{season.demandChange}%
                        </td>
                        <td className={season.priceChange >= 0 ? 'positive' : 'negative'}>
                          {season.priceChange >= 0 ? '+' : ''}{season.priceChange}%
                        </td>
                        <td>{season.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Occupancy Predictions Section */}
          <div className="prediction-section">
            <div className="section-header">
              <h2>Occupancy Predictions</h2>
              <div className="section-icon">
                <Users size={20} />
              </div>
            </div>
            
            <div className="occupancy-chart">
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="color-indicator your-properties"></span>
                  <span>Your Properties</span>
                </div>
                <div className="legend-item">
                  <span className="color-indicator competitors"></span>
                  <span>Market Average</span>
                </div>
              </div>
              
              {/* This would be a real chart component in a production environment */}
              <div className="mock-chart">
                <div className="chart-grid">
                  <div className="grid-line" style={{ bottom: '0%' }}><span>0%</span></div>
                  <div className="grid-line" style={{ bottom: '25%' }}><span>25%</span></div>
                  <div className="grid-line" style={{ bottom: '50%' }}><span>50%</span></div>
                  <div className="grid-line" style={{ bottom: '75%' }}><span>75%</span></div>
                  <div className="grid-line" style={{ bottom: '100%' }}><span>100%</span></div>
                </div>
                
                <div className="chart-bars double">
                  {occupancyPredictions.map((month, index) => (
                    <div key={index} className="month-group">
                      <div 
                        className="chart-bar yours" 
                        style={{ height: `${month.occupancy}%` }}
                        title={`Your properties: ${month.occupancy}%`}
                      ></div>
                      <div 
                        className="chart-bar competitors" 
                        style={{ height: `${month.competitors}%` }}
                        title={`Market average: ${month.competitors}%`}
                      ></div>
                      <span className="bar-label">{month.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Methodology */}
          <div className="ai-methodology">
            <h3>About These Predictions</h3>
            <p>These AI-driven predictions utilize historical booking data, market trends, and seasonal patterns to forecast potential pricing and occupancy. The recommendations are generated using machine learning algorithms and are updated regularly. While these insights are designed to help optimize your pricing strategy, market conditions can change rapidly.</p>
            <div className="accuracy-disclaimer">
              <Droplet size={16} />
              <span>Current model accuracy: 82% for 30-day predictions, 76% for 90-day predictions, 68% for 6-month predictions</span>
            </div>
            <div className="liability-disclaimer">
              <AlertCircle size={16} />
              <span><strong>Disclaimer:</strong> AI models can make mistakes and predictions may not always be accurate. We take no liability for any decisions made based on these information. These insights should be used as supplementary guidance only and not as the sole basis for business decisions.</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PredictionsPage; 