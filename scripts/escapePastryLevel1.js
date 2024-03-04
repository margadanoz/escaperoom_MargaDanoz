let panelLetras = document.querySelector('.panelLetras');
// on es crearàn les lletres de la paraula que surti
let divAnagramaJugador = document.querySelector('#anagramaCompletado');
// Div on es mostrarà la informació de com funciona el joc:
let mostrarDivInfo = document.querySelector('#explicacionJuego');
let divPrincipal = document.querySelector('#trainingPastry');
let divJugador = document.querySelector('#anagramaCompletado');
let divInformaGanador = document.querySelector('#informaGanador');  
let divPista = document.querySelector('#divPista');
let cronometro = document.querySelector('.cronometro');
let panelGameOver = document.querySelector('.divGameOver');
let botonReintentar = document.querySelector('#volverJugar');
let puntuacionHTML = document.querySelector('#puntuacionUsuario');

// PER SELECCIONAR ELS BOTONS DE LES PARTIDES
let nuevaPartidaFacil = document.querySelector('#nuevaPartidaFacil');
let nuevaPartidaDificil = document.querySelector('#nuevaPartidaDificil');
let cargarPartidaFacil = document.querySelector('#cargarPartidaFacil');
let cargarPartidaDificil = document.querySelector('#cargarPartidaDificil');
let divBotonesPartida = document.querySelector('.botonesPartida');
let divGuardarPartida = document.querySelector('#divGuardarPartida');
let quitarLetra = document.querySelector('#quitarLetra');
let guardarPartida = document.querySelector('#guardarPartida');
let pasarLevel2 = document.querySelector('#pasarLevel2');
let pistaBoton = document.querySelector('#pista');
let botonverReglas = document.querySelector('#verReglas');
// per mostrar missatge quan sigui la ultima paraula:
let mensajeUltimaPalabra = document.querySelector('#infoUltimaPalabra');
// boolean perque només es gvuardi un cop la final i no es sobreescribeixi puntuaciÓ.
let guardadoFinal = false;

// ARRAYS PARA EL JUEGO:NIVEL FACIL
let arrayAnagramasIngredientes = ['frases','atan','armo','temato','lacena', 'aceleres','calcinaba','ungato','rodaloc','titforupe','fonsi','sotirot'];
let solucionesIngredientes = ['fresas','nata','mora','tomate','canela','cereales','calabacin','nougat','colador','petitfour','sifon','risotto'];
let arrayPistas = ['fruto rojo','aspecto similar a leche','fruto rojo','popular para ensaladas','en rama, en polvo...','alimento básico de la dieta a lo largo de la humanidad',
                    'blanco por dentro, verde por fuera,muy versátil en preparación','postre francés idéntico a nuestra elaboración más típicamente navideña',
                    'que no te la cuelen con esta prueba...','pequeño agasajo del restaurant que acompaña normalmente a los cafés','utiliza cargas de gas','paella a la italiana(que no se ofendan puristas...)'];
// NIVEL DIFICIL:
let anagramasNivelDificil = ['fanelete','traca',"osetidn", "otga", "eovsuh", "teuers", "ajirfa", "tribela", "ónmil", "zanaman", "idon", "loa", "topa", "esoqu", "nara", "aslli", "aygo",'sisar','cleat','sabal','nacho'];
let solucionesNivelDificil  = ['elefante','carta',"destino", "toga", "huevos", "suerte", "jirafa", "libreta", "limón", "manzana", "nido", "ola", "pato", "queso", "rana", "silla", "yoga",'risas','tecla','balsa','ancho'];
let pistasNivelDificil = [
    'Animal con trompa larga y orejas grandes','Se envía por correo y tiene un mensaje escrito',
    'Lo que buscas en un viaje','Se la ponen los jueces',
    'No hay...','Buena o mala',
    'Animal con cuello largo y manchas','Apuntes',
    'Fruta amarilla','Fruta prohibida',
    'Hogar de algunas aves','Surfeala',
    'Cuack cuack','Producto lácteo obtenido por maduración de la cuajada de la leche',
    'Anfibio de piel lisa y húmeda',
    'Mobiliario',
    'Práctica que combina el ejercicio físico, la respiración y la relajación',
    'Felicidad',
    'Instrumento musical',
    'Embarcación','Medida'
];

