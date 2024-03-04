let video = document.querySelector('#video');
// BOTONES PARA ÑLA PARTIDA
let botonNuevaPartida = document.querySelector('#nuevaPartida');
let botonCargar = document.querySelector('#cargaPartida');
let guardarPartida = document.querySelector('#guardaPartida');
let botonPistas = document.querySelector('#pistas');
let botonverReglas = document.querySelector('#verReglas');

let pasarSiguienteNivel = document.querySelector('#pasarSiguienteNivel');
let btnCompruebaBonus = document.getElementById("compruebaBonus");

// PRIMERA PARTE DE LA PRUEBA, MEZCLA DE COLORES
let coloresVacuna = document.querySelector('.divsJuego');
let primeraPrueba = document.querySelector('#paso1');
let divRojo = document.querySelector('#red');
let divVerde = document.querySelector('#green');
let divAzul = document.querySelector('#blue');
let redInput = document.querySelector('#redInput');
let greenInput = document.querySelector('#greenInput');
let blueInput = document.querySelector('#blueInput');
let botonProsigue = document.querySelector('#botonProsigue');
let botonCombinacion = document.querySelector('#resuelveCombinacion');
let paso1Superado = false;
let paso2Superado = false;
let clickRed = 0;
let clickGreen = 0;
let clickBlue = 0;
let divsSeleccionados = 0;
// ver o no las reglas:
let cuentaReglas = 0;

// activacion de cronometro en segunda parte de la prueba:
let tiempo = new Date();
tiempo.setHours(0,10,0,0);
let minutos = tiempo.getMinutes();
let segundos = tiempo.getSeconds();
let cronoHTML2 = document.querySelector('#cronoHTML2');
let tiempoFinal = [];
let activaCrono = 0;
let temporizador;

// PARTE PRUEBA DEL PC:
// segunda parte de la prueba 2:
let pregunta1Superada = false;
let pregunta2Superada = false;
let pregunta3Superada = false;
// boolean per controlar el display de l'explicació
let primeraVezJugado = true;
let juegoGanado = false;

// booleans per controlar guardar partrida, carregarla i sobreescriure o escriure
// per primera vegada
let guardaPartida = false;
let noHayPartidaPrevia = false;
let nuevoGuardado;
let nivel2Superado = false;

// per pistes:
let pistasAcumuladas = 0;
let cuentaPistas = 0;
let puntuacionFinal = 0;
let bonusObtenido = false;
let jugadoQuizExtra = false;
// per sobreescriure la partida, pels displays si volen sobreesciure dels elements a html:
let empezarPartida = false;

//per acumular els valors dels inputs guardats i recuperarlos en carregar la partida:
let arrayPistas = ['El de en medio tiene una rima recurrente e incómoda',
                    'Edificio,construcción', 'alfabeto del país del fado y las toallas'];

// Cargar la informacion del jiugador
let jugadorConectado = cargarJugadores();

