// aquest script s'necarregarà de la lògica de mantenir enllaços que no són
// necessaris per mostrar (registro y login) quan tenim al jugador conectat i tb de mostrar
// botó Logout per poder desconectar el jugador i recuperar estat 'normal' de la pàgina
// estarà present a cada pàgina per quan fem els salts entre unes i altres
// Tambè s'encarregarà de la funcionalitat de desconectar el jugador i actualitzar el camp al localStorage
let enlaceLogin = document.querySelector('.enlaceLogin');
let enlaceRegistro = document.querySelector('.enlaceRegistro');
let botonLogout = document.querySelector('.botonLogout');
let enlacePerfilUsuario = document.querySelector('.perfilUsuario');
let enlacePerfilAdmin = document.querySelector('.perfilUsuarioAdmin');
let enlaceVerUsuarios = document.querySelector('.enlaceVerUsuarios');

window.onload = function() {

    cargarJugadores();

};


function cargarJugadores(){

    const datosJugadores = localStorage.getItem("jugadores");

    if(datosJugadores){

        let jugadorConectado = JSON.parse(datosJugadores);

        jugadorConectado.forEach(jugador => {

            // si tenim al jugador conectat,ocultem enllaços de registre i login:
            // i mostrem botó de logout i en funció de si es un admin o un usuari mostrem els perfils disponibles pel seu rol
            if(parseInt(jugador.conectado) === 1 && jugador.rol === 'administrador'){

                enlaceLogin.style.display = 'none';
                enlaceRegistro.style.display = 'none';
                botonLogout.style.display = 'inline';
                enlacePerfilAdmin.style.display = 'inline';
                enlaceVerUsuarios.style.display = 'inline';

            }else if(parseInt(jugador.conectado) === 1 && jugador.rol === 'usuario'){

                enlaceLogin.style.display = 'none';
                enlaceRegistro.style.display = 'none';
                botonLogout.style.display = 'inline';
                enlacePerfilUsuario.style.display = 'inline';
            }
        });

        return jugadorConectado;
    }
}


// si clicken logout anem al localStorage i actualitzem el camp a 0 per tornar la pàgina a estat normal
// i ocultar els enllaços per pàgines de perfils d'usuari i el mateix botó logout:
botonLogout.addEventListener('click',function(){

    let desconectado = 0;

    // Primer anem al localStorage i cerquem el jugador que tenim conectat:
    const jugadorConectado = localStorage.getItem("jugadores");
    
    let datosJugador = JSON.parse(jugadorConectado);
    
    datosJugador.forEach((jugador, index) => {

        // actualitzem estat ddel jugador a 0
        if (jugador.conectado === 1) {

            datosJugador[index].conectado = desconectado;
        
            //actualitzem al localStorage
            localStorage.setItem("jugadores", JSON.stringify(datosJugador));
            window.location.href = "../index.html";
        }
    });
            //ocultem enllaços innecesaris ja al desconectar el jugador i
            // mostrem enllaços habituals de quan està conectat el jugador:
                enlaceLogin.style.display = 'inline';
                enlaceRegistro.style.display = 'inline';
                botonLogout.style.display = 'none';
                enlacePerfilAdmin.style.display = 'none';
                enlaceVerUsuarios.style.display = 'none';
                enlacePerfilUsuario.style.display = 'none';
});