// variables per emmagatzemar valors del localStorage que ens venen:
let idUsuario;
let nomJugador;
let arrayPartidas = [];
let juegoNoSuperado = false;
// per anar comprovant la paraula:
let adivinada = false;
// anirem ficant les lletres que escolleixin:
let letrasEscogidas = [];
// para salvar obstaculo de impresion en la ultima letra de la funcin comprobarAnagrama:
let ultimaLetra = 0;
// contador per mesurar paraules encertades i trencar el bucle:
let palabrasAcertadas = 0;
let index = 0;
// per crear dades a l'objecte nou de la partida que es guarda:
let nuevoGuardado;
// AGAFEM ELS JUGADORS AMB LA FUNCIÓ QUE ENS PASA L'ALTRE SCRIPT ON ES VEU QUIN ESTA CONECTAT
let jugadorConectado = cargarJugadores();
// booleano para cargar el sitio por donde iba el jugador:
let cargarPartidaGuardada = false;
// para guardar la ultima palabra por la que se ha jugado donde se ha ganado y seguir a partir den ahi cuando se carga la partida
let ultimaPalabraJugada = "";
// para activar el guardado de la nueva partida
let nuevoRegistroPartida = false;
//para registrar la puntacion, y darle el visto bueno que pase a siguiente nivel del escape:
let puntuacionFinal = 0;
// contador para ver cuantas pistas se utilizan:
let pistasUtilizadas = 0;
// para sobreescribir la partida si un jugador que ya tiene una guardada le da de nuevo a nueva partida:
let sobreescribirPartida = false;
let numAComparar;
// per controlar si superen el nivell:
let nivel1Superado = false;
// per activar quan perd el jugador:
let juegoPerdido;
 //obtenim ultima paraula i comparem contingut, si ha arribat fins aqui i té 9 o més punts es que pasa de nivell perque no ha fet gameOver:
 let palabraVictoria = '';
 let cuentaReglas = 0;

// funcio del temps, cronometre i variables necessaries
let tiempo = new Date();
tiempo.setHours(0,8,0,0);
let cronoHTML = document.querySelector('#cronometro');
cronoHTML.innerHTML = '00:08:00';
// emmagatzemem valors a les variables que emprarem per fer compte enrere
let minutos = tiempo.getMinutes();
let segundos = tiempo.getSeconds();
let tiempoFinal;
// per cridar l'interval de temps:
let intervalo;
//per quan es clicka per primera vegada activar el cronometre:
let primerClick = 0;

// Booleans para controlar el nivel:
let nivelFacil = false;
let nivelDificil = false;
let nivelEscogido;
// para si tienen una partida en facil pero tb quieren guadrar una en difcil
let afegeixNou = true;
// sobreescribe facil:
let sobreescribeFacil = false;

