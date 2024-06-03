"use client"; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import styles from "../../styles/page.module.css";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export default function Freelancers() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFreelancers = async () => {
      const freelancerCollection = collection(db, 'freelancers');
      const freelancerSnapshot = await getDocs(freelancerCollection);
      const freelancerList = freelancerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFreelancers(freelancerList);
      setLoading(false);
    };

    fetchFreelancers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `freelancers/${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'freelancers'), {
        name,
        email,
        imageUrl,
      });

      router.push('/freelancers'); 
    } catch (error) {
      setError(error.message);
    }
  };

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
      <h1>Freelancers</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.formInput}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.formInput}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Profile Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className={styles.formInput}
          />
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button type="submit" className={styles.submitButton}>Submit</button>
      </form>
      <ul className={styles.freelancerList}>
        {freelancers.map(freelancer => (
          <li key={freelancer.id} className={styles.freelancerCard}>
            <h2>{freelancer.name}</h2>
            <p>{freelancer.email}</p>
            {freelancer.imageUrl && <img src={freelancer.imageUrl} alt={freelancer.name} className={styles.freelancerImage} />}
          </li>
        ))}
      </ul>
    </main>
    </div>
  );
}
