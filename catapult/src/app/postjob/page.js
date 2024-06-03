"use client"; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import styles from "../../styles/page.module.css";
import Navbar from '@/components/Navbar';

export default function PostJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [when, setWhen] = useState('');
  const [salary, setSalary] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'jobs'), {
        title,
        description,
        location,
        when,
        salary,
        datePosted: new Date(),
        postedBy: user.email,
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
      <Navbar />

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
            <label className={styles.formLabel}>Needed when:</label>
            <input
              type="text"
              placeholder="Spring Q, June 5, 2024, etc."
              value={when}
              onChange={(e) => setWhen(e.target.value)}
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
