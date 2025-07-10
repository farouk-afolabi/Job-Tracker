import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';  
import Login from './components/auth/Login';     
import Register from './components/auth/Register';  
import JobForm from './components/JobForm';
import JobSearch from './components/JobSearch';
import Spinner from './components/ui/Spinner';
import { getJobs, reset as resetJobs } from './features/jobs/jobSlice';
import { reset as resetAuth } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.jobs);

  // Clear all states when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetJobs());
      dispatch(resetAuth());
    };
  }, [dispatch]);

  // Load jobs when user is authenticated
  useEffect(() => {
    if (user) {
      dispatch(getJobs());
    }
  }, [user, dispatch]);

  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          {isLoading && <Spinner />}
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-job" element={<JobForm />} />
            <Route path="/edit-job/:id" element={<JobForm />} />
            <Route path="/job-search" element={<JobSearch />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;