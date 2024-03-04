let botonStartFacil = document.querySelector('#iniciarJuegoFacil');
let botonStartDificil = document.querySelector('#iniciarJuegoDificil');
let botonGuardar = document.querySelector('#guardarPartida');
let preguntaElement = document.querySelector("#pregunta");
let opcionesElement = document.querySelector("#opciones");
let datosFinales = document.querySelector("#datosFinales");
let puntuacionFinalHTML = document.querySelector("#puntuacionHTML");
let panelGameOver = document.querySelector('#gameOver');
let botonReintentar = document.querySelector('#reintentar');
let btnVerReglas = document.querySelector('#verReglas');
let btnPistas = document.querySelector('#pistas');
let verPistas = document.querySelector('#verPistas');
let preguntaActual = 0;
let sumaCorrecta = 0;
let nivelFacil = false;
let nivelDificil = false;
let nivelEscogido = '';
let nivel3Superado = false;
let guardaJuego = false;
let countPistas = 0;
// para cronometro
let tiempo = new Date();
// establecemos en un minuto:
tiempo.setHours(0,0,40,0);
let cronometroHTML = document.querySelector('#cronometro');
// establecemos el contenido del html del cronometro:
cronometroHTML.innerHTML = '00:00:40';
// emmagatzemem valors a les variables que emprarem per fer compte enrere
let minutos = tiempo.getMinutes();
let segundos = tiempo.getSeconds();
let tiempoFinal = [];
// AGAFEM ELS JUGADORS AMB LA FUNCIÓ QUE ENS PASA L'ALTRE SCRIPT
let jugadorConectado = cargarJugadores();
// per la puntuació final que guardarem:
let puntuacionFinal = 0;
// per guardar les partides
let arrayPartidas = [];
// para actibvar el crono:
let activarCrono = 0;
// per veure quan parar el crono si ja finalitzem el joc:
let juegoFinalizado = false;
// contador per respotes encertades¿? necesari¿?
let countCorrect = 0;
// dar efecto toggle al boton de las pistas:
let countReglas = 0;
// emmagatzematge de la darrera paraula jugada per ficar a local
let ultimaPalabraJugada = '';

// array creada d'objectes, ja conté la pregunta correcta poer després comparar:
let preguntas = [
    {
        pregunta: "Si te proporciono solo yemas, agua, azúcar y glucosa, ¿que postre podrías elaborar?",
        opciones: ["Tocinillo", "Flan", "Merengue", "Mousse de choco"],
        respuestaCorrecta: "Tocinillo"
    },
    {
        pregunta: "¿Qué hotel europeo dio nombre a un pastel de la repostería clásica europea conocido en todo el mundo?",
        opciones: ["Hotel Sacher", "Hotel Ritz", "Hotel Plaza", "Hotel Hilton"],
        respuestaCorrecta: "Hotel Sacher"
    },
    {
        pregunta: "¿Que famoso muñeco proporciona el máximo galardón en cocina?",
        opciones: ["Michelin", "RonaldMcdonalds", "BuzzLightyear", "Annabelle"],
        respuestaCorrecta: "Michelin"
    },
    {
        pregunta: "¿Cuál es el nombre del plato japonés que consiste en arroz cubierto con una variedad de ingredientes, como pescado crudo, vegetales, huevos y algas marinas?",
        opciones: ["Sashimi", "Tempura", "Yakitori", "Sushi"],
        respuestaCorrecta: "Sushi"
    },
    {
        pregunta: "¿Qué es el caviar?",
        opciones: ["Huevas de esturión", "Huevas de salmón", "Huevas de pez volador", "Huevas de trucha"],
        respuestaCorrecta: "Huevas de esturión"
    }
];
let pistasFacil = ['color amarillo intenso', 'tarta de chocolate muy famosa', 'asociado a mecánica', 'el primero es un corte de pescado, únicamente','aquel pescado que no sueles ver en españa en pescaderías' ];

