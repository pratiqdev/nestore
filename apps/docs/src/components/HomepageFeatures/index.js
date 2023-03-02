import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { Calendar3Event } from '@emotion-icons/bootstrap/Calendar3Event'
import { HandIndexThumb } from '@emotion-icons/bootstrap/HandIndexThumb'
import { ChevronBarContract } from '@emotion-icons/bootstrap/ChevronBarContract'

const FeatureList = [
  {
    title: 'Easy to Use',
    Icon: <HandIndexThumb size="50" />,
    description: (
      <>
        Nestore was designed from the ground up to <b>centralize state management</b> and 
        simplify UI updates
      </>
    ),
  },
  {
    title: 'Eventful Pub / Sub',
    Icon: <Calendar3Event size="50"/>,
    description: (
      <>
        Avoid context wrapping, complicated selectors and unnecessary re-renders with <b>event-based architecture</b>
      </>
    ),
  },
  {
    title: 'Centralized Logic',
    Icon: <ChevronBarContract size="50"/>,
    description: (
      <>
        Centralized state and logic with <b>two-way data-binding</b> and in-store mutators and listeners
      </>
    ),
  },
];

function Feature({Icon, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
       {Icon}
      </div>
      <div className="text--center padding-horiz--md padding-vert--md slim-col">
        <h3>{title}</h3>
        <p className={styles.slimcol}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