function leeInfo(){
    
    // per disparar video la primera vegada que es conecti el jugador
    // i tota la logica que hi ha darrere, sino omitim:
    jugadorConectado.forEach((jugador) => {
        if(parseInt(jugador.conectado) === 1){
            let arrayPartidas = jugador.partidaGuardada || [];
            arrayPartidas.forEach(partida => {
                if (parseInt(partida.idJuego) !== 2 &&
                    parseInt(partida.pantalla) !== 2 &&
                    partida.juego === 'Escape Zombies') {
                        noHayPartidaPrevia = true;
                        encontrado = false;
                }
            });
        }
    });
    // Para que se carguen correctamente los elementos html si sobreescribimos
    // la partida:
    if(empezarPartida && !noHayPartidaPrevia){
        pregunta1Superada = false;
        pregunta2Superada = false;
        pregunta3Superada = false;
        nivel2Superado = false;
    }

    if (guardaPartida) {
        jugadorConectado.forEach((jugador) => {

            let arrayPartidas = jugador.partidaGuardada || [];
            // trovem jugador conectat per portar les dades
            if(parseInt(jugador.conectado) === 1){

            arrayPartidas.forEach(partida => {
                if(parseInt(jugador.conectado) === 1){
                    // si coincideix nombre de pantalla i joc,es que ja tenim partida guardada, per tant sobreescribim
                if (parseInt(partida.idJuego) === 2 &&
                    partida.pantalla === 2 &&
                    partida.juego === 'Escape Zombies') {
                        noHayPartidaPrevia = false;
                        encontrado = true;
                        if(!noHayPartidaPrevia){
                            sobreescribePartida(jugador);
                        }
                }
            }
        });
        }
        });
        // si no hi ha partida previa guardada al seu nivell:
        if (!encontrado && noHayPartidaPrevia) {
            // si han ganado el juego calculamos puntuacion,
            if(juegoGanado && !jugadoQuizExtra){
                puntuacionFinal = calculaPuntuacion();

            }else if(juegoGanado && jugadoQuizExtra){
                
                puntuacionFinal = calculaPuntuacion();

                    if(bonusObtenido){
                        puntuacionFinal = puntuacionFinal * 2;
                    }else if(!bonusObtenido){
                        puntuacionFinal = puntuacionFinal / 2;
                    }
            }else{
                puntuacionFinal = 0;
            }

            nuevoGuardado = {
                juego: 'Escape Zombies',
                pantalla: 2,
                idJuego: 2,
                nivel2Superado: nivel2Superado,
                pregunta1Superada : pregunta1Superada,
                pregunta2Superada: pregunta2Superada,
                pregunta3Superada:pregunta3Superada,
                tiempoRestante: tiempoFinal,
                puntuacion: puntuacionFinal
            };
            // guardem l'objecte creat
            jugadorConectado.forEach((jugador) => {
                jugador.partidaGuardada.push(nuevoGuardado);
            });
            localStorage.setItem("jugadores", JSON.stringify(jugadorConectado));
        }

    }
        // si no hi ha partida partida previa guardada disparem el video
        if(noHayPartidaPrevia){
        // event listener per mostrar la intro de la historia
        // en acabar el video:
            video.addEventListener('ended', function(){
                document.querySelector('.explicacionJuego').style.display = 'block';
                document.querySelector('#introHistoria').style.display = 'none';
            });
        }else{
            document.querySelector('.explicacionJuego').style.display = 'none';
            document.querySelector('#introHistoria').style.display = 'none';
        }
        // resetejar valoer:
        guardaPartida = false;
        encontrado = false;
}
leeInfo();

function calculaPuntuacion(){
    puntuacionFinal = 1000;
    if(cuentaPistas > 0){
        console.log('pistas utilizadas',cuentaPistas);
        let penalizacionPorPistas = 100 * cuentaPistas;
        puntuacionFinal = puntuacionFinal - penalizacionPorPistas;
    }else{
        puntuacionFinal += 1000;
    }

    if(minutos >=8 && minutos <= 9){
        puntuacionFinal = puntuacionFinal + 10000;
    }else if(minutos >= 7 && minutos < 8){
        puntuacionFinal = puntuacionFinal + 1000;
    }else if(minutos >= 5 && minutos < 7){
        puntuacionFinal = puntuacionFinal + 500;                 
    }
    return puntuacionFinal;
}

