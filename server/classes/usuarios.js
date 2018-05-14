class Usuarios {
    constructor() {
        this.personas = [];
    }

    //AGREGAR UNA PERSONA
    agregarPersona(id, nombre, sala) {
        //Creamos una persona
        let persona = { id, nombre, sala };
        //Agregamos la persona al array
        this.personas.push(persona);

        return this.personas;
    }

    //OBTENER UNA PERSONA
    getPersona(id) {
        //Buscamos en el arreglo si alguien coincide con el id.
        let persona = this.personas.filter(persona => persona.id === id)[0]; //Filter retorna un arreglo, necesitamos la primera posición
        return persona;
    }

    //OBTENER TODAS LAS PERSONAS
    getPersonas() {
        return this.personas;
    }

    //OBTENER PERSONAS POR SALA DE CHAT
    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;
    }

    //REMOVER PERSONA SI ABANDONA EL CHAT
    borrarPersona(id) {
        //Para saber qué persona abandonó el chat.
        let personaBorrada = this.getPersona(id);

        //Reemplazamos el array de personas por el nuevo arreglo para obtener solo las activas.
        this.personas = this.personas.filter(persona => persona.id != id);

        return personaBorrada;
    }
}

module.exports = {
    Usuarios
}