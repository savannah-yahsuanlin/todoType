import React, {useEffect, useState} from 'react';
import ReactDOM from "react-dom";
import { API_URL, AxiosHttpRequest } from './utils'
import {io} from 'socket.io-client'

declare global {
    interface Window {
        socket:any;
				io:any
    }
}

const socket = io("ws://localhost:3000", {
  transports: ["websocket", "polling"] 
});

socket.on("connect", () => {
		console.log('Connected! ID: ' + socket.id);
	});

const App = () => {
	const [todo, setTodo]: any = useState([]);
	const [name, setName] = useState('');
	const [isAllSet, setAllSet] = useState(false);
console.log(todo, setTodo)
	const disabled = (name.length === 0);

	useEffect(() => {
		getTodo()
	},[todo])	


	const createTodo = async(event : React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			if(disabled) {
				alert("Please fill out the todo!");
				return;
			} else {
				const newTodo = (await AxiosHttpRequest('POST', `${API_URL}/todo`, { name }))?.data.raw[0]
				socket.emit('addTodo', {name: newTodo.name})
				setTodo([...todo, newTodo]);
				socket.on('getAllTodo', (todo) => setTodo(todo));
				setName('')
			}
		} catch (error) {
			console.log(error)
		}
	}	

	const getTodo = async () => {
    try {
      const todoData = (await AxiosHttpRequest('GET', `${API_URL}/todo`))?.data;
      setTodo(todoData);
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
		<div>
			<h1>Todo List({todo.length})</h1>
			<form onSubmit={(e) => createTodo(e)}>
				<input 
					type='text'
					value={name}
					onChange={(event) => setName(event.target.value)}
					placeholder='Todo...'
					maxLength={100}
				/>
				<button>Add</button>
			</form>
			{todo.map((ele:any, index:number) => {
				return (
					<ul key={index}>
						<span>
							<input type="checkbox"/>
							{ele.name}
						</span>
					</ul>
				)
			})}
		</div>
	);
};

ReactDOM.render(<App />, document.querySelector("#root"));
