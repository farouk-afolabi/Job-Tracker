import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createJob, updateJob, reset } from '../features/jobs/jobSlice';
import Spinner from './Spinner';

function JobForm({ job }) {
  const [formData, setFormData] = useState({
    company: job?.company || '',
    position: job?.position || '',
    status: job?.status || 'pending',
  });

  const { company, position, status } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (isSuccess) {
      dispatch(reset());
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (job) {
      dispatch(updateJob({ jobId: job._id, jobData: formData }));
    } else {
      dispatch(createJob(formData));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className='form'>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='company'>Company</label>
          <input
            type='text'
            name='company'
            id='company'
            value={company}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='position'>Position</label>
          <input
            type='text'
            name='position'
            id='position'
            value={position}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='status'>Status</label>
          <select
            name='status'
            id='status'
            value={status}
            onChange={onChange}
          >
            <option value='pending'>Pending</option>
            <option value='interview'>Interview</option>
            <option value='declined'>Declined</option>
          </select>
        </div>
        <div className='form-group'>
          <button className='btn btn-block' type='submit'>
            Submit
          </button>
        </div>
      </form>
    </section>
  );
}

export default JobForm;