// GFUNCIÓ PER EVALUAR SI GUARDAR NOU REGISTRE O SOBREESCIURE
function infoJugadorActual() {
    // verifiquem jugador conectat i carreguem botons
    jugadorConectado.forEach((jugador) => {
        if (parseInt(jugador.conectado) === 1) {
            // ocultem missatge perque ja entra regiustrar a aquesta part_
            document.querySelector('#registroNecesario').style.display = 'none';
            divBotonesPartida.style.display = 'block';
        }
    });   
    // per comprovar si enviem desde guardarPartida
    if (nuevoRegistroPartida) {

        let encontrado = false;
        jugadorConectado.forEach((jugador) => {

            if (parseInt(jugador.conectado) === 1) {
                divBotonesPartida.style.display = 'block';
                let arrayPartidas = jugador.partidaGuardada || [];
                arrayPartidas.forEach(partida => {
                    if (parseInt(partida.idJuego) === 1 &&
                        partida.pantalla === 1 &&
                        partida.juego === 'Escape Cocina'){
                        // si coincide todo debemos sobreescribir
                        // sino añadimos un nuevo registro
                        if(partida.nivelEscogido === 'nivelFacil' && nivelFacil){

                            sobreescribeFacil = true;
                            encontrado = true;
                            sobreescribePartida(jugador);
                        }else if(partida.nivelEscogido === 'nivelDificil' && nivelDificil){
                            encontrado = true;
                            sobreescribePartida(jugador);
                        }
                    }
                });
                // si no trovem cap jugador fiquem un nou registre,
                // sino cridem a sobreescribirPartida
                if (!encontrado) {
                 
                    if(pistasUtilizadas > 0 && palabrasAcertadas > 0){

                        palabrasAcertadas = palabrasAcertadas - pistasUtilizadas;
                        pistasUtilizadas = 0;
                    }
    
                        if(ultimaPalabraJugada === palabraVictoria){
                            mensajeUltimaPalabra.style.display = 'none';
                            // calculamos puntuacion en funcion de tiempo empleado:       
                            if(minutos >= 5 && minutos <= 7){
                                if(nivelFacil){
                                    palabrasAcertadas = palabrasAcertadas + 1000;
                                }else{
                                    palabrasAcertadas = palabrasAcertadas + 5000;
                                }
                            }else if(minutos >= 4 && minutos <= 5){
                                if(nivelFacil){
                                    palabrasAcertadas = palabrasAcertadas + 500;
                                }else{
                                    palabrasAcertadas = palabrasAcertadas + 1000;                                  
                                }
                            }
                            nivel1Superado = true;
                            divInformaGanador.style.display = 'flex';
                            divInformaGanador.style.display = 'block';
                            puntuacionHTML.textContent = palabrasAcertadas;
                            puntuacionHTML.style.display = 'block';
                            pasarLevel2.style.display = 'block';
                            cargarPartidaDificil.style.display = 'none';
                            cargarPartidaFacil.style.display = 'none';
                            nuevaPartidaFacil.style.display = 'none';
                            nuevaPartidaDificil.style.display = 'none';
                            divAnagramaJugador.style.display = 'none';
                            divPrincipal.style.display = 'none';
                            clearInterval(intervalo);
                            cronoHTML.style.display = 'none';
                        }else{
                            nivel1Superado = false;
                        }

                        if(nivelDificil && !nivelFacil){
                            nivelEscogido = 'nivelDificil';
                        }else{
                            nivelEscogido = 'nivelFacil';
                        }

                        let nuevoGuardado = {
                        juego: 'Escape Cocina',
                        pantalla: 1,
                        idJuego: 1,
                        nivel1Superado: nivel1Superado,
                        ultimaPalabraPuntuada: ultimaPalabraJugada,
                        tiempoRestante: tiempoFinal,
                        puntuacion: palabrasAcertadas,
                        nivelEscogido: nivelEscogido
                    };
                    jugador.partidaGuardada.push(nuevoGuardado);
                    localStorage.setItem("jugadores", JSON.stringify(jugadorConectado));
                }
            }
        });
        // Resetear valor al final:
        nuevoRegistroPartida = false;
    }
}

infoJugadorActual();

