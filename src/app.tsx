import React, { useState } from 'react';
import { WebSocketLink } from '@apollo/client/link/ws';
import {
  ApolloClient,
  InMemoryCache,
  gql,
  useMutation,
  useSubscription
} from '@apollo/client';

const websocketLink = new WebSocketLink({
  uri: 'ws://localhost:8080/v1/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        'x-hasura-admin-secret': "myadminsecretkey"
      }
    }
  }
});

export const client = new ApolloClient({
  link: websocketLink,
  cache: new InMemoryCache()
});

const GET_TODOS = gql`
  subscription getTodos {
    todos {
      done
      id
      text
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: uuid!, $done: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { done: $done }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    insert_todos(objects: { text: $text }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodos($id: uuid!) {
    delete_todos(where: { id: { _eq: $id } }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

interface ITodo {
  id: string;
  text: string;
  done: boolean;
}

interface IGetTodosData {
  todos: ITodo[];
}

export const App = () => {
  const [todoItemText, setTodoItemText] = useState('');

  const { data, loading, error } = useSubscription<IGetTodosData>(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoItemText(''),
  });
  const [deleteTodo] = useMutation(DELETE_TODO);

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);

    if (!todoItemText.trim()) return;

    await addTodo({
      variables: {
        text: todoItemText,
      }
    });
  };

  const handleToggleTodo = async ({ id, done }: ITodo) => {
    await toggleTodo({variables: {
      id,
      done: !done,
    }});
  };

  const handleDeleteTodo = async ({ id }: ITodo) => {
    if (!window.confirm('Do you want to delete this todo?')) return;

    await deleteTodo({
      variables: { id }
    })
  }

  if (loading) return <div>loading...</div>

  if (error) {
    console.error(error);

    return <div>Error fetching todos!</div>
  }

  return (
    <div>
      <h1>GraphQL Checklist</h1>
      {/* Todo form */}
      <form onSubmit={e => handleAddTodo(e)}>
        <input
          type='text'
          name='todo'
          id='todo'
          placeholder='Write your todo'
          value={todoItemText}
          onChange={e => setTodoItemText(e.target.value)}
        />
        <button type='submit'>Add</button>
      </form>
      {/* Todo list */}
      <ul>
        {
          data && data.todos.map(todo => (
            <li key={todo.id}>
              <span style={{ textDecoration: todo.done ? 'line-through' : '' }}>
                {todo.text}
              </span>{' '}
              <button type='button' onClick={() => handleToggleTodo(todo)}>
                &#10003;
              </button>
              <button type='button' onClick={() => handleDeleteTodo(todo)}>
                &times;
              </button>
            </li>
          ))
        }
      </ul>
    </div>
  )
};
