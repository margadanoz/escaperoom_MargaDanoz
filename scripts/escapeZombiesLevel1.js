// Script para la primera prueba Zombies:
// OBtención elementos del DOM:
let grabacionButton = document.querySelector('.grabacion');
let audio = document.querySelector('.audioEva');
let verNotaButton = document.querySelector('#notaPuerta');
let postitEva = document.querySelector('#postitEva');
let btnComprobarDigitos = document.querySelector('#btnComprobarDigitos');
let digitos = document.querySelectorAll('.digito');
let cronometroHTML = document.querySelector('#cronoHTML');
let botonSiguienteNivel = document.querySelector('#siguienteNivel');
let botonCargar = document.querySelector('#cargaPartida');
let botonNuevaPartida = document.querySelector('#nuevaPartida');
let botonGuardar = document.querySelector('#guardaPartida');
let botonverReglas = document.querySelector('#verReglas');

// logica per a pistes
let botonPistas = document.querySelector('#verPistas');
let cuentaPistas = 0;
let puntuacionFinal;
// temps enrere per resoldre prova:
let tiempo = new Date();
tiempo.setHours(0,5,0,0);
let minutos = tiempo.getMinutes();
let segundos = tiempo.getSeconds();
let tiempoFinal;
// para cargar info del jugador y luego guardar:
let jugadorConectado = cargarJugadores();
let nomJugador;
let idUsuario;
let arrayPartidas = [];
let pistasUtilizadas = 0;
let activaContador = 0;

let juegoGanado = false;
let guardaPartida = false;
let noHayPartidaPrevia = false;
let nuevaPartida = false;
let nuevoGuardado;
let nivel1Superado = false;
// para recuperar las pistas y evitar que al hacer click en la nota
// que venga del guardado se nos dispare el crono porque si se carga
// partida ya viene el tiempo dado
let pistasAcumuladas = 0;
let tiempoRecuperadoLS = false;
let recargaPagina = false;
//contador per veure/ ocultar regles del joc
let cuentaReglas = 0;

function leeInfo() {

    if (guardaPartida) {

        let encontrado = false;
        jugadorConectado.forEach((jugador) => {

            if(parseInt(jugador.conectado) === 1){

            let arrayPartidas = jugador.partidaGuardada || [];

            arrayPartidas.forEach(partida => {
                if (parseInt(partida.idJuego) === 1 &&
                    partida.pantalla === 1 &&
                    partida.juego === 'Escape Zombies') {
                        encontrado = true;
                        sobreescribePartida(jugador);
                }
            });
        }
        });

        if (!encontrado) {
            // si han ganado el juego calculamos puntuacion,
            if(juegoGanado){           
                puntuacionFinal = calculaPuntuacion();
            }else{
                puntuacionFinal = 0;
            }
            nuevoGuardado = {
                juego: 'Escape Zombies',
                pantalla: 1,
                idJuego: 1,
                nivel1Superado: nivel1Superado,
                tiempoRestante: tiempoFinal,
                puntuacion: puntuacionFinal
            };
            jugadorConectado.forEach((jugador) => {
                jugador.partidaGuardada.push(nuevoGuardado);
            });
            localStorage.setItem("jugadores", JSON.stringify(jugadorConectado));
        }
    }
    // Resetear valor al final:
    guardaPartida = false;
}

function sobreescribePartida(jugador) {
    // si han ganado el juego calculamos puntuacion,
            if(juegoGanado){
                puntuacionFinal = calculaPuntuacion();
                console.log('puntuacion final',puntuacionFinal);
            }else{
                puntuacionFinal = 0;
            }
            // sumem per pujar al objecte la quantitat de pistes
        pistasAcumuladas = cuentaPistas + pistasAcumuladas;

    nuevoGuardado = {
        juego: 'Escape Zombies',
        pantalla: 1,
        idJuego: 1,
        nivel1Superado: nivel1Superado,
        tiempoRestante: tiempoFinal,
        puntuacion: puntuacionFinal
    };
    // iteramos sobre el array de partidas y en caso de haber coincidencia,
    // que la habrá porque ya viene confirmada de la funcin principal asignamos nuevos valores:
    jugador.partidaGuardada.forEach((partida, index) => {
        if (parseInt(partida.idJuego) === 1 &&
            partida.pantalla === 1 &&
            partida.juego === 'Escape Zombies') {
            jugador.partidaGuardada[index] = Object.assign({}, partida, nuevoGuardado);
            return;
        }
    });
    localStorage.setItem("jugadores", JSON.stringify(jugadorConectado));
}

