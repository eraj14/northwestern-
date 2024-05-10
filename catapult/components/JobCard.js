
const JobCard = ({ job }) => {
    return (
      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width: '300px' }}>
        <h2>{job.title}</h2>
        <p>{job.description}</p>
        <p>Posted by: {job.poster}</p>
        <p>Date needed: {job.date}</p>
        <p>Reward: {job.reward}</p>
      </div>
    );
  };
  
  export default JobCard;
  