let preguntasDificil = [
    {
        pregunta: "Si te proporciono goma xantana, gluconalactato, alginato,agua y olivas,¿que puedes hacer?",
        opciones: ["Llorar", "Cremoso de oliva", "Aire de oliva", "Esferificacion de oliva"],
        respuestaCorrecta: "Esferificacion de oliva"
    },
    {
        pregunta: "¿De donde se obtiene el agar-agar?",
        opciones: ["De un tipo de algas", "Se fabrica quimicamente", "Del pescado", "De las vacas"],
        respuestaCorrecta: "De un tipo de algas"
    },
    {
        pregunta: "Qué animal era el emblema del restaurante El Bulli?",
        opciones: ["Bulldog Francés", "Toro", "No era un animal", "Un águila"],
        respuestaCorrecta: "Bulldog Francés"
    },
    {
        pregunta: "Número máximo de estrellas que puede ostentar un restaurante",
        opciones: ["3", "5", "2", "4"],
        respuestaCorrecta: "3"
    },
    {
        pregunta: "Cual de estos no es un tipo de corte a cuchillo?",
        opciones: ["Brunoisse", "Mirepoix", "Noisette", "Juliana"],
        respuestaCorrecta: "Noisette"
    },
    {
        pregunta: "¿Cuál es el nombre de la enzima que descompone la lactosa en la leche?",
        opciones: ["Lactasa", "Lactina", "Galactosa", "Lactona"],
        respuestaCorrecta: "Lactasa"
    },
    {
        pregunta: "¿Cuál de los siguientes quesos NO es originario de Francia?",
        opciones: ["Roquefort", "Gouda", "Camembert", "Brie"],
        respuestaCorrecta: "Gouda"
    }
];

let pistasDificil = ['elaboración más representativa de los hermanos Adrià y el bulli','bajo del mar, baaaajo del maaaar',
                        'cinco pertenece a hoteles','Uno es un punto de mantequilla','la que suena galactica no es...','forma redondeada y pasta color amarillento'];

function infoJugadorActual() {

    jugadorConectado.forEach((jugador) => {

        if (parseInt(jugador.conectado) === 1 && guardaJuego === true
            && nivelFacil && !nivelDificil){

            arrayPartidas = jugador.partidaGuardada;
            nivelEscogido = 'nivelFacil';

            // Creem nou registre de la partida que es vol guardar
            let nuevoGuardado = {
                juego: 'Escape Cocina',
                pantalla: 3,
                puntuacion: sumaCorrecta,
                idJuego: 3,
                nivel3Superado: true,
                nivelEscogido: nivelEscogido,
                tiempoRestante : tiempoFinal
            };

            //si la partida ja existeix actualitzem les seves dades,
            // per si el jugador vol millorar la puntuació
            let partidaEncontrada = false; 
            for (let i = 0; i < arrayPartidas.length; i++) {
                let partida = arrayPartidas[i];
                if (parseInt(partida.idJuego) === nuevoGuardado.idJuego && parseInt(partida.pantalla) === nuevoGuardado.pantalla
                    && partida.nivelEscogido === 'nivelFacil' && nivelFacil) {
                    partidaEncontrada = true;
                    arrayPartidas[i] = Object.assign({}, partida, nuevoGuardado);
                    // sortim del bucle una vegada s'ha sobreescrit la partida
                    break; 
                }
            }

            // Si no se encontró la partida, la añadimos al array
            if (!partidaEncontrada) {
                jugador.partidaGuardada.push(nuevoGuardado);
            }
            localStorage.setItem("jugadores", JSON.stringify(jugadorConectado));
        
        }else if(parseInt(jugador.conectado) === 1 && guardaJuego === true
        && nivelDificil && !nivelFacil){

                arrayPartidas = jugador.partidaGuardada;
                nivelEscogido = 'nivelDificil';

                // Creem nou registre de la partida que es vol guardar
                let nuevoGuardado = {
                    juego: 'Escape Cocina',
                    pantalla: 3,
                    puntuacion: sumaCorrecta,
                    idJuego: 3,
                    nivel3Superado: true,
                    nivelEscogido: nivelEscogido,
                    tiempoRestante : tiempoFinal
                };

                //si la partida ja existeix actualitzem les seves dades,
                // per si el jugador vol millorar la puntuació
                let partidaEncontrada = false; 
                for (let i = 0; i < arrayPartidas.length; i++) {
                    let partida = arrayPartidas[i];
                    if (parseInt(partida.idJuego) === nuevoGuardado.idJuego && parseInt(partida.pantalla) === nuevoGuardado.pantalla
                        && partida.nivelEscogido === 'nivelDificil' && nivelDificil) {
                        partidaEncontrada = true;
                        arrayPartidas[i] = Object.assign({}, partida, nuevoGuardado);
                        // sortim del bucle una vegada s'ha sobreescrit la partida
                        break; 
                    }
                }

                // Si no se encontró la partida, la añadimos al array
                if (!partidaEncontrada) {
                    jugador.partidaGuardada.push(nuevoGuardado);
                }
                localStorage.setItem("jugadores", JSON.stringify(jugadorConectado));
        }
        guardaJuego = false;
    });
}