function calculaPuntuacion(){
    puntuacionFinal = 1000;
    if(cuentaPistas > 0){
        let penalizacionPorPistas = 100 * cuentaPistas;
        puntuacionFinal = puntuacionFinal - penalizacionPorPistas;
    }else{
        puntuacionFinal += 1000;
    }

    if(minutos >= 3 && minutos <= 4){
        puntuacionFinal = puntuacionFinal + 1000;
    }else if(minutos >= 2 && minutos < 3){
        puntuacionFinal = puntuacionFinal + 500;                 
    }
    return puntuacionFinal;
}

// Llamada a leeInfo():
leeInfo();

// Cargar partida desde localStorage:
botonCargar.addEventListener('click', function() {
    // traemos datos y comprobamos si los hay
    botonNuevaPartida.style.display = 'none';
    let almacenamiento = localStorage.getItem('jugadores');
    if (almacenamiento) {
        let datosJugadores = JSON.parse(almacenamiento);
        datosJugadores.forEach((jugador) => {

            // Verificamos que el jugador tenga una partida guardada
            if (jugador.partidaGuardada && Array.isArray(jugador.partidaGuardada)) {

                jugador.partidaGuardada.forEach(partida => {
                    // Verificar si la partida es de Escape Zombies en la pantalla 1
                    if (parseInt(partida.idJuego) === 1 &&
                        partida.pantalla === 1 &&
                        partida.juego === 'Escape Zombies') {
                            // mandamos a recuperar el tiempo y mostramos elementos que nos interesan:
                            tiempoRecuperadoLS = true;
                            document.querySelector('#cronometro').style.display = 'block';
                            document.querySelector('#sorpresaCrono').style.display = 'none';
                            minutos = partida.tiempoRestante[0];
                            segundos = partida.tiempoRestante[1];
                            botonCargar.style.display = 'none';
                            // actualitzem les pistes que es contaràn al llarg
                            // del joc:
                            pistasAcumuladas = partida.pistasUtilizadas;
                            if(partida.nivel1Superado === false){
                                activaCuentaAtras();
                            }else{
                                document.querySelector('.mensajeInfo').style.display = 'block';
                                document.querySelector('.cuerpoEntero').style.display = 'none';
                                botonGuardar.style.display = 'none';
                            }
                    }
                });
            }
        });
    }
});

botonNuevaPartida.addEventListener('click', function() {
    botonCargar.style.display = 'none';
    botonNuevaPartida.style.display = 'none';
    botonGuardar.style.display = 'none';
    nuevaPartida = true;
    leeInfo();
});

// botonGuardar.addEventListener('click', function() {
//     guardaPartida = true;
//     guardaTiempo();
//     leeInfo();
// });

botonverReglas.addEventListener('click',function(){
    cuentaReglas++;

    if(cuentaReglas === 1){
        document.querySelector('.reglasNivel1').style.display = 'block';
        botonverReglas.textContent = 'Dejar de ver reglas';
    }else if(cuentaReglas === 2){
        cuentaReglas = 0;
        botonverReglas.textContent = 'Ver reglas';
        document.querySelector('.reglasNivel1').style.display = 'none';
    }
});

// Quan pulsem sobre el botó s'accionarà l'audio de la 1a grabació
// que dona el 50% de la pista per resoldre la primera prova
grabacionButton.addEventListener('click', ()=>{
    audio.style.display = 'block';
    // Reproducir el audio al primer click
    audio.play();
});

