let imagenesHeroes = document.querySelectorAll('.imagenesBuenas');
let divImagesBuenas = document.querySelector('#divImagesBuenas');
let divImagenesEnemigos = document.querySelector('#imagenes1');
// nodeList con todas las imagenes de enemigos del html
let imagenesEnemigos = document.querySelectorAll('.imagenes1');
let zombie1 = document.querySelector('#zombie1');
let zombie2 = document.querySelector('#zombie2');
let zombie3 = document.querySelector('#zombie3');
let zombie4 = document.querySelector('#zombie4');
let zombie5 = document.querySelector('#zombie5');
let flechaHuida = document.querySelector('#imagenFlecha');
// convertimos en array, porque la obtencion original de .imagenes1
// es un nodeList, y no nos permitiría splice para ir sacando de la lista
// a los enemigos derrotados:
let arrayEnemigos = Array.from(imagenesEnemigos);
let panelGameOver = document.querySelector('#imagenGameOver');
let btnIniciarJuegofacil = document.querySelector('#iniciarJuegoFacil');
// Booleans para controlar el nivel:
let nivelFacil = false;
let disparosZ1 = 0;let disparosZ2 = 0;let disparosZ3 = 0;let disparosZ4 = 0;let disparosZ5 = 0;
let clickZ1 = false;
let clickZ2 = false;
let clickZ3 = false;
let clickZ4 = false;
let clickZ5 = false;
let contadorBalas = 50;
let tiempoFinalHuida = 5;
let intervaloFinal;
// per quan perden una partida:
let botonReintentar = document.querySelector('#reintentar');
let datosFinales = document.querySelector('#datosFinales');
let puntuacionFinalHTML = document.querySelector('#puntuacionHTML');
let botonGuardar = document.querySelector('#guardarPartida');
// poder veure el tutorial de la partida
let verTutorial = document.querySelector('#verTutorial');
// boolean per finalitzar joc,per controlar no mostrar mateix bitxo dos vegades,puntuació i variable per emmagatzemar index random de bitxo que surt
let numeroRandom;
let juegoPerdido = false;
let ultimoIndiceMostrado = -1;
let puntuacionBase = 10000;

// para cronometro
let tiempo = new Date();
// establecemos en un minuto:
tiempo.setHours(0,1,0,0);
let cronometroHTML = document.querySelector('#cronometro');
// establecemos el contenido del html del cronometro:
cronometroHTML.innerHTML = '00:01:00';
// emmagatzemem valors a les variables que emprarem per fer compte enrere
let minutos = tiempo.getMinutes();
let segundos = tiempo.getSeconds();
let tiempoFinal = [];
// AGAFEM ELS JUGADORS AMB LA FUNCIÓ QUE ENS PASA L'ALTRE SCRIPT
let jugadorConectado = cargarJugadores();
// para sobreescribir la partida si un jugador que ya tiene una guardada le da de nuevo a nueva partida:
let guardaJuego = false;
// per la puntuació final que guardarem:
let puntuacionFinal = 0;
// per guardar les partides
let arrayPartidas = [];
let enemigoActual = '';
let activaCronoFinal = 0;
// per mostrar i ocultar el videotutorial i les regles
let clickTutorial = 0;

// Perque es posin las balas que hi han només obrir el joc:
document.querySelector('#tituloPistola').textContent = contadorBalas;

