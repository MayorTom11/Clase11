import express from "express";
import {engine} from "express-handlebars";
import { __dirname } from "./utils.js";
import path from "path";
import { viewsRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";

const port = process.env.PORT || 8080;
const app =express();

// Midleware
app.use(express.static(path.join(__dirname,"/public")));

// Server express
const httpServer = app.listen(port,()=>console.log(`Server listening on port ${port}`));
// Server socket
const io = new Server(httpServer)

// Handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

// Routes
app.use(viewsRouter)

let messages = []
// Socket server
io.on("connection",(socket)=>{
    console.log("Nuevo cliente conectado")
    // Capturamos el mensaje de nuevo inicio de sesion en el servidor. msg es igual al segundo parametro que se esta enviando en socketClient.emit del login
    socket.on("authenticated",(msg)=>{
        // Al nuevo usuario que se indentifico, le enviamos todo el historial de mensajes
        socket.emit("messageHistory",messages)
        // A los usuarios que estan ya conectados les enviamos un mensaje del nuevo usuario que se contecto por medio de broadcast
        socket.broadcast.emit("newUser",msg)
    })
    // Recibimos el mensaje del cliente
    socket.on("message",(data)=>{
        console.log(data)
        messages.push(data)
        // Cada vez que recibamos un mensaje, enviamos todos los mensajes actualizados a todos los clientes conectados
        io.emit("messageHistory",messages)
    })
})