function sobreescribePartida(jugador) {
    // si han ganado el juego calculamos puntuacion,
            if(juegoGanado && !jugadoQuizExtra){
                
                puntuacionFinal = calculaPuntuacion();

            }else if(juegoGanado && jugadoQuizExtra){
                
                puntuacionFinal = calculaPuntuacion();

                if(bonusObtenido){
                    puntuacionFinal = puntuacionFinal * 2;
                }else{
                    puntuacionFinal = puntuacionFinal / 2;
                }
                
            }else{
                puntuacionFinal = 0;              
            }

            // sumem per pujar al objecte la quantitat de pistes
        pistasAcumuladas = cuentaPistas + pistasAcumuladas;
            nuevoGuardado = {
                juego: 'Escape Zombies',
                pantalla: 2,
                idJuego: 2,
                nivel2Superado: nivel2Superado,
                pregunta1Superada : pregunta1Superada,
                pregunta2Superada: pregunta2Superada,
                pregunta3Superada:pregunta3Superada,
                tiempoRestante: tiempoFinal,
                puntuacion: puntuacionFinal
            };
    // iteramos sobre el array de partidas y en caso de haber coincidencia,
    // que la habrá porque ya viene confirmada de la funcin principal asignamos nuevos valores:
    jugador.partidaGuardada.forEach((partida, index) => {
        if (parseInt(partida.idJuego) === 2 &&
            partida.pantalla === 2 &&
            partida.juego === 'Escape Zombies') {
            jugador.partidaGuardada[index] = Object.assign({}, partida, nuevoGuardado);
            return;
        }
    });
    localStorage.setItem("jugadores", JSON.stringify(jugadorConectado));
    empezarPartida = false;
}

botonCargar.addEventListener('click', function() {
    botonNuevaPartida.style.display = 'none';
    botonverReglas.style.display = 'none';
    // traemos datos y comprobamos si los hay
    let almacenamiento = localStorage.getItem('jugadores');
    if (almacenamiento) {
        let datosJugadores = JSON.parse(almacenamiento);
        datosJugadores.forEach((jugador) => {
            if(parseInt(jugador.conectado) === 1){
                console.log('hola');
                jugador.partidaGuardada.forEach(partida => {
                    // Verificar si la partida es de Escape Zombies en la pantalla 2
                    
                    if (parseInt(partida.idJuego) === 2 &&
                        parseInt(partida.pantalla) === 2 &&
                        partida.juego === 'Escape Zombies') {
                           
                            minutos = partida.tiempoRestante[0];
                            segundos = partida.tiempoRestante[1];
                            botonCargar.style.display = 'none';
                            // actualitzem les pistes que es contaràn al llarg
                            // del joc:
                            pistasAcumuladas = partida.pistasUtilizadas;
                            pregunta1Superada = partida.pregunta1Superada;
                            pregunta2Superada = partida.pregunta2Superada;
                            pregunta3Superada = partida.pregunta3Superada;
                            nivel2Superado = partida.nivel2Superado;
                            if(pregunta1Superada && pregunta2Superada && pregunta3Superada){
                                document.querySelector('.mensajeInfo').style.display = 'block';
                            }else{
                                cargarPantalla();
                            }
                    }else{
                        // document.querySelector('#noHayDatos').style.display = 'block';
                    }
                });

            }
        });
    }
});
// Peer veure quina pantalla toca carregar, minim serà la del quiz 1:
function cargarPantalla(){
    //carreguem la pantalla segons la pregunta per la que anem:
    if(nivel2Superado){
        document.querySelector('#quiz1').style.display = 'none';
        document.querySelector('#pista3').style.display = 'none';
        document.querySelector('#quiz3').style.display = 'none';
        document.querySelector('#pistas').style.display = 'none';
        document.querySelector('#resuelveCombinacion').style.display = 'none';
        document.querySelector('#imagenPc').style.display = 'none';
        document.querySelector('#panelDigitos').style.display = 'none';
        juegoGanado = true;
        nivel2Superado = true;
        // hacemos visible boton de siguiente nivel y quiz bonus extra:
        pasarSiguienteNivel.style.display = 'block';
        document.querySelector('#quizBonusExtra').style.display = 'flex';
    }else{
        if(pregunta1Superada && pregunta2Superada && pregunta3Superada){


        }else if(pregunta1Superada && pregunta2Superada){
            
                    document.querySelector('#input1').style.backgroundColor = 'lightgreen';
                    document.querySelector('#input3').style.backgroundColor = 'lightgreen';
                    document.querySelector('#input1').setAttribute('readonly','true');
                    document.querySelector('#input3').setAttribute('readonly', 'true');
                    document.querySelector('#input1').value = 'C';
                    document.querySelector('#input3').value = 'H';
                    document.querySelector('#input2').value = 6;
                    document.querySelector('#input4').value = 5;
                    document.querySelector('#input2').style.backgroundColor = 'lightgreen';
                    document.querySelector('#input4').style.backgroundColor = 'lightgreen';
                    document.querySelector('#input2').setAttribute('readonly','true');
                    document.querySelector('#input4').setAttribute('readonly', 'true');
                    document.querySelector('.ordenador').style.display = 'flex';
                    botonCombinacion.textContent = 'Pasar a pregunta 3';
                    accesoOrdenador();
    
    
        }else if(pregunta1Superada){
                    document.querySelector('#input2').value = 6;
                    document.querySelector('#input4').value = 5;
                    document.querySelector('#input2').style.backgroundColor = 'lightgreen';
                    document.querySelector('#input4').style.backgroundColor = 'lightgreen';
                    document.querySelector('#input2').setAttribute('readonly','true');
                    document.querySelector('#input4').setAttribute('readonly', 'true');
                    document.querySelector('.ordenador').style.display = 'flex';
                    botonCombinacion.textContent = 'Pasar a pregunta 2';
                    accesoOrdenador();
    
        }else{
           document.querySelector('.ordenador').style.display = 'flex';
            accesoOrdenador();
        }
        // quan sapiguem quina pantalla carreguem cridem tb per carregar el temps
        activaCuentaAtras();
    }
}

