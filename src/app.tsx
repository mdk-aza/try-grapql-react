import React, { useState } from 'react'
import {
  createHttpLink,
  ApolloClient,
  InMemoryCache
} from '@apollo/client'

const httpLink = createHttpLink({
    uri: 'http://localhost:8080/v1/graphql',
    headers: {
        'x-hasura-admin-secret': "myadminsecretkey"
    }
})

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

export const App = () => {
  const [todoItemText, setTodoItemText] = useState('')

  return (
    <div>
      <h1>GraphQL Checklist</h1>
      {/* Todo form */}
      <form>
        <input
          type='text'
          name='todo'
          id='todo'
          placeholder='Write your todo'
          value={todoItemText}
          onChange={ev => setTodoItemText(ev.target.value)}
        />
        <button type='submit'>Add</button>
      </form>
      {/* Todo list */}
      <ul>
        <li>
         <span style={{ display: 'inline-block', marginRight: '1em' }}>
           todo item 1
         </span>
          <button type='button'>&#10003;</button>
          <button type='button'>&times;</button>
        </li>
      </ul>
    </div>
  )
}