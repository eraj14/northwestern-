"use client";
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from "../../styles/page.module.css";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jobCollection = collection(db, 'jobs');

    const unsubscribe = onSnapshot(jobCollection, (snapshot) => {
      const jobList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
        <h1>Job Postings</h1>
        <ul className={styles.jobList}>
          {jobs.map(job => (
            <li key={job.id} className={styles.jobCard}>
              <h2>{job.title}</h2>
              <p>{job.description}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>When:</strong> {job.when}</p>
              <p><strong>Reward:</strong> {job.salary}</p>
              {job.datePosted && job.datePosted.seconds && (
                <p><strong>Date Posted:</strong> {new Date(job.datePosted.seconds * 1000).toLocaleDateString()}</p>
              )}
              <p><strong>Posted by:</strong> {job.postedBy}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
