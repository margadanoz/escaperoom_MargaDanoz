let botonNivel2 = document.querySelector('#nivel2');
let botonNivel3 = document.querySelector('#nivel3');
let enlaceNivel2 = document.querySelector('#enlaceNivel2');
let enlaceNivel3 = document.querySelector('#enlaceNivel3');
let mensajeErrorAcceso1 = document.querySelector('#nivel1NoSuperado');
let mensajeErrorAcceso2 = document.querySelector('#nivel2NoSuperado');
let registro = document.querySelector('.enlaceRegistro');
let datosJugador = cargarJugadores();
// booleans per controlar els nivells que son accesibles ja i els que no:
let nivel2Accesible = false;
let nivel3Accesible = false;
let idJugadorConectado = 0;

// iterem sobre els jugadors que ens retorna el metode que veurà
// si hi han conectats:
function leerDatosJugadorConectado(){
    datosJugador.forEach(jugadorConectado => {

        if (parseInt(jugadorConectado.conectado) === 1) {
            // recorrem totes les partides guardades pel jugador:
            jugadorConectado.partidaGuardada.forEach(partida => {
                //comprovem si s'ha superat o no el nivell 1:
                if (partida.nivel1Superado === true) {
                    nivel2Accesible = true;
                }
    
                if (partida.nivel2Superado === true) {
                    nivel3Accesible = true;
                }
            });
        }
    });
}

// perque carregui ja al principi:
leerDatosJugadorConectado();

// per mostrar missatge d'error quan no tinguin el nivell superat:
botonNivel2.addEventListener('click', function(){

        if(nivel2Accesible === true){
            enlaceNivel2.setAttribute('href','/views/escapePastryLevel2.html');
        }else{
            mensajeErrorAcceso1.style.display = 'block';
            setTimeout(function(){

                // mostrar el missatge de que el nivell no està accesible:
                mensajeErrorAcceso1.style.display = 'none';
            },1500);
        }
});

// per mostrar missatge d'error quan no tinguin el nivell superat:
botonNivel3.addEventListener('click', function(){

        if(nivel3Accesible === true){
            enlaceNivel3.setAttribute('href','/views/escapePastryLevel3.html');
        }else{
             // mostrar el missatge de que el nivell no està accesible:
             mensajeErrorAcceso2.style.display = 'block';
            setTimeout(function(){

                // mostrar el missatge de que el nivell no està accesible:
                mensajeErrorAcceso2.style.display = 'none';
            },1500);
        }
});


