// src/app/browsejobs/page.js
"use client"
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import styles from "../../styles/page.module.css";

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchJobs = async () => {
          const jobsCollection = collection(db, 'jobs');
          const jobSnapshot = await getDocs(jobsCollection);
          const jobList = jobSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setJobs(jobList);
          setLoading(false);
        };

        fetchJobs();
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className={styles.main}>
      <h1>Browse Jobs</h1>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <p><b>Location:</b> {job.location}</p>
            <p><b>Salary:</b> {job.salary}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
