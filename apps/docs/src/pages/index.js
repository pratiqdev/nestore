import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageExamples from '@site/src/components/HomepageExamples';
import Head from '@docusaurus/Head';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <Head>
        <meta property="og:description" content="My custom description" />
        <meta charSet="utf-8" />
        <title>nestore</title>
        {/* <link rel="canonical" href="http://nestore-docs.vercel.app" /> */}
      </Head>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title} <code className={styles.beta}>beta</code></h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--md"
            style={{marginRight: '1rem', borderColor: '#fff', minWidth: '10rem'}}
            to="/docs/intro">
            Introduction
          </Link>
          <Link
            className="button button--secondary button--md"
            style={{ minWidth: '14rem'}}
            to="/docs/getting-started/installation">
            Getting Started
          </Link>
          <Link
            className="button button--primary button--md"
            style={{marginLeft: '1rem', borderColor: '#fff', minWidth: '10rem'}}
            to="https://github.com/pratiqdev/nestore">
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageExamples />
      </main>
    </Layout>
  );
}