function sobreescribePartida(jugador) {
    // Per sobreescriure en nivell facil:
    jugador.partidaGuardada.forEach((partida, index) => {
        if (parseInt(partida.idJuego) === 1 &&
            partida.pantalla === 1 &&
            partida.juego === 'Escape Cocina' && partida.nivelEscogido === 'nivelFacil' && sobreescribeFacil) {

                if(pistasUtilizadas > 0 && palabrasAcertadas > 0){

                    palabrasAcertadas = palabrasAcertadas - pistasUtilizadas;
                    pistasUtilizadas = 0;
                }

                    if(ultimaPalabraJugada === palabraVictoria){
                        
                        mensajeUltimaPalabra.style.display = 'none';
                        guardadoFinal = true;
                        
                        if(minutos >= 5 && minutos <= 7){
                            palabrasAcertadas = palabrasAcertadas + 1000;
                        }else if(minutos >= 4 && minutos <= 5){
                            palabrasAcertadas = palabrasAcertadas + 500;
                        }
                        
                        nivel1Superado = true;
                        divInformaGanador.style.display = 'flex';
                        divInformaGanador.style.display = 'block';
                        pasarLevel2.style.display = 'block';
                        puntuacionHTML.textContent = palabrasAcertadas;
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
                pantalla: 1,
                idJuego: 1,
                nivel1Superado: nivel1Superado,
                ultimaPalabraPuntuada: ultimaPalabraJugada,
                tiempoRestante: tiempoFinal,
                puntuacion: palabrasAcertadas,
                nivelEscogido: 'nivelFacil'
            };
            // Sobreescribimos en el lugar donde esta el jugador en conectado:
            jugador.partidaGuardada[index] = Object.assign({}, partida, nuevoGuardado);
            localStorage.setItem("jugadores", JSON.stringify(jugadorConectado));
        // Para sobreescribir en nivel dificil:
        }else if(parseInt(partida.idJuego) === 1 &&
                partida.pantalla === 1 &&
                partida.juego === 'Escape Cocina' && partida.nivelEscogido === 'nivelDificil' && !sobreescribeFacil){

            if(pistasUtilizadas > 0 && palabrasAcertadas > 0){

                palabrasAcertadas = palabrasAcertadas - pistasUtilizadas;
                pistasUtilizadas = 0;
            }

                if(ultimaPalabraJugada === palabraVictoria){

                    guardadoFinal = true;

                    if(minutos >= 5 && minutos <= 7){
                        palabrasAcertadas = palabrasAcertadas + 5000;
                    }else if(minutos >= 4 && minutos <= 5){
                        palabrasAcertadas = palabrasAcertadas + 1000;
                    }
                    
                    nivel1Superado = true;
                    divInformaGanador.style.display = 'flex';
                    divInformaGanador.style.display = 'block';
                    pasarLevel2.style.display = 'block';
                    puntuacionHTML.textContent = palabrasAcertadas;
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
                    pantalla: 1,
                    idJuego: 1,
                    nivel1Superado: nivel1Superado,
                    ultimaPalabraPuntuada: ultimaPalabraJugada,
                    tiempoRestante: tiempoFinal,
                    puntuacion: palabrasAcertadas,
                    nivelEscogido: 'nivelDificil'
                };
                jugador.partidaGuardada[index] = Object.assign({}, partida, nuevoGuardado);
                localStorage.setItem("jugadores", JSON.stringify(jugadorConectado));
                }
    });
}
// Per veure les regles del joc:
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