function sobreescribePartida(jugador) {
    // Per sobreescriure en nivell facil:
    jugador.partidaGuardada.forEach((partida, index) => {
        if (parseInt(partida.idJuego) === 1 &&
            partida.pantalla === 1 &&
            partida.juego === 'Escape Cocina' && partida.nivelEscogido === 'nivelFacil' && sobreescribeFacil) {

                if(pistasUtilizadas > 0 && countCorrect > 0){

                    countCorrect = countCorrect - pistasUtilizadas;
                    pistasUtilizadas = 0;
                }

                    if(ultimaPalabraJugada === palabraVictoria){
                        
                        mensajeUltimaPalabra.style.display = 'none';
                        guardadoFinal = true;
                        
                        if(minutos >= 5 && minutos <= 7){
                            countCorrect = countCorrect + 1000;
                        }else if(minutos >= 4 && minutos <= 5){
                            countCorrect = countCorrect + 500;
                        }
                        
                        nivel3Superado = true;
                        divInformaGanador.style.display = 'flex';
                        divInformaGanador.style.display = 'block';
                        pasarLevel2.style.display = 'block';
                        puntuacionHTML.textContent = countCorrect;
                        puntuacionHTML.style.display = 'block';
                        cargarPartidaFacil.style.display = 'none';
                        nuevaPartidaFacil.style.display = 'none';
                        divAnagramaJugador.style.display = 'none';
                        divPrincipal.style.display = 'none';
                        clearInterval(intervalo);
                        cronoHTML.style.display = 'none';
                    }else{
                        nivel3Superado = false;
                    }

            let nuevoGuardado = {
                juego: 'Escape Cocina',
                pantalla: 3,
                idJuego: 3,
                nivel1Superado: nivel3Superado,
                ultimaPalabraPuntuada: ultimaPalabraJugada,
                tiempoRestante: tiempoFinal,
                puntuacion: countCorrect,
                nivelEscogido: 'nivelFacil'
            };
            // Sobreescribimos en el lugar donde esta el jugador en conectado:
            jugador.partidaGuardada[index] = Object.assign({}, partida, nuevoGuardado);
            localStorage.setItem("jugadores", JSON.stringify(jugadorConectado));
        // Para sobreescribir en nivel dificil:
        }else if(parseInt(partida.idJuego) === 1 &&
                partida.pantalla === 1 &&
                partida.juego === 'Escape Cocina' && partida.nivelEscogido === 'nivelDificil' && !sobreescribeFacil){

            if(pistasUtilizadas > 0 && countCorrect > 0){

                countCorrect = countCorrect - pistasUtilizadas;
                pistasUtilizadas = 0;
            }

                if(ultimaPalabraJugada === palabraVictoria){

                    guardadoFinal = true;

                    if(minutos >= 5 && minutos <= 7){
                        countCorrect = countCorrect + 5000;
                    }else if(minutos >= 4 && minutos <= 5){
                        countCorrect = countCorrect + 1000;
                    }
                    
                    nivel3Superado = true;
                    divInformaGanador.style.display = 'flex';
                    divInformaGanador.style.display = 'block';
                    pasarLevel2.style.display = 'block';
                    puntuacionHTML.textContent = countCorrect;
                    puntuacionHTML.style.display = 'block';
                    cargarPartidaFacil.style.display = 'none';
                    nuevaPartidaFacil.style.display = 'none';
                    divAnagramaJugador.style.display = 'none';
                    divPrincipal.style.display = 'none';
                    clearInterval(intervalo);
                    cronoHTML.style.display = 'none';
                }else{
                    nivel1Superado = false;
                }

                let nuevoGuardado = {
                    juego: 'Escape Cocina',
                    pantalla: 3,
                    idJuego: 3,
                    nivel1Superado: nivel3Superado,
                    ultimaPalabraPuntuada: ultimaPalabraJugada,
                    tiempoRestante: tiempoFinal,
                    puntuacion: countCorrect,
                    nivelEscogido: 'nivelDificil'
                };
                jugador.partidaGuardada[index] = Object.assign({}, partida, nuevoGuardado);
                localStorage.setItem("jugadores", JSON.stringify(jugadorConectado));
                }
    });
}

// portar la informació del jugador conectat per poder guardar després:
infoJugadorActual();

botonGuardar.addEventListener('click', function(){
 
    guardaJuego = true;
    almacenarTiempo();
    infoJugadorActual();
});

