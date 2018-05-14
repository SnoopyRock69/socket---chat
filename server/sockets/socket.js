const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

//Crear instancia de usuarios
const usuarios = new Usuarios();

io.on('connection', (client) => {

    //Escuchar el método que identifica quién se conectó
    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'Es necesario proporcionar un nombre y una sala.'
            });
        }
        console.log(data);
        //Conectar un usuario a una sala
        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        //Emitir a las personas en una sala específica.
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));

        callback(usuarios.getPersonasPorSala(data.sala));
    });

    //recibir mensajes entre usuarios
    client.on('crearMensaje', (data) => {

        //Identificar la persona que envía el mensaje
        let persona = usuarios.getPersona(client.id);
        // Recibir el mensaje.
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        //Emitir mensaje a todo el mundo.
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    })


    //Manejar desconexión de usuarios
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        //Informar a todos los usuarios si alguien se desconecta de la sala.
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió.`))

        //Lista de personas conectadas.
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala))

    })

    //Enviar mensajes privados. Lado del servidor.
    client.on('mensajePrivado', data => {

        //Saber qué persona emite el mensaje
        let persona = usuarios.getPersona(client.id);
        if (!data.mensaje) {
            return callback({
                error: true,
                mensaje: 'El campo está vacío.'
            });
        }
        //"para" es el id de la persona a la que quiero enviar el mensaje privado.
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    })
});