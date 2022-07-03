import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { API_URL, AxiosHttpRequest } from "./utils";
import { io } from "socket.io-client";

declare global {
  interface Window {
    socket: any;
    io: any;
  }
}

const socket = io("ws://localhost:3000", {
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Connected! ID: " + socket.id);
});

const App = () => {
  const [todo, setTodo]: any = useState([]);
  const [name, setName] = useState("");
  const [isAllSet, setAllSet] = useState(false);
  const disabled = name.length === 0;

  useEffect(() => {
    getTodo();
  }, [todo]);

  const createTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (disabled) {
        alert("Please fill out the todo!");
        return;
      } else {
        const newTodo = (
          await AxiosHttpRequest("POST", `${API_URL}/todo`, { name })
        )?.data.raw[0];
        setTodo([...todo, newTodo.name]);
        setName("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTodo = async () => {
    try {
      const todoData = (await AxiosHttpRequest("GET", `${API_URL}/todo`))?.data;
      setTodo(todoData);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await AxiosHttpRequest("DELETE", `${API_URL}/${id}`);
      const temp = todo.filter((x: any) => x.id !== id);
      setTodo(temp);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1>Todo List ({todo.length})</h1>
      <form onSubmit={(e) => createTodo(e)}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Todo..."
          maxLength={100}
          autoFocus={true}
        />
      </form>
      {todo.map((ele: any) => {
        return (
          <ul key={ele.id} style={{ fontSize: "22px" }}>
            <span className="list">
              <input type="checkbox" name="checkbox" />
              {ele.name}
              <button className="remove" onClick={() => deleteTodo(ele.id)}>
                X
              </button>
            </span>
          </ul>
        );
      })}
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