// Nota del postit que diu la manera final en que s'han de resoldre les dos primeres pistas:
verNotaButton.addEventListener('click',()=>{
    // només funcionarà primera vegada que s'iniciï el joc, després
    // l'anuralem
    activaContador++;
    if(activaContador === 1 && !tiempoRecuperadoLS){
                // activem el temps:
                activaCuentaAtras();
                
        // disparamos por sorpresa cronometro, no avisado jugador:
        document.querySelector('#cronometro').style.display = 'block';
        document.querySelector('#sorpresaCrono').style.display = 'block';

    }
        // ocultem després de 10 segons:
        setTimeout(function(){
            document.querySelector('#sorpresaCrono').style.display = 'none';
        },10000);

    if (postitEva.style.display === 'none' || postitEva.style.display === '') {
        // Si la nota está oculta, la mostramos y cambiamos el texto del botón a "Cerrar"
        postitEva.style.display = 'block';
        verNotaButton.textContent = 'Cerrar Nota';
        
    } else {
        // Si la nota está visible, la ocultamos y cambiamos el texto del botón a "Ver Nota"
        postitEva.style.display = 'none';
        verNotaButton.textContent = 'Ver Nota';
    }
});

// Event listener per comprobar els nombres introduïts per obrir la porta:
btnComprobarDigitos.addEventListener('click', ()=>{

    // prenem tots els valors dels inputs i els transoformem en integer
    let num2 = digitos[0].value;
    let num4 =digitos[1].value;
    let num6 = digitos[2].value;
    let num8 = digitos[3].value;

    num2 = parseInt(num2);
    num4 = parseInt(num4);
    num6 = parseInt(num6);
    num8 = parseInt(num8);

    // en cas de coincidencia fem visible per pasar al següent nivell
    if(num2 === 2 && num4 === 4 && num6 === 6 && num8 === 8){ 
        // generamos puntuacion final: leemos pistasAcumuladas
        // y restamos o dejamos igual
        // pistas -100 x pista, tiempo mayor a 3 minutos bonus de 500
        // adivinado a la primera sin usar pistas bonus de 10000
        juegoGanado = true;
        nivel1Superado = true;
        botonSiguienteNivel.style.display = 'block';
        document.querySelector('#explicacionPistas').style.display = 'none';
        document.querySelector('#infoNivel').style.display = 'block';
        // sino mostrem pistes:
    }else{
        document.querySelector('#explicacionPistas').style.display = 'block';
        // oferim la primera pista:
        botonPistas.style.display = 'block';
        setTimeout(function(){
            document.querySelector('#num2').value = '';
            document.querySelector('#num4').value = '';
            document.querySelector('#num6').value = '';
            document.querySelector('#num8').value = '';

        },600);
    }
});

botonPistas.addEventListener('click', function(){
    cuentaPistas++;

    if(cuentaPistas === 1){
        document.querySelector('#pistaUno').style.display = 'block';
    }else if(cuentaPistas === 2){
        document.querySelector('#pistaDos').style.display = 'block';
    }
});

botonSiguienteNivel.addEventListener('click',function(){
    guardaPartida = true;
    guardaTiempo();
    leeInfo();
});

function activaCuentaAtras(){
    if (minutos > 0 || segundos > 0) {

        if (minutos > 0 && segundos === 0) {
            minutos -= 1;
            segundos = 59;
        } else if(minutos > 0 && segundos > 0){
            segundos -= 1;
        }else if(minutos === 0 && segundos > 0){
            segundos -= 1;
        }  

        // condicionals per mostrar format correcte la info per l'html
        let minutosStr = minutos < 10 ? '0' + minutos : minutos;
        let segundosStr = segundos < 10 ? '0' + segundos : segundos;

        cronometroHTML.innerHTML = '00:' + minutosStr + ':' + segundosStr;
        
        setTimeout(activaCuentaAtras, 1000);   
        // si el temps arriba a cero llavors perden:
    } else {
        recargaPagina = true;
         //si se agota el tiempo no se podrá guardar el progreso:
        botonGuardar.style.display = 'none';
    }
}

// Per recuperar i guardar el temps:
function guardaTiempo(){
    tiempoFinal = [minutos, segundos];
}





