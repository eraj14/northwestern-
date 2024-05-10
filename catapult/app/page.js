"use client" 
import withAuth from "./withAuth";
import Image from "next/image";
import styles from "./page.module.css";
import React from "react";
const FeatureCard = ({ title, description, link }) => (
  <a href={link} className={styles.card} rel="noopener noreferrer">
    <h2>{title} <span>-&gt;</span></h2>
    <p>{description}</p>
  </a>
);

function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1>Welcome to CATapult</h1>
        <p>A freelance platform for Northwestern community</p>
      </div>

      <div className={styles.grid}>
        <FeatureCard
          title="Browse Jobs"
          description="Explore available freelance jobs and projects"
          link="/jobs"
        />
        <FeatureCard
          title="Post a Job"
          description="Hire freelancers by posting your own job listings"
          link="/post-job"
        />
        <FeatureCard
          title="Find Freelancers"
          description="Connect with skilled freelancers for your projects"
          link="/freelancers"
        />
        
      </div>

      <div className={styles.footer}>
        <p> </p>
      </div>
    </main>
  );
}

export default withAuth(Home);