botonStartFacil.addEventListener('click',function(){
    btnVerReglas.style.display = 'none';
    botonReintentar.style.display = 'none';
    console.log(nivelFacil);
    nivelFacil = true;
    console.log(nivelFacil);
    botonStartFacil.style.display = 'none';
    botonStartDificil.style.display = 'none';
    document.querySelector('#preguntas').style.display = 'block';
    mostrarPregunta();
});

botonStartDificil.addEventListener('click',function(){
    btnVerReglas.style.display = 'none';
    botonReintentar.style.display = 'none';
    nivelDificil = true;
    botonStartFacil.style.display = 'none';
    botonStartDificil.style.display = 'none';
    document.querySelector('#preguntas').style.display = 'block';
    mostrarPregunta();
});

btnPistas.addEventListener('click', function(){
    countPistas++;
    // si han escollit el nivell facil i utilitzen pistas restem x pista punts:
    if(nivelFacil){
        sumaCorrecta -= 25;
        let pistaActual = pistasFacil[preguntaActual];
        verPistas.innerHTML = pistaActual;
        setTimeout(function(){
            verPistas.innerHTML = '';         
        },2000);
        // restem més punts perque tb es sumen més a nivell dificil
    }else{
        sumaCorrecta -= 50;
        let pistaActual = pistasDificil[preguntaActual];
        verPistas.innerHTML = pistaActual;
        setTimeout(function(){
            verPistas.innerHTML = '';         
        },2000);
    }
});

btnVerReglas.addEventListener('click', function(){
    countReglas++;

    if(countReglas === 1){
        document.querySelector('#reglasLvl3').style.display = 'flex';
        btnVerReglas.textContent = 'Ocultar reglas';

    }else if(countReglas === 2){

        document.querySelector('#reglasLvl3').style.display = 'none';
        btnVerReglas.textContent = 'Ver reglas';
        countReglas = 0;
    }
})

function mostrarPregunta() {
    
    if(nivelFacil){
                // treiem text de la pregunta actual
            preguntaElement.textContent = preguntas[preguntaActual].pregunta;
            ultimaPalabraJugada = preguntas[preguntaActual].pregunta;
            // netejem les opcions de la pregunta anterior quan l'encertin:
            opcionesElement.innerHTML = "";

            preguntas[preguntaActual].opciones.forEach((opcion) => {
                // iterem sobre l'array ficant el contingut de les opcions a dins
                // del botons que creem
                let boton = document.createElement("button");
                // per cada botó text d'opcions corresponent:
                boton.textContent = opcion;

                boton.addEventListener('click',function(){
                    activarCrono++;
                    if(activarCrono === 1){
                        cuentaAtras();
                    }
                    verificarRespuesta(opcion);
                });
                // agreguem els botons al contenidor de les opcions:
                opcionesElement.appendChild(boton);
            });

    }else if(nivelDificil){
                       // treiem text de la pregunta actual
            preguntaElement.textContent = preguntasDificil[preguntaActual].pregunta;
            // netejem les opcions de la pregunta anterior quan l'encertin:
            opcionesElement.innerHTML = "";

            preguntasDificil[preguntaActual].opciones.forEach((opcion) => {
                // iterem sobre l'array ficant el contingut de les opcions a dins
                // del botons que creem
                let boton = document.createElement("button");
                // per cada botó text d'opcions corresponent:
                boton.textContent = opcion;

                boton.addEventListener('click',function(){
                    activarCrono++;
                    if(activarCrono === 1){
                        cuentaAtras();
                    }
                    verificarRespuesta(opcion);
                });
                // agreguem els botons al contenidor de les opcions:
                opcionesElement.appendChild(boton);
            }); 
    }
    
}

