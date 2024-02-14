import {AiOutlineEdit, AiOutlineDelete} from "react-icons/ai";
import './App.css';
import { useState, useEffect } from 'react';
import axios from "axios";

function App() {

  //componente que eu criei dentro do próprio app
  const Todos = ( {todos} ) => { //componentes são funções e PODEM RECEBER PARAMS  
    return ( //O HTML FICA NO RETORNO
      <div className="todos">
        {todos.map( (todo) => {
          return (
            <div className="todo">
              <p>{todo.name}</p>
              <button
                onClick={()=> modifyStatusTodo(todo)}
                className='checkbox'
                style={{backgroundColor: todo.status ? "#2b2118":"white"}}
                ></button>
              <button
              onClick={() => handleWithEditButtonClick(todo)}>
                <AiOutlineEdit
                  size={20}
                  color={"#6f1A07"}
                  ></AiOutlineEdit>
              </button>
              <button
                onClick= {() => deleteTodo(todo)}>  
                <AiOutlineDelete
                  size={20}
                  color={"#6f1A07"}
                ></AiOutlineDelete>
              </button>
            </div>
          );
        })}
      </div>
    ); 
  };

  async function handleWithNewButton(){
    setInputVisibility(!inputVisibility);
  }
  async function handleWithEditButtonClick(todo){
    setSelectedTodo(todo);
    setInputVisibility(true);
  }

  async function getTodos(){
    // ROTA DO SERVIDOR NODE QUE CRIAMOS em server.js no back
    const response = await axios.get("http://localhost:3333/todos"); // pegando dados do servidor backend
    setTodos(response.data); // atualizando dados da array de tarefas
  }

  async function createTodo(){
    const response = await axios.post("http://localhost:3333/todos", {name: inputValue});
    getTodos();
    setInputVisibility(!inputVisibility);
  }

  async function editTodo(){
    const response = await axios.put("http://localhost:3333/todos", {
      id: selectedTodo.id,
      name: inputValue,
    });
    setInputVisibility(false);
    setSelectedTodo();
    getTodos();
  }

  async function deleteTodo(todo){
    await axios.delete(`http://localhost:3333/todos/${todo.id}`);
    getTodos();
  }

  async function modifyStatusTodo(todo){
    await axios.put('http://localhost:3333/todos', {
      id: todo.id,
      status: !todo.status
    })
    getTodos();
  }

  /*
    Criando uma variável para a lista de tarefas
    e uma função que adiciona itens nessa lista
    pelo hook (função chique do react) useState
    vvvvvvvvvvvvvvvvvv
  */
  const [todos, setTodos] = useState([]); // o valor de dentro do state é o valor inicial
  const [inputValue, setInputValue] = useState(""); // valor referente ao input que será adicionado ("cache")
  const [inputVisibility, setInputVisibility] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState();

  useEffect(() => { // quando o componente App rodar, o use effect roda a função aqui dentro
    getTodos();
  }, []);

  return (
    <div className="App">
      <header className="container">
        <div className='header'>
          <h1>Xôôôôôôô preguiiiiça</h1>
        </div>
        <Todos todos={todos}></Todos> {/* Componente criado lá em cima, COM PARAMS */}
        
        <input
          value={inputValue}
          style={{display: inputVisibility ? "block" : "none"}}
          onChange={(event) => { // sempre que o valor do input mudar, ele atualiza o valor do novo input no cache
            setInputValue(event.target.value);
          }}
          className='inputName'
        ></input>
        <buttton 
          onClick={inputVisibility === true ? selectedTodo ? editTodo : createTodo : handleWithNewButton}
          className='newTaskButton'>
          {inputVisibility === true ? "Confirmar" : "Nova Task"}
        </buttton>
      </header>
    </div>
  );
}

export default App;
