import './FreelancerCard.css';

const FreelancerCard = ({ freelancer }) => {
  const { fullName, picture, year, major, skills, funFact } = freelancer;

  return (
    <div className="freelancer-card">
      <img src={picture} alt={fullName} className="freelancer-image" />
      <div className="freelancer-content">
        <h2>{fullName}</h2>
        <p>{year} - {major}</p>
        <p>Skills: {skills.join(', ')}</p>
        <p>Fun Fact: {funFact}</p>
      </div>
    </div>
  );
};

export default FreelancerCard;
