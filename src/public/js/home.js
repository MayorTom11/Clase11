const socketClient = io()

const chatbox = document.getElementById("chatbox")
const chat = document.getElementById("messageLogs")

let user

Swal.fire({
    title:"Identificate",
    input:"text",
    text:"Ingresa un nombre de usuario para el chat",
    inputValidator:(value)=>{
        if(!value){
            return "El nombre de usuario es obligatorio"
        }
    },
    allowOutsideClick:false
}).then((result)=>{
    user = result.value
    // Cada vez que un usuario se identifica, enviamos un mensaje al servidor.
    socketClient.emit("authenticated",`${user} ha iniciado sesion`)
})

chatbox.addEventListener("keyup",(e)=>{
    if(e.key === "Enter"){
        if(chatbox.value.trim().length > 0){
            socketClient.emit("message",{user:user,message:chatbox.value})
            chatbox.value=""
        }
    }
})

// Cada vez que recibimos todos los mensajes en el servidor, vamos a mostrarlos en el contenedor
socketClient.on("messageHistory",(dataServer)=>{
    let messageElmts = ""
    // console.log("dataServer", dataServer)
    dataServer.forEach(item=>{
        messageElmts = messageElmts + `${item.user}: ${item.message} <br/>`
    })
    chat.innerHTML = messageElmts
})

// Capturamos el evento de inicio de sesion de un nuevo usuario y el mensaje que nos envia el servidor
socketClient.on("newUser",(data)=>{
    if(user){
        Swal.fire({
            text:data,
            toast:true,
            position:"top-right"
        })
    }
})