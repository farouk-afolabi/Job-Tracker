import { Link } from 'react-router-dom';

const AddJobFAB = () => {
  return (
    <Link to="/add-job" className="fab">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="2"/>
      </svg>
    </Link>
  );
};

export default AddJobFAB;