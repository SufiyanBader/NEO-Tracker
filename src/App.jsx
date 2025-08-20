import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, differenceInDays } from 'date-fns';
import { CalendarIcon, SearchIcon, RocketIcon, InfoIcon, ClockIcon, AsteriskSquare, ArrowLeft } from 'lucide-react';

// Main App component to handle routing and state
const App = () => {
  const [page, setPage] = useState('dashboard');
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from local storage on initial load
  useEffect(() => {
    try {
      const storedSearches = localStorage.getItem('recentSearches');
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (e) {
      console.error("Could not load recent searches from local storage", e);
    }
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard asteroids={asteroids} loading={loading} error={error} setPage={setPage} recentSearches={recentSearches} />;
      case 'search':
        return <SearchPage setAsteroids={setAsteroids} setLoading={setLoading} setError={setError} setPage={setPage} loading={loading} error={error} setRecentSearches={setRecentSearches} />;
      case 'list':
        return <AsteroidList asteroids={asteroids} setSelectedAsteroid={setSelectedAsteroid} setPage={setPage} />;
      case 'detail':
        return <AsteroidDetail asteroid={selectedAsteroid} setPage={setPage} />;
      case 'about':
        return <AboutPage setPage={setPage} />;
      case 'realtime':
        return <RealTimePage setAsteroids={setAsteroids} setSelectedAsteroid={setSelectedAsteroid} setPage={setPage} />;
      case 'lookup':
        return <AsteroidLookupPage setSelectedAsteroid={setSelectedAsteroid} setPage={setPage} />;
      default:
        return <Dashboard asteroids={asteroids} loading={loading} error={error} setPage={setPage} recentSearches={recentSearches} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      <Header setPage={setPage} />
      {/* Central container for all content to ensure consistent max width and centering */}
      <main className="flex-grow p-6 sm:p-10 container mx-auto max-w-7xl">
        {renderPage()}
      </main>
    </div>
  );
};

// Header component for navigation with enhanced styling
const Header = ({ setPage }) => {
  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b-2 border-indigo-500 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <RocketIcon className="h-8 w-8 text-indigo-400 animate-pulse" />
          <h1 className="text-2xl font-bold tracking-tight text-white">NEO Tracker</h1>
        </div>
        <nav className="space-x-4">
          <button
            onClick={() => setPage('dashboard')}
            className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:bg-gray-700"
          >
            Dashboard
          </button>
          <button
            onClick={() => setPage('search')}
            className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:bg-gray-700"
          >
            Search
          </button>
           <button
            onClick={() => setPage('realtime')}
            className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:bg-gray-700"
          >
            Real-Time
          </button>
          <button
            onClick={() => setPage('lookup')}
            className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:bg-gray-700"
          >
            Lookup
          </button>
          <button
            onClick={() => setPage('about')}
            className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:bg-gray-700"
          >
            About
          </button>
        </nav>
      </div>
    </header>
  );
};

// Loading skeleton component for a professional feel
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="h-32 bg-gray-800 rounded-2xl"></div>
      <div className="h-32 bg-gray-800 rounded-2xl"></div>
      <div className="h-32 bg-gray-800 rounded-2xl"></div>
      <div className="h-32 bg-gray-800 rounded-2xl"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="h-96 bg-gray-800 rounded-3xl"></div>
      <div className="h-96 bg-gray-800 rounded-3xl"></div>
    </div>
  </div>
);

