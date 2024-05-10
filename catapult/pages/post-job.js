import { useState } from 'react';

const PostJobPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [reward, setReward] = useState('');
  const [poster, setPoster] = useState(''); 

  const handleSubmit = (e) => {
    e.preventDefault();
    const jobData = {
      title,
      description,
      date,
      reward,
      poster, 
    };
    console.log('Submitted job data:', jobData);
  };

  return (
    <div>
      <h1>Post a Job</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Reward:</label>
          <input type="text" value={reward} onChange={(e) => setReward(e.target.value)} required />
        </div>
        <div>
          <label>Poster:</label>
          <select value={poster} onChange={(e) => setPoster(e.target.value)}>
            <option value="account">Use Account Info</option>
            <option value="anonymous">Post Anonymously</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostJobPage;
