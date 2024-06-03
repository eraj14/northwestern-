"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, collection, addDoc, query, where, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import styles from "../../../styles/page.module.css";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import Navbar from '@/components/Navbar';

export default function Message() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [job, setJob] = useState(null);
  const { jobId } = useParams();
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });

    const jobRef = doc(db, 'jobs', jobId);
    getDoc(jobRef).then(docSnap => {
      if (docSnap.exists()) {
        setJob(docSnap.data());
      } else {
        console.error("No such job!");
      }
    });

    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('jobId', '==', jobId));

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesList);

      // Mark all messages as read
      snapshot.docs.forEach(doc => {
        if (doc.data().receiver === auth.currentUser.email && !doc.data().read) {
          updateDoc(doc.ref, { read: true });
        }
      });
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, [jobId, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'messages'), {
        jobId,
        sender: user.email,
        receiver: job.postedBy,
        message,
        read: false,
        timestamp: new Date(),
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        {job && (
          <div className={styles.jobInfo}>
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Reward:</strong> {job.salary}</p>
          </div>
        )}
        <h1>Messages</h1>
        <div className={styles.chatContainer}>
          {messages.map(msg => (
            <div key={msg.id} className={msg.sender === user.email ? styles.messageSent : styles.messageReceived}>
              <p><strong>{msg.sender}</strong>: {msg.message}</p>
              <span>{new Date(msg.timestamp.seconds * 1000).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Type your message..."
            className={styles.input}
          />
          <button type="submit" className={styles.sendButton}>Send</button>
        </form>
      </main>
    </div>
  );
}
