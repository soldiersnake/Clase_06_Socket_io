const socket = io();

// socket.emit("message", "Nuestro primer mensaje desde socket");

// ALERTA DE EJEMPLO
// Swal.fire({
//   title: "Hola Coders",
//   text: "Alerta basica con SweetAlert2",
//   icon: "success",
// });

// Almacenamos usuario loggeado
let user;

Swal.fire({
  title: "Identificate!",
  input: "text",
  text: "Ingresa un nombre de usuario",
  inputValidator: (value) => {
    return !value && "Necesitas escribir un nombre"; // VALIDACION: no puede estar vacio
  },
  allowOutsideClick: false, // no permite cerrar el modal haciendo click fuera del mismo
}).then((result) => {
  user = result.value; // guardamos el usuario
  socket.emit("auth", user); // emitimos al servidor el evento 'auth' con el nombre del usuario
});

const input = document.getElementById("chatBox");
const logs = document.getElementById("messageLogs");

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && input.value.trim().length > 0) {
    // enviamos el mensaje al servidor
    socket.emit("message", {
      user, // nombre del usuario
      message: input.value, // mensaje escrito
    });
    input.value = ""; // limpiamos input post envio
  }
});

socket.on("messageLogs", (data) => {
  console.log("data :", data);

  //agregamos el mensaje al contenedor
  logs.innerHTML += `<p> <strong> ${data.user} </strong> ${data.message}</p>`;
});

// Nuevo usuario conectado
// esucchamos el evento de 'newuser' cuando alguien se conecta
socket.on("newUser", (userName) => {
  //mostramos el mensaje de cliente nuevo
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: `${userName} se ha unido al chat`,
    showConfirmButton: true,
    timer: 2000,
  });
});
