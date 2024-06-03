"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEnvelope, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import styles from "../styles/page.module.css";

export default function Navbar() {
  const [newMessages, setNewMessages] = useState(0);
  const [user, setUser] = useState(null);
  const router = useRouter();

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

    return () => unsubscribeAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link href="/" legacyBehavior>
          <a className={styles.homeIcon}>
            <FontAwesomeIcon icon={faHome} />
          </a>
        </Link>
      </div>
      <div className={styles.navRight}>
        <Link href="/messages" legacyBehavior>
          <a className={styles.messageIcon}>
            <FontAwesomeIcon icon={faEnvelope} />
            {newMessages > 0 && <span className={styles.badge}>{newMessages}</span>}
          </a>
        </Link>
        {router.pathname === '/' && user && (
          <span className={styles.username}>
            Hi, {user.email}
            <button onClick={handleSignOut} className={styles.signOutButton}>
              <FontAwesomeIcon icon={faSignOutAlt} />]
            </button>
          </span>
        )}
      </div>
    </nav>
  );
}
