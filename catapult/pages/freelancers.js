import React, { useEffect, useState } from 'react';
import FreelancerCard from '../components/FreelancerCard'; 
import user from '../assets/user.jpg';

const FreelancersPage = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fakeFreelancers = [
      {
        id: 1,
        fullName: 'John Doe',
        picture: user,
        year: 'Senior',
        major: 'Computer Science',
        skills: ['React.js', 'Node.js', 'JavaScript', 'HTML', 'CSS'],
        funFact: 'I can solve a Rubik\'s Cube in under a minute!'
      },
      {
        id: 2,
        fullName: 'Jane Smith',
        picture: user,
        year: 'Junior',
        major: 'Graphic Design',
        skills: ['Adobe Photoshop', 'Adobe Illustrator', 'UI/UX Design'],
        funFact: 'I\'ve traveled to over 10 countries!'
      },
    ];

    setFreelancers(fakeFreelancers);
  }, []);

  // Filter freelancers by name
  const filteredFreelancers = freelancers.filter(freelancer =>
    freelancer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Meet Our Freelancers</h1>
      <div>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredFreelancers.map((freelancer) => (
          <FreelancerCard key={freelancer.id} freelancer={freelancer} />
        ))}
      </div>
    </div>
  );
};

export default FreelancersPage;