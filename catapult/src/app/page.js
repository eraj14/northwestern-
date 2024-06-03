"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import styles from "../styles/page.module.css";
import withAuth from '../components/withAuth';

function Home() {
  const [user, setUser] = useState(null);
  const [newMessages, setNewMessages] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const messagesRef = collection(db, 'messages');
        const q = query(messagesRef, where('receiver', '==', currentUser.email), where('read', '==', false));

        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
          setNewMessages(snapshot.size);
        });

        return () => unsubscribeMessages();
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.navRight}>
          {user ? (
            <>
              <span className={styles.username}>
                Hi, {user.email}
                <button onClick={handleSignOut} className={styles.signOutButton}><FontAwesomeIcon icon={faSignOutAlt} /></button>
              </span>
              <Link href="/messages" legacyBehavior>
                <a className={styles.messageIcon}>
                  <FontAwesomeIcon icon={faEnvelope} />
                  {newMessages > 0 && <span className={styles.badge}>{newMessages}</span>}
                </a>
              </Link>
            </>
          ) : (
            <Link href="/login" legacyBehavior>
              <a className={styles.loginIcon}>
                <FontAwesomeIcon icon={faSignInAlt} />
              </a>
            </Link>
          )}
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.hero}>
          <p>
            <b>Welcome to CATapult! <br /></b>
            A freelance platform for Northwestern Community
          </p>
        </div>

        <div className={styles.grid}>
          <Link href="/browsejobs" legacyBehavior>
            <a className={styles.card}>
              <h2>
                Browse Jobs <span>-&gt;</span>
              </h2>
              <p>Explore available jobs and tasks!</p>
            </a>
          </Link>

          <Link href="/postjob" legacyBehavior>
            <a className={styles.card}>
              <h2>
                Post a Job <span>-&gt;</span>
              </h2>
              <p>Find the right talent for your job.</p>
            </a>
          </Link>

          <Link href="/freelancers" legacyBehavior>
            <a className={styles.card}>
              <h2>
                Freelancers <span>-&gt;</span>
              </h2>
              <p>Browse through freelancer profiles.</p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default withAuth(Home);
