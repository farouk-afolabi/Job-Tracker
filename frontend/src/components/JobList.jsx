import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteJob } from '../features/jobs/jobSlice';

const JobList = ({ jobs }) => {
  const dispatch = useDispatch();

  return (
    <div className="jobs">
      {jobs.map((job) => (
        <div key={job._id} className="job">
          <div className="job-info">
            <h3>{job.company}</h3>
            <p>{job.position}</p>
            <p className={`status status-${job.status}`}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </p>
          </div>
          <div className="job-actions">
            <Link to={`/edit-job/${job._id}`} className="btn btn-edit">
              Edit
            </Link>
            <button
              onClick={() => dispatch(deleteJob(job._id))}
              className="btn btn-delete"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobList;