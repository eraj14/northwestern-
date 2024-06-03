"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import styles from "../../styles/page.module.css";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Navbar from '@/components/Navbar';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [user, setUser] = useState(null);
  const [newMessages, setNewMessages] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const messagesRef = collection(db, 'messages');

        // Combine queries for messages where the user is either the sender or the receiver
        const q = query(messagesRef, where('receiver', '==', currentUser.email));
        const q2 = query(messagesRef, where('sender', '==', currentUser.email));

        const unsubscribeMessages = onSnapshot(q, async (snapshot) => {
          const convoMap = {};
          await Promise.all(snapshot.docs.map(async (msgDoc) => {
            const data = msgDoc.data();
            const jobId = data.jobId;
            const jobDocRef = doc(db, 'jobs', jobId);
            const jobDoc = await getDoc(jobDocRef);
            const jobDescription = jobDoc.exists() ? jobDoc.data().description : 'Job not found';

            const chatKey = `${[data.sender, data.receiver].sort().join('-')}-${jobId}`;
            if (!convoMap[chatKey]) {
              convoMap[chatKey] = {
                id: msgDoc.id,
                sender: data.sender,
                receiver: data.receiver,
                jobDescription: jobDescription,
                lastMessage: data.message,
                timestamp: data.timestamp,
                read: data.read,
                jobId: jobId,
              };
            } else if (data.timestamp.seconds > convoMap[chatKey].timestamp.seconds) {
              convoMap[chatKey].lastMessage = data.message;
              convoMap[chatKey].timestamp = data.timestamp;
              convoMap[chatKey].read = data.read;
            }
          }));

          setConversations(Object.values(convoMap));
        });

        const unsubscribeMessages2 = onSnapshot(q2, async (snapshot) => {
          const convoMap = {};
          await Promise.all(snapshot.docs.map(async (msgDoc) => {
            const data = msgDoc.data();
            const jobId = data.jobId;
            const jobDocRef = doc(db, 'jobs', jobId);
            const jobDoc = await getDoc(jobDocRef);
            const jobDescription = jobDoc.exists() ? jobDoc.data().description : 'Job not found';

            const chatKey = `${[data.sender, data.receiver].sort().join('-')}-${jobId}`;
            if (!convoMap[chatKey]) {
              convoMap[chatKey] = {
                id: msgDoc.id,
                sender: data.sender,
                receiver: data.receiver,
                jobDescription: jobDescription,
                lastMessage: data.message,
                timestamp: data.timestamp,
                read: data.read,
                jobId: jobId,
              };
            } else if (data.timestamp.seconds > convoMap[chatKey].timestamp.seconds) {
              convoMap[chatKey].lastMessage = data.message;
              convoMap[chatKey].timestamp = data.timestamp;
              convoMap[chatKey].read = data.read;
            }
          }));

          setConversations(prevConversations => {
            const combinedConversations = { ...prevConversations, ...convoMap };
            return Object.values(combinedConversations);
          });
        });

        const qNewMessages = query(messagesRef, where('receiver', '==', currentUser.email), where('read', '==', false));

        const unsubscribeNewMessages = onSnapshot(qNewMessages, (snapshot) => {
          setNewMessages(snapshot.size);
        });

        return () => {
          unsubscribeMessages();
          unsubscribeMessages2();
          unsubscribeNewMessages();
        };
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <h1>Conversations</h1>
        <ul className={styles.conversationList}>
          {conversations.map(convo => (
            <li key={convo.id} className={`${styles.conversationItem} ${convo.read ? styles.readMessage : styles.unreadMessage}`}>
              <Link href={`/message/${convo.jobId}`} legacyBehavior>
                <a>
                  <p><strong>From:</strong> {convo.sender}</p>
                  <p><strong>About Job:</strong> {convo.jobDescription}</p>
                  <p><strong>Last Message:</strong> {convo.lastMessage}</p>
                  <p><em>{new Date(convo.timestamp.seconds * 1000).toLocaleString()}</em></p>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
