import { useState } from 'react';
import axios from 'axios';

export default function JobSearch() {
  // 1. State for search inputs and jobs
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);

  // 2. Handle form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      // 3. Call your backend proxy (not Adzuna directly!)
      const res = await axios.get('/api/job-search', {
        params: { keywords, location },
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
      });
      // 4. Update jobs state with results
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* 5. Search form */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Keywords (e.g., 'react')"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location (e.g., 'toronto')"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* 6. Display jobs */}
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.company.display_name}</p>
            <p>{job.location.display_name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}