botonNuevaPartida.addEventListener('click', function(){
    botonCargar.style.display = 'none';
    guardarPartida.style.display = 'none';
    botonNuevaPartida.style.display = 'none';
    botonverReglas.style.display = 'none';
    empezarPartida = true;
    leeInfo();
});

// GUARDAR LA PARTIDA
guardarPartida.addEventListener('click', function(){
    guardaPartida = true;
    guardaTiempo();
    leeInfo();
});

botonverReglas.addEventListener('click',function(){
    cuentaReglas++;

    if(cuentaReglas === 1){
        document.querySelector('.reglasNivel2').style.display = 'block';
        botonverReglas.textContent = 'Dejar de ver reglas';
    }else if(cuentaReglas === 2){
        cuentaReglas = 0;
        botonverReglas.textContent = 'Ver reglas';
        document.querySelector('.reglasNivel2').style.display = 'none';
    }
});

// efectes canvi d'estils al boto d'historia, tancament de video i displays
function cambiaTexto(){
    document.querySelector('#botonProsigue').textContent = 'Tu salvacion';
}
function vuelveTexto(){
    document.querySelector('#botonProsigue').textContent = 'Toca cuando lo hayas leido';
}
botonProsigue.addEventListener('click',function(){   
    document.querySelector('.explicacionJuego').style.display = 'none';
    document.querySelector('.definePruebaTexto').style.display = 'block';  
}) ;

