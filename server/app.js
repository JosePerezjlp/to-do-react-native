const express = require('express')
const cors = require('cors')
const { getTodo,
    shareTodo,
    deleteTodo,
    getTodosByID,
    createTodo,
    toggleCompleted,
    getUserByEmail,
    getUserByID,
    getSharedTodoByID,} = require('./database')

const bodyParser = require('body-parser')
 
const app = express()

const corsOptions = {
  origin: "*", 
  methods: ["POST", "GET"], 
  credentials: true, 
};

app.use(express.json())
app.use(cors(corsOptions))
   app.use(bodyParser.json());
   
app.get("/todos/:id", async (req, res) => {
  console.log(req.params.id)
    const todos = await getTodosByID(req.params.id);
    console.log(todos)
    res.status(200).send(todos);
  });
  
  app.get("/todos/shared_todos/:id", async (req, res) => {
    const todo = await getSharedTodoByID(req.params.id);
    const author = await getUserByID(todo.user_id);
    const shared_with = await getUserByID(todo.shared_with_id);
    res.status(200).send({ author, shared_with });
  });
  
  app.get("/users/:id", async (req, res) => {
    const user = await getUserByID(req.params.id);
    res.status(200).send(user);
  });
  
  app.put("/todos/:id", async (req, res) => {
    console.log(req.params.id)
    const { body } = req.body;
    console.log(body)
    const todo = await toggleCompleted(req.params.id, body);
    res.status(200).send(todo);
  });
  
  app.delete("/todos/:id", async (req, res) => {
    await deleteTodo(req.params.id);
    res.send({ message: "Todo deleted successfully" });
  });
  
  app.post("/todos/shared_todos", async (req, res) => {
    const { todo_id, user_id, email } = req.body;
    console.log(todo_id,user_id)
    // const { todo_id, user_id, shared_with_id } = req.body;
    const userToShare = await getUserByEmail(email);
    const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
    res.status(201).send(sharedTodo);
  });
  
  app.get("/todos/:id", async (req, res) => {
    console.log('hola'+ req.params.id)
    const id = req.params.id;
    const todo = await getTodo(id);
    res.status(200).send(todo);
  });
  
  app.post("/todos", async (req, res) => {
    const { user_id, title } = req.body;
    const todo = await createTodo(user_id, title);
    res.status(201).send(todo);
  });


app.listen(8080,()=>{
    console.log('Server running on port 8080')
})