"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, updatePassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import styles from "../../styles/page.module.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setError('Please verify your email before logging in.');
        return;
      }
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email.endsWith('@u.northwestern.edu')) {
      setError('Email must be a @u.northwestern.edu domain');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, 'temporaryPassword');
      await sendEmailVerification(userCredential.user);
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        name,
        email,
      });
      setIsEmailSent(true);
      setError('Verification email sent. Please check your inbox.');

      const interval = setInterval(async () => {
        await userCredential.user.reload();
        if (userCredential.user.emailVerified) {
          clearInterval(interval);
          setIsEmailVerified(true);
          setError(null);
        }
      }, 3000); 
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      await updatePassword(user, password);
      setError('Password set successfully. Please log in.');
      setIsSignUp(false);
      setEmail('');
      setPassword('');
      setName('');
      setIsEmailSent(false);
      setIsEmailVerified(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setIsEmailSent(false);
    setIsEmailVerified(false);
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
  };

  return (
    <main className={styles.main}>
      <h1>{isSignUp ? (isEmailVerified ? 'Set Password' : 'Sign Up') : 'Login'}</h1>
      <form onSubmit={isSignUp ? (isEmailVerified ? handleSetPassword : handleSignUp) : handleLogin} className={styles.formContainer}>
        {isSignUp && !isEmailSent && (
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
        )}
        <div className={styles.formField}>
          <label className={styles.formLabel}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.formInput}
            disabled={isSignUp && isEmailSent}
          />
        </div>
        {(!isSignUp || isEmailVerified) && (
          <div className={styles.formField}>
            <label className={styles.formLabel}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.formInput}
            />
          </div>
        )}
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button type="submit" className={styles.submitButton}>
          {isSignUp ? (isEmailVerified ? 'Set Password' : 'Sign Up') : 'Login'}
        </button>
      </form>
      <button onClick={toggleSignUp} className={styles.toggleButton}>
        {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
      </button>
    </main>
  );
}