function cuentaClicksRojo(){
    clickRed++;
    // para actilet crono al primer click en el div
    if(activaCrono !== 1){
        activaCrono++;
        sorpresaCrono();
    }
    if(clickRed === 1){
        divRojo.classList.add('borderSeleccionado');
    }else if(clickRed === 2){
        divRojo.classList.remove('borderSeleccionado');
        clickRed = 0;
    }
    compruebaClicks();
}
function cuentaClicksVerde(){
    clickGreen++;
        // para actilet crono al primer click en el div
        if(activaCrono !== 1){
            activaCrono++;
            sorpresaCrono();
        }
    if(clickGreen === 1){
    divVerde.classList.add('borderSeleccionado');
    }else if(clickGreen === 2){
        divVerde.classList.remove('borderSeleccionado');
        clickGreen = 0;
    }
    compruebaClicks();
}
function cuentaClicksAzul(){
    clickBlue++;
        // para actilet crono al primer click en el div
        if(activaCrono !== 1){
            activaCrono++;
            sorpresaCrono();
        }
    if(clickBlue === 1){
    divAzul.classList.add('borderSeleccionado');
    }else if(clickBlue === 2){
        divAzul.classList.remove('borderSeleccionado');
        clickBlue = 0;
    }
    compruebaClicks();
}
// comprobamos si se ha dado una combinación y si es así comprobamos si es la correcta:
function compruebaClicks(){
            if ((clickBlue === 1 && clickGreen === 1) || (clickBlue === 1 && clickRed === 1) || (clickGreen === 1 && clickRed === 1)) {
                if (greenInput.value.length !== 0 || redInput.value.length !== 0 || blueInput.value.length !== 0){
            console.log('entra');
            fabricaVacuna();
    }
}
}
// activat crono al primer click
function sorpresaCrono(){
    document.querySelector('#sorpresaCrono2').style.display = 'block';
    setTimeout(function(){
        document.querySelector('#sorpresaCrono2').style.display = 'none';
    },12000);
    activaCuentaAtras();//actibva el cronometro con el click del html
}

