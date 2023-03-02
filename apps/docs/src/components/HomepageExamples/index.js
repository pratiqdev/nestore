import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import CodeBlock from '@theme/CodeBlock'


const FeatureList = [
  {
    title: 'Create a Simple Store',
    description: (
      <>
        Create your store with key/values and built-in mutators and listeners
      </>
    ),
    link: '/docs/the-basics/create',
    code: 
`import nestore from 'nestore'

const myStore = await nestore({
  logged_in: false,
  user_data: null,

  login: async (nst, [user, password]) => {
    const userData = await Users.findOne({ where: { user_name: user } })
    nst.store.user_data = userData 
    nst.set('logged_in', true)
    return userData
  }
})

export default myStore`,
  },
  {
    title: 'Register some Listeners',
    description: (
      <>
        Setup some callbacks to listen for changes to anything in the store
      </>
    ),
    link: '/docs/api/listeners',
    code: 
`import myStore from './myStore.js'

myStore.on('logged_in', ({ value }) => {
  alert(value ? 'Logged in!' : 'Logged out!')
})

const user = await myStore.login('Alice', 'password1234')`,
  },
  {
    title: 'Mutate the Store',
    description: (
      <>
        Work with your store like a standard ESMap object to get, set and remove values
      </>
    ),
    link: '/docs/api/set',
    code: 
`import myStore from './myStore.js'

let user = myStore.get('user_data.username')

myStore.set('user_data', null)
myStore.remove('user_data')
myStore.reset()
`,
  },
  {
    title: 'Connect to a DB',
    description: (
      <>
        Register adapters to connect and sync with your preferred database
      </>
    ),
    link: '/docs/api/adapters',
    code: 
`import nestore from 'nestore'
import createMongoAdapter from 'nestore-mongo-adapter'

const myStore = await nestore({
  greeting: 'Hello, World!',
}, {
  adapters: [
    createMongoAdapter({
      mongoUri: process.env.MONGO_URI,
      namespace: 'my-mongo-adapter',
      documentKey: 'my-doc-key',
    })
  ]
})
`,
  },
  {
    title: `Beta - PR's welcome!`,
    description: (
      <>
        Nestore is still in beta, contributions / issues / pull-requests are welcome!
      </>
    ),
    link: 'https://github.com/pratiqdev/nestore',
    code: 
`// Repo:            https://github.com/pratiqdev/nestore/
// Bugs:            https://github.com/pratiqdev/nestore/issues
// NPM:             https://npmjs.com/package/nestore
// Version:         0.0.47
`,
  },

  
  
];


function Feature({code, title, description, idx, link}) {
  return (
    <section className={styles.features}>
      <div className={styles.description}>
        <a style={{color: 'inherit'}} href={link}><h3>{title}</h3></a>
        <p>{description}</p>
      </div>
        <CodeBlock
        className={styles.codeblock}
        language="jsx"
        // title="myStore.js"
        // showLineNumbers
        >
        {code}
      </CodeBlock>

    </section>
  );
}

export default function HomepageFeatures() {
  return (
    <>
      {FeatureList.map((props, idx) => (
        <Feature key={idx} idx={idx} {...props} />
      ))}
    </>
  );
}