// ********EVENTS*******//
// Event Listeners para accionar carga de la partida o nueva partida:
cargarPartidaFacil.addEventListener('click', function(){

    cargarPartidaFacil.style.display = 'none';
    cargarPartidaDificil.style.display = 'none';
    nuevaPartidaDificil.style.display = 'none';
    nuevaPartidaFacil.style.display = 'none';

    let almacenamiento = localStorage.getItem('jugadores');
    if (almacenamiento) {
    let datosJugadores = JSON.parse(almacenamiento);

    datosJugadores.forEach((partida =>{
        console.log(datosJugadores);
        partida.partidaGuardada.forEach(jugador=>{
            if(jugador.juego === 'Escape Cocina' && parseInt(jugador.pantalla) === 1
            && jugador.nivelEscogido === 'nivelFacil'){

                divGuardarPartida.style.display = 'block';
                // rescatamos la puntuacion que ya tenemos en el localStorage para actualizar nuestra variable de palabrasAcertadas
                // que será después la puntuación que vuelva a guardarse:
                palabrasAcertadas = jugador.puntuacion;
    
                 // sacamos valor de la ultima palabra guardada para saber por donde continuar:
                 ultimaPalabraJugada = jugador.ultimaPalabraPuntuada;
                //recuperem el temps del localStorage:
                 minutos = jugador.tiempoRestante[0];
                 segundos = jugador.tiempoRestante[1];
                 activaCuentaAtras();

                    // ver el indice que ocupa la palabra:
                    // el index vendrá a partir del indice del array de las soluciones, para poder continuar donde lo dejamos:
                    if (arrayAnagramasIngredientes.includes(ultimaPalabraJugada)) {
                        // Establecer el índice como la posición de la última palabra jugada
                        index = arrayAnagramasIngredientes.indexOf(ultimaPalabraJugada);
                    }
                    palabraVictoria = arrayAnagramasIngredientes[arrayAnagramasIngredientes.length - 1];
                    nivelFacil = true;

                cargarPartidaGuardada = true;
                if(jugador.nivel1Superado === true){
                    document.querySelector('.mensajeInfo').style.display = 'block';
                    cronoHTML.style.display = 'none';
                    guardarPartida.style.display = 'none';
                    divGuardarPartida.style.display = 'none';
                }else{
                    cargarEntrenamiento();
                }
            }
        });
    }));
}
});

cargarPartidaDificil.addEventListener('click', function(){

    cargarPartidaFacil.style.display = 'none';
    cargarPartidaDificil.style.display = 'none';
    nuevaPartidaDificil.style.display = 'none';
    nuevaPartidaFacil.style.display = 'none';

    let almacenamiento = localStorage.getItem('jugadores');
    if (almacenamiento) {
    let datosJugadores = JSON.parse(almacenamiento);
    // Loopeamos el array de las `partidas del objeto jugador que tenemos
    datosJugadores.forEach((partida =>{
        console.log(datosJugadores);
        partida.partidaGuardada.forEach(jugador=>{
            if(jugador.juego === 'Escape Cocina' && parseInt(jugador.pantalla) === 1
            && jugador.nivelEscogido === 'nivelDificil'){

                divGuardarPartida.style.display = 'block';
                // rescatamos la puntuacion que ya tenemos en el localStorage para actualizar nuestra variable de palabrasAcertadas
                // que será después la puntuación que vuelva a guardarse y la premisa para finalizar el juego:
                palabrasAcertadas = jugador.puntuacion;
                 // sacamos valor de la ultima palabra guardada para saber por donde continuar:
                 ultimaPalabraJugada = jugador.ultimaPalabraPuntuada;
                //recuperem el temps del localStorage:
                 minutos = jugador.tiempoRestante[0];
                 segundos = jugador.tiempoRestante[1];
                 activaCuentaAtras();

                    if (anagramasNivelDificil.includes(ultimaPalabraJugada)) {
                        // Establecer el índice como la posición de la última palabra jugada
                        index = anagramasNivelDificil.indexOf(ultimaPalabraJugada);
                    }
                    palabraVictoria = anagramasNivelDificil[anagramasNivelDificil.length - 1];
                    nivelDificil = true;

                cargarPartidaGuardada = true;

                if(jugador.nivel1Superado === true){
                    document.querySelector('.mensajeInfo').style.display = 'block';
                    cronoHTML.style.display = 'none';
                    guardarPartida.style.display = 'none';
                    divGuardarPartida.style.display = 'none';
                }else{
                    cargarEntrenamiento();
                }
            }
        });
    }));
}
});

// Empezar nueva partida facil:
nuevaPartidaFacil.addEventListener('click',function(){
    palabraVictoria = arrayAnagramasIngredientes[arrayAnagramasIngredientes.length - 1];
    nivelFacil = true;
    arrayPartidas = arrayPartidas.map(partida => {
        // si trobem una coincidencia al iterar, sobreescribim amb Object.assign l'objecte partida existent amb les dades que li
        // hem possat a nuevoGuardado, que es la partida que està guardant el jugador:
        if (parseInt(partida.idJuego) === 1 && parseInt(partida.pantalla) === 1 && partida.nivelEscogido === 'nivelFacil') { 
            sobreescribirPartida = true;
        }
    });
        cargarEntrenamiento();
        cargarPartidaFacil.style.display = 'none';
        cargarPartidaDificil.style.display = 'none';
        nuevaPartidaFacil.style.display = 'none';
        nuevaPartidaDificil.style.display = 'none';
        divGuardarPartida.style.display = 'block';
});