function fabricaVacuna(){
    // si esta visible significa que estem al primer pas de la prova:
    // fem groc
    if(primeraPrueba.style.display !== 'none'){   

        if(clickRed === 1 && clickGreen === 1 && 
            parseInt(redInput.value) === 1 && parseInt(greenInput.value) === 1){

            paso1Superado = true;
            divRojo.style.display = 'none';
            redInput.style.display = 'none';
            divVerde.style.backgroundColor = 'yellow';

            greenInput.value = '';
            divVerde.classList.remove('borderSeleccionado');
            
        }else{
            divVerde.classList.remove('borderSeleccionado');
            divAzul.classList.remove('borderSeleccionado');
            divRojo.classList.remove('borderSeleccionado');
        }

        if(paso1Superado){
                primeraPrueba.style.display = 'none';
        }
        clickGreen = 0;
        clickRed = 0;
        clickBlue = 0;
        divsSeleccionados = 0;
    }
    if(primeraPrueba.style.display === 'none'){
        if(clickGreen === 1 && clickBlue === 1 && 
            parseInt(greenInput.value) === 1 && parseInt(blueInput.value) === 1){
            paso2Superado = true;
            divVerde.style.backgroundColor = 'green';
            divAzul.style.display = 'none';
            greenInput.style.display = 'none';
            blueInput.style.display = 'none';
            divVerde.classList.remove('borderSeleccionado');
        }

  setTimeout(function () {
    if (paso2Superado) {

        divVerde.style.display = 'none';
        primeraPrueba.textContent = '';
        primeraPrueba.style.display = 'block';

        setTimeout(function () {
            primeraPrueba.textContent = 'Ahora ya tienes la base de la vacuna...Dentro del despacho del militar a cargo del proyecto se encuentra el ordenador' + '\n' + 'donde se guardan las proporciones exactas y el resto de ingredientes para completar la formula';
        }, 1000);
        setTimeout(function () {
            primeraPrueba.textContent = 'Descubre la clave del ordenador y tendrás acceso a los documentos.';
        }, 8000);
        setTimeout(function () {
            primeraPrueba.style.display = 'none';
        }, 12000);

        // mostramos segundo paso de la prueba
        setTimeout(function () {
            document.querySelector('.ordenador').style.display = 'flex';
        }, 2000); // Asegúrate de que este se ejecute al mismo tiempo que el siguiente bloque
    }
}, 2000);
    }
}
// Segunda parte de la prueba 
function accesoOrdenador(){
    // mostrar botó de guardar, així controlarem en quin punt guarden
    // per primera fase 1 perque es senzilla, aixi es complica una mica mes
    guardarPartida.style.display = 'block';
    // hacemos visible la primera pregunta
    document.querySelector('#quiz1').style.display = 'block';
    document.querySelector('#iniciaPrueba2').style.display = 'none';

    // canviar estils per resaltar on han d'introduïr els nombres:
    // quiz 1.
    document.querySelector('#input2').style.backgroundColor = 'lightblue';
    document.querySelector('#input4').style.backgroundColor = 'lightblue';
    // evento para comprobar la combinacion que nos envian desde el html:  
    botonCombinacion.addEventListener('click', function(){

            if(parseInt(document.querySelector('#input2').value) === 6 
            && parseInt(document.querySelector('#input4').value) === 5){
                // pasem a verd i establim atribut readonly perque no puguin tecar-ho més
                document.querySelector('#input2').style.backgroundColor = 'lightgreen';
                document.querySelector('#input4').style.backgroundColor = 'lightgreen';
                document.querySelector('#input2').setAttribute('readonly','true');
                document.querySelector('#input4').setAttribute('readonly', 'true');
                document.querySelector('#quiz1').style.display = 'none';
                botonCombinacion.textContent = 'Resuelve pregunta 2';
                pregunta1Superada = true;
    
            }else{
                document.querySelector('#input2').style.backgroundColor = 'tomato';
                document.querySelector('#input4').style.backgroundColor = 'tomato';
            }

        // pas de segona pregunta:
        // comporovem si el lenbgth del val supera 0 per entrar a comprolet
        if(pregunta1Superada){
            // ocultem pista si l'havien solicitat:
            document.querySelector('#pista1').style.display = 'none';
            document.querySelector('#quiz2').style.display = 'block';
            document.querySelector('#input1').style.backgroundColor = 'lightblue';
            document.querySelector('#input3').style.backgroundColor = 'lightblue';

            if(pregunta1Superada && document.querySelector('#input1').value.length !== 0
            && document.querySelector('#input3').value.length !== 0){
    
                if(document.querySelector('#input1').value.toUpperCase() === 'C' 
                    && document.querySelector('#input3').value.toUpperCase() === 'H'){
    
                document.querySelector('#input1').style.backgroundColor = 'lightgreen';
                document.querySelector('#input3').style.backgroundColor = 'lightgreen';
                document.querySelector('#input1').setAttribute('readonly','true');
                document.querySelector('#input3').setAttribute('readonly', 'true');
                document.querySelector('#quiz2').style.display = 'none';
                botonCombinacion.textContent = 'Resuelve pregunta 3';
                pregunta2Superada = true;
    
            }else{
                document.querySelector('#input1').style.backgroundColor = 'tomato';
                document.querySelector('#input3').style.backgroundColor = 'tomato';
            }
         }
        }
        // comprovem la darrera pregunta:
        if(pregunta2Superada){
            document.querySelector('#pista2').style.display = 'none';
            document.querySelector('#quiz3').style.display = 'block';
            document.querySelector('#input5').style.backgroundColor = 'lightblue';
            document.querySelector('#input6').style.backgroundColor = 'lightblue';

            if(pregunta2Superada && document.querySelector('#input5').value.length !== 0
            && document.querySelector('#input6').value.length !== 0){
    
                if(document.querySelector('#input5').value.toUpperCase() === 'N' 
                    && document.querySelector('#input6').value.toUpperCase() === 'H'){
    
                document.querySelector('#input5').style.backgroundColor = 'lightgreen';
                document.querySelector('#input6').style.backgroundColor = 'lightgreen';
                document.querySelector('#input5').setAttribute('readonly','true');
                document.querySelector('#input6').setAttribute('readonly', 'true');
                document.querySelector('#quiz3').style.display = 'none';
                botonCombinacion.textContent = 'Resuelve pregunta 3';
                pregunta3Superada = true;
    
            }else{
                document.querySelector('#input1').style.backgroundColor = 'tomato';
                document.querySelector('#input3').style.backgroundColor = 'tomato';
            }
        }
        setTimeout(function(){
                        // quan superen l'ultima pregunta li donem accés a l'últim nivell:
            if(pregunta3Superada){  
                guardaTiempo();          
                document.querySelector('#pista3').style.display = 'none';
                document.querySelector('#quiz3').style.display = 'none';
                document.querySelector('#pistas').style.display = 'none';
                document.querySelector('#resuelveCombinacion').style.display = 'none';
                document.querySelector('#imagenPc').style.display = 'none';
                document.querySelector('#panelDigitos').style.display = 'none';
                juegoGanado = true;
                nivel2Superado = true;
                clearTimeout(temporizador);
                cronoHTML2.style.display = 'none';
                // hacemos visible boton de siguiente nivel y quiz bonus extra:
                document.querySelector('#videoRescate').style.display = 'block';
                pasarSiguienteNivel.style.display = 'block';
                guardarPartida.style.display = 'none';
                document.querySelector('#quizBonusExtra').style.display = 'flex';
            }
        },2000);
        }
    });
}
// compte enrere per prova 2:
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

        cronoHTML2.innerHTML = '00:' + minutosStr + ':' + segundosStr;
        
        temporizador = setTimeout(activaCuentaAtras, 1000);   

        // si el temps arriba a cero llavors perden:
    } else {
         // damos visibilidad al cartel de gameOver
        //  document.querySelector('.cuerpoAEntero').style.display = 'none';
    }
}

