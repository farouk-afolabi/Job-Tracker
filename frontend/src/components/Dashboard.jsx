import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getJobs, reset } from '../features/jobs/jobSlice';
import Spinner from './Spinner';
import JobList from './JobList';  

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs, isLoading, isError, message } = useSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(getJobs());

    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className='heading'>
        <h1>Welcome {user && user.name}</h1>
        <p>Jobs Dashboard</p>
      </section>

      <section className='content'>
        {jobs.length > 0 ? (
          <JobList jobs={jobs} />  
        ) : (
          <h3>You have not added any jobs</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;