// Empezar nueva partida ne nivel dificil:
nuevaPartidaDificil.addEventListener('click',function(){
    palabraVictoria = anagramasNivelDificil[anagramasNivelDificil.length - 1];
    nivelDificil = true;
    arrayPartidas = arrayPartidas.map(partida => {
        // si trobem una coincidencia al iterar, sobreescribim amb Object.assign l'objecte partida existent amb les dades que li
        // hem possat a nuevoGuardado, que es la partida que està guardant el jugador:
        if (parseInt(partida.idJuego) === 1 && parseInt(partida.pantalla) === 1 && partida.nivelEscogido === 'nivelDificil') { 
            sobreescribirPartida = true;
        }
    });
        cargarEntrenamiento();
        cargarPartidaFacil.style.display = 'none';
        cargarPartidaDificil.style.display = 'none';
        nuevaPartidaDificil.style.display = 'none';
        nuevaPartidaFacil.style.display = 'none';
        divGuardarPartida.style.display = 'block';
});

// Botó per guardar la partid i després poder retomarla:
guardarPartida.addEventListener('click', function(){
    // per controlar que només puguin guardar puntuació final una vegada, perque si s'aconsegueix el bonus sino s'aniria sumant
    // mentre estiguessin pitjant el botó:
    if(!guardadoFinal){
            // cridem a la fubnció per llegir les dades que ja teniem de l'objecte jugador i actualizar-ne les de la partida:
    nuevoRegistroPartida = true;
    almacenarTiempo();
    infoJugadorActual();    
    }
});

// Para quitar la ultima letra añadida, por si se equivocan:
quitarLetra.addEventListener('click', function(){

    if(letrasEscogidas.length > 0){

        ultimaLetra = 0;
        // eliminamos la última letra del array:
        letrasEscogidas.pop();
        // eliminem tb la darrera lletra que haviem afegit al div:
        const ultimaLetraVisual = divAnagramaJugador.lastChild;

        if (ultimaLetraVisual) {
            divAnagramaJugador.removeChild(ultimaLetraVisual);
        }
}
});

// Botó per passar al segón nivell al moment desde el primer quan es guanya:
pasarLevel2.addEventListener('click', function(){
    
});

// per demanar pistes pel joc
pistaBoton.addEventListener('click', function(){
    let stringPista;
    pistasUtilizadas++;
    // el jugador no podría pasar de nivel, acabamos con el juego:
    if(pistasUtilizadas > 3){
        // funció que es truca quan s'esgota el temps o s'utilitzen
        // més de 3 pistes en una sola ronda
        gameOver();
    }
            // llegim per quina paraula del array va el joc i treiem la pista amb el mateix index:
            let indexPista = index;
            // treiem paraula segons nivell de dificultat que estem jugant:
            if(nivelFacil){
                stringPista = arrayPistas[indexPista];
            }else{
                stringPista = pistasNivelDificil[indexPista];           
            }
            // per on sortirà la pista associada a la paraula que juguem:
            divPista.style.display = 'block';
            divPista.innerHTML = stringPista;

            // ocultamos la pista después de 3 segundos:
            setTimeout(function(){

                divPista.style.display = 'none';  
            },3000);
});