// Dashboard component to display summary info and a chart
const Dashboard = ({ asteroids, loading, error, setPage, recentSearches }) => {
  const [dailyData, setDailyData] = useState([]);
  const [velocityData, setVelocityData] = useState([]);
  const [missDistanceData, setMissDistanceData] = useState([]);

  // Transform asteroid data for the charts
  useEffect(() => {
    if (asteroids.length > 0) {
      const dailyCounts = {};
      const allVelocities = [];
      const allMissDistances = [];

      asteroids.forEach(asteroid => {
        const closeApproachDate = asteroid.close_approach_data?.[0]?.close_approach_date;
        if (closeApproachDate) {
          const date = format(new Date(closeApproachDate), 'yyyy-MM-dd');
          dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        }

        const velocity = asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second;
        if (velocity) {
          allVelocities.push(parseFloat(velocity));
        }

        const missDistance = asteroid.close_approach_data?.[0]?.miss_distance?.kilometers;
        if (missDistance) {
          allMissDistances.push(parseFloat(missDistance));
        }
      });

      const formattedDailyData = Object.keys(dailyCounts).sort().map(date => ({
        date,
        count: dailyCounts[date]
      }));
      setDailyData(formattedDailyData);
      
      const velocityBuckets = allVelocities.reduce((acc, vel) => {
        const bucket = Math.floor(vel / 1000) * 1000;
        acc[bucket] = (acc[bucket] || 0) + 1;
        return acc;
      }, {});

      const formattedVelocityData = Object.keys(velocityBuckets).sort((a,b) => a-b).map(bucket => ({
        velocityRange: `${bucket}-${parseInt(bucket) + 999} km/s`,
        count: velocityBuckets[bucket]
      }));
      setVelocityData(formattedVelocityData);

      const missDistanceBuckets = allMissDistances.reduce((acc, dist) => {
        const bucket = Math.floor(dist / 100000) * 100000;
        const bucketLabel = `${bucket}-${bucket + 99999} km`;
        acc[bucketLabel] = (acc[bucketLabel] || 0) + 1;
        return acc;
      }, {});

      const formattedMissDistanceData = Object.keys(missDistanceBuckets).sort().map(range => ({
        missDistanceRange: range,
        count: missDistanceBuckets[range]
      }));
      setMissDistanceData(formattedMissDistanceData);

    } else {
      setDailyData([]);
      setVelocityData([]);
      setMissDistanceData([]);
    }
  }, [asteroids]);

  // Safely get counts and properties
  const totalAsteroids = asteroids.length;
  const isPotentiallyHazardousCount = asteroids.filter(a => a.is_potentially_hazardous_asteroid).length;
  const largestAsteroid = asteroids.reduce((max, current) => {
    const currentMax = current.estimated_diameter?.kilometers?.estimated_diameter_max;
    const maxDiameter = max?.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
    return currentMax > maxDiameter ? current : max;
  }, null);
  const averageVelocity = asteroids.reduce((sum, current) => {
    const velocity = current.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second;
    return sum + (velocity ? parseFloat(velocity) : 0);
  }, 0) / (asteroids.length || 1);
  const minDiameter = asteroids.reduce((min, current) => {
    const currentMin = current.estimated_diameter?.kilometers?.estimated_diameter_min;
    return currentMin < min ? currentMin : Infinity;
  }, Infinity);
  const maxDiameter = asteroids.reduce((max, current) => {
    const currentMax = current.estimated_diameter?.kilometers?.estimated_diameter_max;
    return currentMax > max ? currentMax : 0;
  }, 0);
  const minMissDistance = asteroids.reduce((min, current) => {
    const currentMiss = current.close_approach_data?.[0]?.miss_distance?.kilometers;
    return currentMiss < min ? parseFloat(currentMiss) : Infinity;
  }, Infinity);
  const maxMissDistance = asteroids.reduce((max, current) => {
    const currentMiss = current.close_approach_data?.[0]?.miss_distance?.kilometers;
    return currentMiss > max ? parseFloat(currentMiss) : 0;
  }, 0);


  const getLargestAsteroidName = () => largestAsteroid?.name || 'N/A';
  const getLargestAsteroidDiameter = () => largestAsteroid?.estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(2) || 'N/A';
  const getAverageVelocity = () => averageVelocity.toFixed(2) || 'N/A';
  const getMinDiameter = () => (minDiameter !== Infinity ? minDiameter.toFixed(2) : 'N/A');
  const getMaxDiameter = () => (maxDiameter !== 0 ? maxDiameter.toFixed(2) : 'N/A');
  const getMinMissDistance = () => (minMissDistance !== Infinity ? minMissDistance.toFixed(0) : 'N/A');
  const getMaxMissDistance = () => (maxMissDistance !== 0 ? maxMissDistance.toFixed(0) : 'N/A');
  
  const COLORS = ['#6366f1', '#4ade80', '#facc15', '#ef4444', '#a855f7'];

  return (
    <div className="space-y-10">
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Total Asteroids" value={totalAsteroids} icon={<RocketIcon />} />
            <Card title="Potentially Hazardous" value={isPotentiallyHazardousCount} icon={<span className="text-red-400">⚠️</span>} />
            <Card title="Largest Asteroid (km)" value={getLargestAsteroidDiameter()} subValue={getLargestAsteroidName()} icon={<span className="text-yellow-400">🪐</span>} />
            <Card title="Avg. Velocity (km/s)" value={getAverageVelocity()} icon={<span className="text-blue-400">⚡</span>} />
            <Card title="Min Diameter (km)" value={getMinDiameter()} icon={<span className="text-pink-400">🔽</span>} />
            <Card title="Max Diameter (km)" value={getMaxDiameter()} icon={<span className="text-cyan-400">🔼</span>} />
            <Card title="Min Miss Distance (km)" value={getMinMissDistance()} icon={<span className="text-orange-400">📏</span>} />
            <Card title="Max Miss Distance (km)" value={getMaxMissDistance()} icon={<span className="text-teal-400">📈</span>} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl border-2 border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-white">Asteroids Tracked Over Time</h2>
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="date" stroke="#cbd5e0" tick={{ fill: '#a0aec0' }} />
                    <YAxis stroke="#cbd5e0" tick={{ fill: '#a0aec0' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568', color: '#cbd5e0' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" fillOpacity={0.8} fill="url(#colorCount)" />
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-10 text-gray-400">No chart data available. Please perform a search.</div>
              )}
            </div>
            
            <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl border-2 border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-white">Velocity Distribution</h2>
              {velocityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={velocityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="velocityRange" stroke="#cbd5e0" tick={{ fill: '#a0aec0' }} />
                    <YAxis stroke="#cbd5e0" tick={{ fill: '#a0aec0' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568', color: '#cbd5e0' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="count" fill="#4ade80" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-10 text-gray-400">No chart data available. Please perform a search.</div>
              )}
            </div>
            
            <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl border-2 border-gray-700 lg-col-span-2">
              <h2 className="text-xl font-semibold mb-6 text-white">Miss Distance Distribution</h2>
              {missDistanceData.length > 0 ? (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={missDistanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                      <XAxis dataKey="missDistanceRange" stroke="#cbd5e0" tick={{ fill: '#a0aec0' }} />
                      <YAxis stroke="#cbd5e0" tick={{ fill: '#a0aec0' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568', color: '#cbd5e0' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="count" fill="#facc15" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">No miss distance data available for this search.</div>
              )}
            </div>
            
            <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl border-2 border-gray-700">
                <h2 className="text-xl font-semibold mb-6 text-white">Recent Searches</h2>
                {recentSearches.length > 0 ? (
                  <ul className="space-y-2">
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <li key={index} className="bg-gray-700 p-3 rounded-lg text-sm text-gray-300 hover:bg-gray-600 transition-colors cursor-pointer">
                        {search}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No recent searches. Start a search to see history here.</p>
                )}
            </div>

          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={() => setPage('search')}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start a New Search
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const Card = ({ title, value, subValue, icon }) => (
  <div className="bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center border border-gray-700 transition-all duration-300 transform hover:scale-105">
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className="text-sm uppercase font-semibold text-gray-400 tracking-wide">{title}</h3>
    <p className="text-4xl font-extrabold text-white mt-2">{value}</p>
    {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
  </div>
);

// Search page component
const SearchPage = ({ setAsteroids, setLoading, setError, setPage, loading, error, setRecentSearches }) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const fetchAsteroids = useCallback(async () => {
    if (!startDate || !endDate) {
      setError('Please select both a start and end date.');
      return;
    }

    const days = differenceInDays(new Date(endDate), new Date(startDate));
    if (days > 7 || days < 0) {
      setError('The date range cannot be more than 7 days.');
      return;
    }

    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_NASA_API_KEY;
    const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const data = await response.json();
      const allAsteroids = Object.values(data.near_earth_objects).flat();
      setAsteroids(allAsteroids);
      
      // Update recent searches in local storage
      setRecentSearches(prevSearches => {
        const newSearch = `${startDate} to ${endDate}`;
        const updatedSearches = [newSearch, ...prevSearches.filter(s => s !== newSearch)].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        return updatedSearches;
      });

      setPage('list');
    } catch (e) {
      console.error("Error fetching asteroid data:", e);
      setError('Failed to fetch asteroid data. Please check the dates and your API key.');
      setAsteroids([]);
      setPage('dashboard');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, setAsteroids, setLoading, setError, setPage, setRecentSearches]);

  return (
    <div className="w-full flex flex-col items-center space-y-8 p-6 bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-700">
      <h2 className="text-3xl font-bold text-white">Search Near-Earth Objects</h2>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full justify-center">
        <div className="relative w-full sm:w-1/2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative w-full sm:w-1/2">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <button
        onClick={fetchAsteroids}
        disabled={loading}
        className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>Searching...</span>
          </>
        ) : (
          <>
            <SearchIcon className="h-5 w-5" />
            <span>Search Asteroids</span>
          </>
        )}
      </button>
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </div>
  );
};

// Component to display the list of asteroids with a more modern table design
const AsteroidList = ({ asteroids, setSelectedAsteroid, setPage }) => {
  return (
    <div className="w-full bg-gray-800 p-6 rounded-2xl shadow-xl border-2 border-gray-700">
      <div className="flex justify-start items-center mb-6">
        <button 
          onClick={() => setPage('search')} 
          className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="ml-2 font-semibold">Back</span>
        </button>
        <h2 className="text-3xl font-bold text-white">Asteroid Search Results</h2>
      </div>
      {asteroids.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No asteroids found for this date range.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Close Approach Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Hazardous</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {asteroids.map((asteroid, index) => (
                <tr key={index} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{asteroid.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {format(new Date(asteroid.close_approach_data?.[0]?.close_approach_date || Date.now()), 'MMMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        asteroid.is_potentially_hazardous_asteroid ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                      }`}
                    >
                      {asteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      onClick={() => {
                        setSelectedAsteroid(asteroid);
                        setPage('detail');
                      }}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors transform hover:scale-110"
                    >
                      {asteroid.neo_reference_id}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Component to display detailed asteroid information
const AsteroidDetail = ({ asteroid, setPage }) => {
  if (!asteroid) {
    return (
      <div className="text-center py-10 text-gray-400">
        No asteroid selected.
        <button 
          onClick={() => setPage('list')} 
          className="flex items-center text-indigo-400 hover:underline block mt-4 mx-auto"
        >
          <ArrowLeft className="h-5 w-5 mr-2"/>
          Back
        </button>
      </div>
    );
  }

  const {
    name,
    is_potentially_hazardous_asteroid,
    estimated_diameter,
    close_approach_data,
    nasa_jpl_url,
    orbital_data,
    absolute_magnitude_h
  } = asteroid;

  // Function to render a detail item
  const DetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
      <span className="text-gray-400 font-medium">{label}</span>
      <span className="text-white text-right">{String(value ?? 'N/A')}</span>
    </div>
  );

  return (
    <div className="w-full bg-gray-800 p-6 rounded-2xl shadow-xl border-2 border-gray-700">
      <div className="flex justify-start items-center mb-6">
        <button 
          onClick={() => setPage('list')} 
          className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="ml-2 font-semibold">Back</span>
        </button>
        <h2 className="text-3xl font-bold text-white">{name}</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white mb-2">Physical Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-indigo-400 mb-2">Estimated Diameter</h4>
            <DetailItem label="Kilometers" value={`${estimated_diameter?.kilometers?.estimated_diameter_min?.toFixed(2) || 'N/A'} - ${estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(2) || 'N/A'}`} />
            <DetailItem label="Meters" value={`${estimated_diameter?.meters?.estimated_diameter_min?.toFixed(2) || 'N/A'} - ${estimated_diameter?.meters?.estimated_diameter_max?.toFixed(2) || 'N/A'}`} />
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-indigo-400 mb-2">Orbital Data</h4>
            {orbital_data ? (
              <>
                <DetailItem label="Absolute Magnitude (H)" value={absolute_magnitude_h} />
                <DetailItem label="Orbit Class" value={orbital_data.orbit_class?.orbit_class_description} />
              </>
            ) : (
              <p className="text-gray-400">No orbital data available.</p>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mt-8 mb-2">Close Approach Data</h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          {close_approach_data && close_approach_data.length > 0 ? (
            close_approach_data.map((data, index) => (
              <div key={index} className="space-y-2 mb-4 p-4 rounded-lg bg-gray-600 last:mb-0">
                <DetailItem label="Date" value={data.close_approach_date_full} />
                <DetailItem label="Velocity (km/s)" value={data.relative_velocity?.kilometers_per_second ? parseFloat(data.relative_velocity.kilometers_per_second).toFixed(2) : 'N/A'} />
                <DetailItem label="Miss Distance (km)" value={data.miss_distance?.kilometers ? parseFloat(data.miss_distance.kilometers).toFixed(2) : 'N/A'} />
                <DetailItem label="Orbiting Body" value={data.orbiting_body} />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No close approach data available.</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-700">
        <a
          href={nasa_jpl_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
        >
          View on NASA JPL
        </a>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            is_potentially_hazardous_asteroid ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {is_potentially_hazardous_asteroid ? 'Potentially Hazardous' : 'Not Hazardous'}
        </span>
      </div>
    </div>
  );
};

// New About page component
const AboutPage = ({ setPage }) => (
  <div className="w-full bg-gray-800 p-8 rounded-2xl shadow-xl border-2 border-gray-700">
    <div className="flex justify-start items-center mb-6">
      <button 
        onClick={() => setPage('dashboard')} 
        className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mr-4"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="ml-2 font-semibold">Back</span>
      </button>
      <div className="flex items-center justify-center flex-grow">
        <InfoIcon className="h-8 w-8 text-indigo-400 mr-4" />
        <h2 className="text-3xl font-bold text-white">About This Project</h2>
      </div>
    </div>
    <div className="text-gray-300 space-y-4">
      <p>
        The <span className="font-bold">NEO Tracker</span> is a web application designed as a <span className="font-bold">DevOps</span> project to showcase modern web development and deployment practices. It leverages the official <span className="font-bold">NASA Near-Earth Object (NEO) Web Service API</span> to provide real-time information about asteroids and comets.
      </p>
      <p>
        The primary goal of this application is to serve as a hands-on project for tracking celestial bodies, with features like date-range search and detailed data visualization.
      </p>
      <h3 className="text-xl font-semibold text-white mt-8 mb-4">Features:</h3>
      <ul className="list-disc list-inside space-y-2">
        <li><span className="font-bold">Dynamic Dashboard:</span> Displays key statistics such as the total number of asteroids, hazardous counts, and more, using interactive charts.</li>
        <li><span className="font-bold">Date-Range Search:</span> Users can search for all asteroids tracked within a 7-day period, as per the API's limit.</li>
        <li><span className="font-bold">Detailed Information:</span> Selecting an asteroid from the search results reveals detailed information about its physical properties and close approach data.</li>
        <li><span className="font-bold">Asteroid Lookup:</span> A dedicated tab to search for a specific asteroid by ID.</li>
        <li><span className="font-bold">Professional UI/UX:</span> The user interface is built with <span className="font-bold">React</span> and styled using <span className="font-bold">Tailwind CSS</span> to be fully responsive and visually appealing.</li>
        <li><span className="font-bold">Recent Searches:</span> The application saves and displays your recent searches using local storage for quick access.</li>
      </ul>
      <h3 className="text-xl font-semibold text-white mt-8 mb-4">Technology Stack:</h3>
      <ul className="list-disc list-inside space-y-2">
        <li><span className="font-bold">Frontend:</span> <span className="font-bold">React</span> with Vite for a fast development experience.</li>
        <li><span className="font-bold">Styling:</span> <span className="font-bold">Tailwind CSS</span> for a utility-first approach to modern design.</li>
        <li><span className="font-bold">Data Visualization:</span> <span className="font-bold">`recharts`</span> library for creating professional charts and graphs.</li>
        <li><span className="font-bold">API:</span> <span className="font-bold">NASA's Near-Earth Object Web Service (NeoWs) API.</span></li>
        <li><span className="font-bold">State Management:</span> React's built-in <span className="font-bold">`useState`</span> and <span className="font-bold">`useEffect`</span> hooks.</li>
      </ul>
    </div>
  </div>
);

// New component for the real-time view
const RealTimePage = ({ setAsteroids, setSelectedAsteroid, setPage }) => {
    const [todayAsteroids, setTodayAsteroids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const today = format(new Date(), 'yyyy-MM-dd');
    const apiKey = "6jBXJUDiRMarz9MK5wJqE30stdduX6FcgMYGfrn4";
    const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`;

    useEffect(() => {
        const fetchTodayAsteroids = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`API returned status ${response.status}`);
                }
                const data = await response.json();
                const asteroidsToday = Object.values(data.near_earth_objects).flat();
                setTodayAsteroids(asteroidsToday);
            } catch (e) {
                console.error("Error fetching today's asteroid data:", e);
                setError("Failed to fetch today's asteroid data.");
            } finally {
                setLoading(false);
            }
        };
        fetchTodayAsteroids();
    }, [apiUrl]);
    
    // Logic to select an asteroid and switch pages
    const handleViewDetails = useCallback((asteroid) => {
      setSelectedAsteroid(asteroid);
      setPage('detail');
    }, [setSelectedAsteroid, setPage]);

    return (
        <div className="w-full space-y-8">
            <div className="flex justify-start items-center mb-6">
                <button 
                  onClick={() => setPage('dashboard')} 
                  className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mr-4"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="ml-2 font-semibold">Back</span>
                </button>
                <h2 className="text-3xl font-bold text-white">Real-Time Asteroids: {today}</h2>
            </div>
            {loading && <LoadingSkeleton />}
            {error && <div className="text-center py-10 text-red-400 bg-gray-800 p-6 rounded-2xl shadow-xl">{error}</div>}
            {!loading && !error && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card title="Asteroids Today" value={todayAsteroids.length} icon={<RocketIcon />} />
                        <Card title="Hazardous Today" value={todayAsteroids.filter(a => a.is_potentially_hazardous_asteroid).length} icon={<span className="text-red-400">⚠️</span>} />
                    </div>
                    
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border-2 border-gray-700">
                      <h3 className="text-xl font-semibold mb-6 text-white">Today's Near-Earth Objects</h3>
                        {todayAsteroids.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">No asteroids found for today.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Close Approach Date</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Hazardous</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {todayAsteroids.map((asteroid, index) => (
                                            <tr key={index} className="hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{asteroid.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {format(new Date(asteroid.close_approach_data?.[0]?.close_approach_date || Date.now()), 'MMMM d, yyyy')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            asteroid.is_potentially_hazardous_asteroid ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                                                        }`}
                                                    >
                                                        {asteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAsteroid(asteroid);
                                                            setPage('detail');
                                                        }}
                                                        className="text-indigo-400 hover:text-indigo-300 transition-colors transform hover:scale-110"
                                                    >
                                                        {asteroid.neo_reference_id}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};


// New component for the asteroid lookup feature
const AsteroidLookupPage = ({ setSelectedAsteroid, setPage }) => {
    const [asteroidId, setAsteroidId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [foundAsteroid, setFoundAsteroid] = useState(null);

    const handleSearch = useCallback(async () => {
        if (!asteroidId) {
            setError('Please enter an asteroid ID.');
            return;
        }

        setLoading(true);
        setError(null);
        setFoundAsteroid(null);

        const apiKey = "6jBXJUDiRMarz9MK5wJqE30stdduX6FcgMYGfrn4";
        const apiUrl = `https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            if (response.status === 404) {
                setError(`Asteroid with ID "${asteroidId}" not found.`);
                return;
            }
            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }
            const data = await response.json();
            setFoundAsteroid(data);
        } catch (e) {
            console.error("Error fetching asteroid data:", e);
            setError('Failed to fetch asteroid data. Please check the ID and your API key.');
        } finally {
            setLoading(false);
        }
    }, [asteroidId]);

  // Function to render a detail item for this page
  const DetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
      <span className="text-gray-400 font-medium">{label}</span>
      <span className="text-white text-right">{value}</span>
    </div>
  );

    return (
        <div className="w-full flex flex-col items-center space-y-8 p-6 bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-700">
            <div className="flex justify-start items-center w-full">
                <button 
                  onClick={() => setPage('dashboard')} 
                  className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mr-4"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="ml-2 font-semibold">Back</span>
                </button>
                <h2 className="text-3xl font-bold text-white">Asteroid Lookup by Name</h2>
            </div>
            
            <p className="text-gray-400 text-center w-full max-w-md mb-6">
                Enter a NASA JPL Small Body ID to get details about a specific asteroid.
                You can find IDs from the search results on the "Search" page.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full justify-center max-w-md mb-6">
                <input
                    type="text"
                    value={asteroidId}
                    onChange={(e) => setAsteroidId(e.target.value)}
                    placeholder="Enter Asteroid ID (e.g., 3726712)"
                    className="w-full bg-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                            <span>Searching...</span>
                        </>
                    ) : (
                        <>
                            <SearchIcon className="h-5 w-5" />
                            <span>Lookup</span>
                        </>
                    )}
                </button>
            </div>
            
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            
            {foundAsteroid && (
                <div className="mt-8 w-full max-w-2xl">
                    <h3 className="text-2xl font-bold text-white mb-4">{foundAsteroid.name}</h3>
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-indigo-400 mb-2">Physical Data</h4>
                      <DetailItem label="Absolute Magnitude (H)" value={foundAsteroid.absolute_magnitude_h} />
                      <DetailItem label="Estimated Diameter (km)" value={`${foundAsteroid.estimated_diameter?.kilometers?.estimated_diameter_min?.toFixed(2) || 'N/A'} - ${foundAsteroid.estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(2) || 'N/A'}`} />

                      <h4 className="text-lg font-semibold text-indigo-400 mb-2 mt-6">Orbital Data</h4>
                      {foundAsteroid.orbital_data ? (
                        <>
                          <DetailItem label="Orbit Class" value={foundAsteroid.orbital_data.orbit_class?.orbit_class_description} />
                          <DetailItem label="First Observation Date" value={foundAsteroid.orbital_data.first_observation_date} />
                          <DetailItem label="Last Observation Date" value={foundAsteroid.orbital_data.last_observation_date} />
                          <DetailItem label="Orbital Period (days)" value={foundAsteroid.orbital_data.orbital_period ? parseFloat(foundAsteroid.orbital_data.orbital_period).toFixed(2) : 'N/A'} />
                          <DetailItem label="Semi-Major Axis (AU)" value={foundAsteroid.orbital_data.semi_major_axis ? parseFloat(foundAsteroid.orbital_data.semi_major_axis).toFixed(2) : 'N/A'} />
                        </>
                      ) : (
                        <p className="text-gray-400">No orbital data available.</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-700">
                      <a
                          href={foundAsteroid.nasa_jpl_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                        >
                          View on NASA JPL
                        </a>
                        <button
                          onClick={() => {
                            setSelectedAsteroid(foundAsteroid);
                            setPage('detail');
                          }}
                          className="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                        >
                          View All Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
