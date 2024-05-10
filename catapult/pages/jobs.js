import { useEffect, useState } from 'react';
import 'firebase/database'; 
import firebase from 'firebase/app';
import 'firebase/database';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const jobsRef = firebase.database().ref('jobs');

    jobsRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const jobArray = Object.values(data);
        setJobs(jobArray);
      }
    });

    return () => {
      jobsRef.off();
    };
  }, []);

  return (
    <div>
      <h1>Browse Jobs</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {jobs.map((job) => (
          <div key={job.id}>
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <p>Posted by: {job.poster}</p>
            <p>Date: {job.date}</p>
            <p>Reward: {job.reward}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