function cargarEntrenamiento() {
    
    // ocultar el div que mostra la info referent al joc una vegada es comença
    // la partida
    mostrarDivInfo.style.display = 'none';
    let paraElBucle = false;
    // i tb netejem l'auxiliar que fem servir per agafar l'ultima lletra i pdoer crearla:
    // això serveix per mitjançant un contADOR parar i que no es continuint seleccionant més lletres del compte
    // i per comprovar automàticament si la paraula es encertada i passar a la següent:
    ultimaLetra = 0;
    console.log('nivel facil',nivelFacil);
    if(nivelFacil){
                // mientras no acabemos el array, vamos recorriendo y sacando palabras
    if (!paraElBucle && palabrasAcertadas < solucionesIngredientes.length){

        arrayAnagramasIngredientes.forEach((palabra, indiceArray) => {
            // equiparem index perque vagin a la par
            if (indiceArray === index) {

                for(let i=0;i<palabra.length;i++){
                    // creem el div que contindrà les letres que generem
                    const letraDiv = document.createElement('div');
                    letraDiv.classList.add('letra');
                    // omplim el div amb les lletres
                    letraDiv.innerHTML = palabra[i];

                    // event per comprovar si es fa click a les lletres
                    letraDiv.addEventListener('click', () => comprobarAnagrama(palabra[i], palabra));

                    // agreguem el div al div principal que conté les lletres
                    panelLetras.appendChild(letraDiv);
                    // per guardar la darrera parauka per la que es juga, per si volguessin guardar:
                    ultimaPalabraJugada = palabra;
                }
                paraElBucle = true;
            }
        });
        if (index === arrayAnagramasIngredientes.length - 1) {
            mensajeUltimaPalabra.style.display = 'block';
        }
    }
    }else{
      if (!paraElBucle && palabrasAcertadas < anagramasNivelDificil.length) { 
        anagramasNivelDificil.forEach((palabra, indiceArray) => {
            // equiparem index perque vagin a la par
            if (indiceArray === index) {

                for(let i=0;i<palabra.length;i++){
                    // creem el div que contindrà les letres que generem
                    const letraDiv = document.createElement('div');
                    letraDiv.classList.add('letra');
                    // omplim el div amb les lletres
                    letraDiv.innerHTML = palabra[i];

                    // event per comprovar si es fa click a les lletres
                    letraDiv.addEventListener('click', () => comprobarAnagrama(palabra[i], palabra));

                    // agreguem el div al div principal que conté les lletres
                    panelLetras.appendChild(letraDiv);
                    // per guardar la darrera parauka per la que es juga, per si volguessin guardar:
                    ultimaPalabraJugada = palabra;
                }
                paraElBucle = true;
            }
        });
        if (index === anagramasNivelDificil.length - 1) {
            mensajeUltimaPalabra.style.display = 'block';
        }
    }
    }   
    }

//imprimir lletres per pantalla, les escollides pel jugador:
function comprobarAnagrama(letra, palabra) {

    // activem el crono amb el primer click:
    primerClick++;

    // funció amb setInterval que donarà 8 minuts per endevinar les 12 o 21 paraules:
    // boolean de control perque sino es tornaba boig el contador quan venia de carregar una partida i se li sumaba primer click
    if(primerClick === 1 && !cargarPartidaGuardada){
        activaCuentaAtras();
    }

    // per poder fer les comparacions, perque al ser string i array, l'array sempre tindrà
    // una posició menys
    let numLetras = palabra.length;
    numAComparar = numLetras - 1;

    // mentre que al array d'escollides hi hagi menys lletres que llargaria de paraula:
    if(letrasEscogidas.length < numAComparar){

         //mostrem les lletres per ordre de selecció, creant els elements:
        const letraAnagrama = document.createElement('div');
        letraAnagrama.classList.add('letraSeleccionada');
        // establim contingut de les lletres
        letraAnagrama.textContent = letra; 

        //agreguem el div creat que conté les lletres al principoal
        anagramaCompletado.appendChild(letraAnagrama);

        letrasEscogidas.push(letra);

        // quan ja tenim l'array complet, comprovem si s'ha encertat la paraula o no:
    }else if(letrasEscogidas.length === numAComparar){
        // en aquest punt la variable val cero, dcom es compleixen les dues condicions
        if(ultimaLetra === 0){
        //mostrem les lletres per ordre de selecció, creant els elements:
        const letraAnagrama = document.createElement('div');
        letraAnagrama.classList.add('letraSeleccionada');
        // establim contingut de les lletres
        letraAnagrama.textContent = letra; 

        //agreguem el div creat que conté les lletres al principoal
        anagramaCompletado.appendChild(letraAnagrama);
            // per ficar yltima lletra, sino no no m'he la pillaba
        letrasEscogidas.push(letra);
            // agafem kla paraula com string que es format en que es troba a l'array de les solucions:
        let stringPalabraJugador = letrasEscogidas.join('');
        
        if(nivelFacil){
                        // mirem si la paraula està dins de l'array de les solucions:
                if(solucionesIngredientes.includes(stringPalabraJugador)){

                    setTimeout(function(){

                        disparaGanador();
                    },700);
                }
        }else{
                    // mirem si la paraula està dins de l'array de les solucions:
                if(solucionesNivelDificil.includes(stringPalabraJugador)){

                    setTimeout(function(){

                        disparaGanador();
                    },700);
                }
        }

        // si no es correcta la paraula fem correr el contador, de manera que haurà d'eliminar lletres per tornar a entrar en el bucle
        // quan el length sigui igual de gran:
        ultimaLetra++;
        
        }    
    }
}