function verificarRespuesta(respuesta) {

    if(nivelFacil){
             // si coincideix amb la resposta correcta que tenim a l'array d'objectes sumem puntuació:
    // sino restem:
            if (respuesta === preguntas[preguntaActual].respuestaCorrecta) {
                // sumem i mostrem puntuació:
                sumaCorrecta += 100;
                document.querySelector("#resultado").textContent = 'Llevas: ' + sumaCorrecta + ' puntos';
                // passem a la següent pregnta:
                preguntaActual++;
                if (preguntaActual < preguntas.length) {
                    mostrarPregunta();

                } else {
                    juegoFinalizado = true;
                    if(segundos > 15 && sumaCorrecta !== 0){
                        sumaCorrecta += 1000;
                    }  
                    if(countPistas === 0){
                        sumaCorrecta += 1000;
                    } 
                    datosFinales.style.display = 'block';     
                    botonReintentar.style.display = 'block'; 
                    if(sumaCorrecta !== 0){
                        document.querySelector('#videoFinal').style.display = 'block';
                    }
                    document.querySelector('#preguntas').style.display = 'none';

                   puntuacionFinalHTML.textContent = 'Finalizas con ' + sumaCorrecta + ' puntos';

                }
            } else {
                // si fallen restem i avançem pregunta:
                if(sumaCorrecta !== 0){
                    sumaCorrecta -= 50;
                }
                document.querySelector("#resultado").textContent = 'Llevas: ' + sumaCorrecta + ' puntos';
                preguntaActual++;

                if (preguntaActual < preguntas.length) {
                    mostrarPregunta();

                } else {
                    juegoFinalizado = true; 
                      // calcular puntuacion final:
                    if(segundos > 15 && sumaCorrecta !== 0){
                        sumaCorrecta += 2000;
                    }  
                    if(countPistas === 0){
                        sumaCorrecta += 2000;
                    } 
                    datosFinales.style.display = 'block'; 
                    botonReintentar.style.display = 'block';     
                   puntuacionFinalHTML.textContent = 'Finalizas con ' + sumaCorrecta + ' puntos';
                }
            }
    }else if(nivelDificil){
                // si coincideix amb la resposta correcta que tenim a l'array d'objectes sumem puntuació:
                // sino restem:
                if (respuesta === preguntasDificil[preguntaActual].respuestaCorrecta) {
                    // sumem i mostrem puntuació:
                    sumaCorrecta += 200;
                    document.querySelector("#resultado").textContent = 'Llevas: ' + sumaCorrecta + ' puntos';
                    // passem a la següent pregnta:
                    preguntaActual++;
                    if (preguntaActual < preguntasDificil.length) {
                        mostrarPregunta();

                    } else {
                        juegoFinalizado = true;
                        if(segundos > 10 && sumaCorrecta !== 0){
                            sumaCorrecta += 5000;
                        }   
                        if(sumaCorrecta !== 0){
                            document.querySelector('#videoFinal').style.display = 'block';
                        }
                        datosFinales.style.display = 'block';
                        botonReintentar.style.display = 'block'; 
                        document.querySelector('#preguntas').style.display = 'none';
     
                       puntuacionFinalHTML.textContent = 'Finalizas con ' + sumaCorrecta + ' puntos';
                    }
                } else {
                    // si fallen restem i avançem pregunta:
                    if(sumaCorrecta !== 0){
                        sumaCorrecta -= 100;
                    }
                    document.querySelector("#resultado").textContent = 'Llevas: ' + sumaCorrecta + ' puntos';
                    preguntaActual++;

                    if (preguntaActual < preguntasDificil.length) {
                        mostrarPregunta();

                    } else {
                        juegoFinalizado = true;
                         // calcular puntuacion final:
                    if(segundos > 10 && sumaCorrecta !== 0){
                        sumaCorrecta += 5000;
                    }   
                    datosFinales.style.display = 'block';  
                    botonReintentar.style.display = 'block';   
                   puntuacionFinalHTML.textContent = 'Finalizas con ' + sumaCorrecta + ' puntos';
                    }   
    }
}
}

function cuentaAtras() {
     
    if (minutos > 0 || segundos > 0) {

        if(minutos === 0 && segundos > 0){

            segundos -= 1;
        }
        // condicionals per mostrar format correcte la info per l'html
        let minutosStr = minutos < 10 ? '0' + minutos : minutos;
        let segundosStr = segundos < 10 ? '0' + segundos : segundos;

        cronometroHTML.innerHTML = '00:' + minutosStr + ':' + segundosStr;

        // condició perque es pari quan només ens quedi un enemic:
        if(!juegoFinalizado){
        // Llamada recursiva después de 1000 ms (1 segundo)
        setTimeout(cuentaAtras, 1000);
        }

        // si el temps arriba a cero llavors perden:
    } else {
         // damos visibilidad al cartel de gameOver
         gameOver();
    }
}

function almacenarTiempo() {
    tiempoFinal = [minutos, segundos];
}

function gameOver(){
    panelGameOver.style.display = 'block';
    botonReintentar.style.display = 'block';
    document.querySelector('#preguntas').style.display = 'none';
    cronometroHTML.style.display = 'none';
}

botonReintentar.addEventListener('click', function(){
    location.reload();
});

