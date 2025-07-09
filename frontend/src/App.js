import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getJobs } from './features/jobs/jobSlice';
import Header from './components/Header';
import JobList from './components/JobList';
import Spinner from './components/Spinner';

function App() {
  const dispatch = useDispatch();
  const { jobs, isLoading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  return (
    <div className="app">
      <Header />
      <main>
        {isLoading ? <Spinner /> : <JobList jobs={jobs} />}
      </main>
    </div>
  );
}

export default App;