// funció per activar el cronometre:
function cuentaAtras(){

    document.querySelector('.cronometro').style.display = 'block';

    if(minutos > 0 || segundos > 0){

        if (minutos > 0 && segundos === 0) {

            minutos -= 1;
            segundos = 59;

        } else if(minutos > 0 && segundos > 0){

            segundos -= 1;
        }else if(minutos === 0 && segundos > 0){
            segundos -= 1;
        }
        // actualizamos registros de tiempo
        tiempo.setMinutes(minutos);
        tiempo.setSeconds(segundos);
    }

    if(minutos === 0 && segundos === 0){
        // netejem l'interval de temps:
        clearInterval(intervalo);
        // cridem per netejarho tot:
        gameOver();
    }
       // condicionals per mostrar format correcte la info per l'html
       let minutosStr = minutos < 10 ? '0' + minutos : minutos;
       let segundosStr = segundos < 10 ? '0' + segundos : segundos;

       cronoHTML.innerHTML = '00:' + minutosStr + ':' + segundosStr;
}

function activaCuentaAtras(){

    intervalo = setInterval(cuentaAtras,1000);
}


function disparaGanador(){

    // sumem paraules encertades per després la puntuació:
    palabrasAcertadas++;
    // resetejem contador per la propera lletra que ens vingui:
    ultimaLetra = 0;
    // per equiparar contadors a funcio d'entrenament
    index++;
    // netejar el body de la paraula ja encertada i de la paraula que ja havia sortit:
    panelLetras.innerHTML = '';
    divAnagramaJugador.innerHTML = '';
    // netejem l'array on haviem emmagatzemat les lletres escollides anterioment:
    letrasEscogidas = [];
    
    // iniciem el bucle una altra vegada a la funció d'entrenament
    setTimeout(function(){

        cargarEntrenamiento();
    },1000);    
}

//para sacar panel de GameOver si pierden:
function gameOver(){
    // mostrem missatge de perdre i mantenim botó per tornar a jugar:
    panelGameOver.style.display = 'flex';
    // ocultem la resta
    clearInterval(intervalo);
    botonReintentar.style.display = 'block';
    cronoHTML.style.display = 'none';
    guardarPartida.style.display = 'none';
    divAnagramaJugador.style.display = 'none';
    panelLetras.style.display = 'none';
    document.querySelector('#divGuardarPartida').style.display = 'none';
    document.querySelector('#divPista') = 'none';
    document.querySelector('#anagramaCompletado').style.display  = 'none';
}

// Almacena el tiempo actual en el juego y guarda en localStorage
function almacenarTiempo() {
    tiempoFinal = [minutos, segundos];
    console.log(tiempoFinal);
}