function infoJugadorActual() {

    jugadorConectado.forEach((jugador) => {

        if (parseInt(jugador.conectado) === 1 && guardaJuego === true){

            arrayPartidas = jugador.partidaGuardada;

            puntuacionFinal = calculoPuntuacion();

            // Creem nou registre de la partida que es vol guardar
            let nuevoGuardado = {
                juego: 'Escape Zombies',
                pantalla: 3,
                puntuacion: puntuacionFinal,
                idJuego: 3,
                nivel3Superado: true,
                tiempoRestante : tiempoFinal
            };

            //si la partida ja existeix actualitzem les seves dades,
            // per si el jugador vol millorar la puntuació
            let partidaEncontrada = false; 
            for (let i = 0; i < arrayPartidas.length; i++) {
                let partida = arrayPartidas[i];
                if (parseInt(partida.idJuego) === nuevoGuardado.idJuego && parseInt(partida.pantalla) === nuevoGuardado.pantalla
                && partida.juego === 'Escape Zombies') {
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

// portar la informació del jugador conectat per poder guardar després:
infoJugadorActual();

guardarPartida.addEventListener('click', function(){
        guardaJuego = true;
        almacenarTiempo();
        infoJugadorActual();
        guardarPartida.style.display = 'none';
        document.querySelector('#video').style.display = 'block';
        document.querySelector('#frase').style.display = 'block';
});

function mostrarEnemigoAleatorio() {

    // ocultar totes les imatges dels enemics menys el que surt triat:
    arrayEnemigos.forEach(enemigo => {
        enemigo.style.display = 'none';
    });
    // reiniciem els booleans a cada canvi d'enemic per poder rastrejar be quan es clicka al terreny de joc i quan a cada enemic:
    clickZ1 = false;
    clickZ2 = false;
    clickZ3 = false;
    clickZ4 = false;
    clickZ5 = false;

    // loopeamos mientras se repita el nuevo numero genereado, para que no salga dos veces el mismo enemigo de seguido
    do {
            numeroRandom = Math.floor(Math.random() * arrayEnemigos.length);

    } while (numeroRandom === ultimoIndiceMostrado  && arrayEnemigos.length > 1);

    // Quan només ens quedi un enemic sortim correns cap a la azotea, on
    // ens espera l'helicopter, ocultem tot el terreny de joc i mostrem el pasadís per on correm:
    if(arrayEnemigos.length === 1){
        document.querySelector('#cronometro').style.display = 'none';
        document.querySelector('#terrenoDeJuego').style.display = 'none';
        document.querySelector('#pistola').style.display = 'none';
        document.querySelector('#corre').style.display = 'block';
        document.querySelector('#huidaFinal').style.display = 'flex';
        document.querySelector('#corre').style.display = 'block';
        document.querySelector('#corre2').style.display = 'none';

        setTimeout(function(){
            document.querySelector('#corre').style.display = 'none';
            document.querySelector('#corre2').style.display = 'block';
        },2000);
    }

    // Actualizamos el último índice mostrado para evitar repeticiones
    ultimoIndiceMostrado = numeroRandom;

    if(arrayEnemigos.length > 1){
            //mostra enemic
    arrayEnemigos[numeroRandom].style.display = 'block';

    enemigoActual = arrayEnemigos[numeroRandom]; 
    
    // calcular posicion random y asignar en la pantalla:
    // Ancho del terreno menos el ancho de la imagen
    let limiteAncho = document.querySelector('#terrenoDeJuego').offsetWidth - 150; 
    // Alto del terreno menos el alto de la imagen
    let limiteAlto = document.querySelector('#terrenoDeJuego').offsetHeight - 150; 
    // asignacion de posicion de manera random en funcion del calculo anterior para que no se salga del area perimetrada
    let posX = Math.floor(Math.random() * limiteAncho);
    let posY = Math.floor(Math.random() * limiteAlto);

    // asignar la posicion generada al enemigo
    enemigoActual.style.position = 'relative';
    enemigoActual.style.top = posY + 'px'; 
    enemigoActual.style.left = posX + 'px'; 
    }
}

// funció per cridar temps aleatori que vagi surtint cada enemic
function llamarFuncionPeriodica() {

    btnIniciarJuegofacil.style.display = 'none';

    // llamada a funcion que va sacando random los enemigos:
    mostrarEnemigoAleatorio();
    
    // mentre el length de l'array d'enemics sigui més gran que un continuem
    // cridant a la funció:
    if(arrayEnemigos.length > 1){
        
            tiempoAleatorio = 1;
            setTimeout(llamarFuncionPeriodica, tiempoAleatorio * 700);
    }else{
        document.querySelector('#terrenoDeJuego').style.display = 'none';
        document.querySelector('#recursosSalud').style.display = 'none';
        document.querySelector('#pistola').style.display = 'none';
    }
}

function cuentaAtras() {
     
    if (minutos > 0 || segundos > 0) {

        if (minutos > 0 && segundos === 0) {
            minutos -= 1;
            segundos = 59;
        } else if(minutos === 0 && segundos > 0){

            segundos -= 1;
        }
        // condicionals per mostrar format correcte la info per l'html
        let minutosStr = minutos < 10 ? '0' + minutos : minutos;
        let segundosStr = segundos < 10 ? '0' + segundos : segundos;

        cronometroHTML.innerHTML = '00:' + minutosStr + ':' + segundosStr;

        // condició perque es pari quan només ens quedi un enemic:
        if(arrayEnemigos.length > 1 && juegoPerdido === false){
        // Llamada recursiva después de 1000 ms (1 segundo)
        setTimeout(cuentaAtras, 1000);
        }

        // si el temps arriba a cero llavors perden:
    } else {
         // damos visibilidad al cartel de gameOver
         gameOver();
    }
}

//  coger puntuacion final que irá en función del tiempo,y la municion empleada
function calculoPuntuacion(){
        
        if(contadorBalas >= 25){
            puntuacionBase = puntuacionBase + 10000;
        }else if(contadorBalas >=20 && contadorBalas < 25){
            puntuacionBase = puntuacionBase + 5000;
        }
        
        if(segundos > 40){
            puntuacionBase = puntuacionBase + 5000;
        }   
        return puntuacionBase;
    }

    function almacenarTiempo() {
    tiempoFinal = [minutos, segundos];
}
//EVENT LISTENERS PARA LOS ENEMIGOS
zombie1.addEventListener('click',function(){
    // manejo mediante el boolean de cuando pican en las imagenes de enemigos y cuando en el terreno de juego
    //sino al estar incluidas las imagenes dentro del terreno de juego me lo contaba mal
     clickZ1 = true;
     clickZ2 = false;clickZ3 = false;clickZ4 = false;clickZ5 = false;

    disparosZ1++;
    // restamos a cada disparo
    if(contadorBalas > 0){
        contadorBalas--;
    }
    // actualizacion del display por html de cuantas balas nos quedan:
    document.querySelector('#tituloPistola').textContent = contadorBalas;
    // comprobamos si ya se ha picado cinco veces almenos en el mismo enemigo para eliminarlo y que no salga mas
    if(enemigoActual.getAttribute('id') === 'zombie1' && disparosZ1>=5){
        enemigoActual.classList.remove('borderZombiesVivos');
        let enemigoAEliminar = arrayEnemigos.indexOf(enemigoActual);
        let enemigoEliminado = arrayEnemigos.splice(enemigoAEliminar,1);
        enemigoActual.style.display = 'none';
    }
});
zombie2.addEventListener('click',function(){

    clickZ2 = true;
     clickZ1 = false;clickZ3 = false;clickZ4 = false;clickZ5 = false;
    disparosZ2++;
    if(contadorBalas > 0){
        contadorBalas--;
    }
    document.querySelector('#tituloPistola').textContent = contadorBalas;

    if(enemigoActual.getAttribute('id') === 'zombie2' && disparosZ2>=5){
        enemigoActual.classList.remove('borderZombiesVivos');
        let enemigoAEliminar = arrayEnemigos.indexOf(enemigoActual);
        arrayEnemigos.splice(enemigoAEliminar,1);
        enemigoActual.style.display = 'none';
    }
});
zombie3.addEventListener('click',function(){
    clickZ3 = true;
     clickZ2 = false;clickZ1 = false;clickZ4 = false;clickZ5 = false;
    disparosZ3++;
    if(contadorBalas > 0){
        contadorBalas--;
    }
    document.querySelector('#tituloPistola').textContent = contadorBalas;

    if(enemigoActual.getAttribute('id') === 'zombie3' && disparosZ3>=5){
        enemigoActual.classList.remove('borderZombiesVivos');
        let enemigoAEliminar = arrayEnemigos.indexOf(enemigoActual);
        arrayEnemigos.splice(enemigoAEliminar,1);
        enemigoActual.style.display = 'none';
    }
});
zombie4.addEventListener('click',function(){
    clickZ4 = true;
     clickZ2 = false;clickZ3 = false;clickZ1 = false;clickZ5 = false;
    disparosZ4++;
    if(contadorBalas > 0){
        contadorBalas--;
    }
    document.querySelector('#tituloPistola').textContent = contadorBalas;

    if(enemigoActual.getAttribute('id') === 'zombie4' && disparosZ4>=5){
        enemigoActual.classList.remove('borderZombiesVivos');
        let enemigoAEliminar = arrayEnemigos.indexOf(enemigoActual);
        arrayEnemigos.splice(enemigoAEliminar,1);
        enemigoActual.style.display = 'none';
    }
});
zombie5.addEventListener('click',function(){
    clickZ5 = true;
     clickZ2 = false;clickZ3 = false;clickZ4 = false;clickZ1 = false;
    disparosZ5++;
    if(contadorBalas > 0){
        contadorBalas--;
    }
    document.querySelector('#tituloPistola').textContent = contadorBalas;

    if(enemigoActual.getAttribute('id') === 'zombie5' && disparosZ5>=5){
        enemigoActual.classList.remove('borderZombiesVivos');
        let enemigoAEliminar = arrayEnemigos.indexOf(enemigoActual);
        arrayEnemigos.splice(enemigoAEliminar,1);
        enemigoActual.style.display = 'none';
    }
});
// per ultima part de la prova nivell 3, sino es supera es game over:
flechaHuida.addEventListener('click',function(){

    document.querySelector('#corre2').textContent = 'CORRE!!!';

    setTimeout(function(){
        document.querySelector('#corre2').style.display = 'none';    
    },2000);
    // a cada click en la flecha aumentamos la barra de huida para poder escapar:
    aumentarCorrerPorcentaje();
    // al primer click activamos el crono de cinco segundos para escapar:
    activaCronoFinal++;

    if(activaCronoFinal === 1){
        tiempoDeHuida();
    }
});
// per veure i deixar de veure tant el tutorial com les regles del joc:
verTutorial.addEventListener('click', function(){

    clickTutorial++;

    if(clickTutorial === 1){

        verTutorial.textContent = 'Ocultar tutorial y reglas';
        document.querySelector('#tutorialReglas').style.display = 'flex';
        document.querySelector('#video2').style.display = 'block';

    }else if(clickTutorial === 2){
        verTutorial.textContent = 'Ver Tutorial y reglas';
        document.querySelector('#tutorialReglas').style.display = 'none';
        document.querySelector('#video2').style.display = 'none';
        clickTutorial = 0;
    }
});

function tiempoDeHuida(){
         // Possem un conte regresiu de només cinc segons:
    // comptador simplificat 
    intervaloFinal = setInterval(function(){

        tiempoFinalHuida --;
        document.querySelector('#cronoFinal').style.display = 'block';
        document.querySelector('#cronoFinal').textContent = 'Te quedan ' + tiempoFinalHuida + ' segundos para lograrlo';
        // si el temps arriba a cero serà game over i s'haura de repetir tota la prova:
        if(tiempoFinalHuida === 0){
            document.querySelector('#huidaFinal').style.display = 'none';
            clearInterval(intervaloFinal);
            gameOver();
        }
    },1000);
    // interval d'un segon, per finalitzar els cinc
}

// al pulsar el boton de start se llama a la función que inicia el juego
btnIniciarJuegofacil.addEventListener('click', function(){
    nivelFacil = true;
    btnIniciarJuegofacil.style.display = 'none';
    verTutorial.style.display = 'none';
    document.querySelector('#terrenoDeJuego').style.display = 'block';
    llamarFuncionPeriodica();
    cuentaAtras();
});

botonReintentar.addEventListener('click', function(){
        // reiniciem pàgina per tornar a jugar
        location.reload();
});

// Peer el terreny de joc, si es pica dins el terreny de joc disminuim vida
// tb resta balas
document.querySelector('#terrenoDeJuego').addEventListener('click',function(){
    if(!clickZ1 &&
        !clickZ2 && !clickZ3 && !clickZ4 && !clickZ5){
            // per anar disminuint la barra de vida: 
            disminuirVidaEnPorcentaje();
            if(contadorBalas>0){
                contadorBalas--;
            }
            document.querySelector('#tituloPistola').textContent = contadorBalas;
        }
});

// Función para disminuir la barra de vida en 10%
function disminuirVidaEnPorcentaje() {
    // Obtener el elemento de la barra de vida
    let barraVida = document.querySelector('#vida');

    // Obtener el valor actual de la barra de vida
    let valorActual = barraVida.value;
    
    // calculem en percentateg de 10% per anar baixant la barra de vida 
    let nuevoValor = valorActual - (barraVida.max * 0.1);
    // asegurarnos de que el nou valor no sigui menor que el valor minim, que es cero
    nuevoValor = Math.max(0, nuevoValor);
    // assignar nou valor a la barra de vida
    barraVida.value = nuevoValor;
    
    // Actualizar el porcentaje mostrado
    let porcentaje = (nuevoValor / barraVida.max) * 100;
    let porcentajeTexto = porcentaje.toFixed(2) + '%';
    document.querySelector('#textoVida').textContent = porcentajeTexto;
    // si el nou valor ja ha arribat a 0 llavors es queda el personantje mort
    if (nuevoValor === 0) {
        gameOver();
        minutos = 0;
        segundos = 0;
    }
}

function aumentarCorrerPorcentaje() {
    // Obtener el elemento de la barra de huida
    let barraHuida = document.querySelector('#huida');
    
    // Obtener el valor actual de la barra de huida
    let valorActual = barraHuida.value;
    
    // anem sumamnt de 10% cada cop que es premi la flecha, anem aumentant
    let nuevoValor = valorActual + (barraHuida.max * 0.1);
    
    // asegurarnos de que el nou valor no sigui menor que el valor maxim, que es cen
    nuevoValor = Math.min(100, nuevoValor);
    
    //asignem nou valor a la barra de huida
    barraHuida.value = nuevoValor;
    
    // Actualizar el porcentaje mostrado
    let porcentaje = (nuevoValor / barraHuida.max) * 100;
    let porcentajeTexto = porcentaje.toFixed(2) + '%';
    document.querySelector('#textoHuida').textContent = porcentajeTexto;

    // si arriba a 100, completada la barra de la huida sobrantli segons llavors guanya:
    if(porcentaje === 100 && tiempoFinalHuida > 0){

        document.querySelector('#huidaFinal').style.display = 'none';
        clearInterval(intervaloFinal);
        document.querySelector('#cronoFinal').style.display = 'none';
        guardarPartida.style.display = 'block';
    }
}

function gameOver(){
    
    document.querySelector('#gameOverTitulo').style.display = 'block';
    document.querySelector('#imagenGameOver').style.display = 'block';
    document.querySelector('#terrenoDeJuego').style.display = 'none';
    document.querySelector('#recursosSalud').style.display = 'none';
    document.querySelector('#pistola').style.display = 'none';
    botonReintentar.style.display = 'block';
}