// començem el joc:
botonNuevaPartida.addEventListener('click', function(){
    // ocultem darrera explicacio i deixem veure el joc amb
    // el primer pas de la prova:
    document.querySelector('.definePruebaTexto').style.display = 'none';
    document.querySelector('#paso1').style.display = 'block';
    setTimeout(function(){
        primeraPrueba.textContent = 'Primero define proporcion y luego pulsa la mezclas que creas correcta. 1:1 para igual cantidad. 1:2 para el doble.';
    },4000);
    setTimeout(function(){
        primeraPrueba.textContent = '';
    },10000);
    document.querySelector('.divPrincipalJuego').style.display = 'flex';
});

// botón para pedir pistas, en funcion de la pregunta en la que estemos ofrecerá una u otra
botonPistas.addEventListener('click',function(){

    if(!pregunta1Superada){
        document.querySelector('#pista1').textContent = arrayPistas[0];
        document.querySelector('#pista1').style.display = 'block';
        cuentaPistas++;

    }else if(pregunta1Superada && !pregunta2Superada){
        
        document.querySelector('#pista2').textContent = arrayPistas[1];
        document.querySelector('#pista2').style.display = 'block';
        cuentaPistas++;

    }else if(pregunta1Superada && pregunta2Superada && !pregunta3Superada){
        
        document.querySelector('#pista3').textContent = arrayPistas[2];
        document.querySelector('#pista3').style.display = 'block';
        cuentaPistas++;
    }
});

pasarSiguienteNivel.addEventListener('click', function(){
    guardaPartida = true;
    guardaTiempo();
    leeInfo();
});

// eventpo del bonus
btnCompruebaBonus.addEventListener("click", function() {
    jugadoQuizExtra = true;
    // Comprobamos cada checkbox si estan los que tienen que estar seleccionados:
    let checkExtra1 = document.querySelector('#quizExtra1');
    let checkExtra2 = document.querySelector('#quizExtra2');
    let checkExtra3 = document.querySelector('#quizExtra3');
        // Si el checkbox está marcado y su id es "quizExtra3" (la respuesta correcta)
        if (checkExtra1.checked && checkExtra2.checked && checkExtra3.checked) {
            bonusObtenido = true;
        }

    // ocultar el panel pasados unos segundos:
    document.querySelector('#quizFinal').style.display = 'none';
}); 

function guardaTiempo(){
    tiempoFinal = [minutos, segundos]; 
}