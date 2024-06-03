"use client";  // This ensures the component is treated as a client component
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from "../../styles/page.module.css";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export default function PostJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'jobs'), {
        title,
        description,
        location,
        salary,
      });
      setSuccessMessage('Job posted successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        router.push('/'); // Redirect to home page after showing the success message
      }, 2000); // Show success message for 2 seconds
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.navRight}>
          <Link href="/" legacyBehavior>
            <a className={styles.homeIcon}>
              <FontAwesomeIcon icon={faHome} />
            </a>
          </Link>
        </div>
      </nav>

      <main className={styles.main}>
        <h1>Post a Job</h1>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Reward:</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
              className={styles.formInput}
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      </main>
    </div>
  );
}
