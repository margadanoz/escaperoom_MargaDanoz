// div para sacar la lista de usuarios:
let visualizacionUsuarios = document.querySelector('#visualizacionUsuarios');
// botó per guardar canvis
let botonGuardar = document.querySelector('#botonGuardar');
let botonEliminar = document.querySelector('#botonEliminar');

// missatges d'error:
const smallError = document.querySelector('#errorPwds');
const smallCamposVacios = document.querySelector('#camposVacios');
const smallRolesVacios = document.querySelector('#rolesVacios');
const smallConfirmMayoriEdad = document.querySelector('#confirmMayoriaEdad');
const smallNombreUnico = document.querySelector('#nombreUnico');

// array per emmagatzemar jugadorsprovinents del localStorage:
let arrayJugadores = [];
// array per emmagatzemar noms existents per si l'haguessim de canviar:
let nombresExistentes = [];
// per comprovar les dades que ens venen del form:
let datosIncorrectos = false;
// jugador que anem a editar:
let nombreAntiguo = " ";

// aquí sacaremos a los usuarios de localStorage en cuanto cargue la página llamando a la función:
function cargarListaJugadores() {

    let datosUsuarios = localStorage.getItem("jugadores");

    arrayJugadores = JSON.parse(datosUsuarios);

    arrayJugadores.forEach(jugador => {

        let nombreACambiar = jugador.nomJugador;
        let pwd = jugador.password;
        let rolJugador = jugador.rol;
        let mayorDeEdad = jugador.adulto;
        let idUsuario = jugador.id;

        // Sacar por el div que muestra la lista de usuarios todos los que nos vienen del localStorage
        // funcion onclick para pasarle directamente al form los parámetros del jugador seleccionado:
        visualizacionUsuarios.innerHTML += 
            `Nombre del jugador: <strong>${nombreACambiar}</strong>
            Password: <strong>${pwd}</strong>
            Rol del jugador: <strong>${rolJugador}</strong>
            Mayor de edad: <strong>${mayorDeEdad}</strong>
            Id del usuario: <strong>${idUsuario}</strong>
            <button id='editarBoton' onclick="mostrarInfoAEditar('${nombreACambiar}', '${pwd}', '${rolJugador}',${mayorDeEdad},${idUsuario})">Editar</button></br>
            <hr></br>`;

        // Emmagatzemem noms existents d'usuaris per si de cas:
        nombresExistentes.push(jugador.nomJugador);
    });
}

function mostrarInfoAEditar(nombreACambiar, pwd, rolJugador,mayorDeEdad,idUsuario) {

    nombreAntiguo = nombreACambiar;

    if (rolJugador === 'administrador') {
        document.querySelector('#admin').checked = true;
        document.querySelector('#usuario').checked = false;

    } else {
        document.querySelector('#admin').checked = false;
        document.querySelector('#usuario').checked = true;
    }

    if (mayorDeEdad === true) {
        document.querySelector('#mayor').checked = true;
        document.querySelector('#menor').checked = false;
    }else{
        document.querySelector('#mayor').checked = false;
        document.querySelector('#menor').checked = true;
    }

    document.querySelector('#nomUsuario').value = nombreACambiar;
    document.querySelector('#pwd1').value = pwd;
    document.querySelector('#idUsuario').value = idUsuario;
}

botonEliminar.addEventListener('click', function () {

    let idUsuario = document.querySelector('#idUsuario').value;
    let index = arrayJugadores.findIndex(jugador => jugador.id === parseInt(idUsuario));

        // quitamos al jugador cuyo id coincide en el array del localStorage
        let jugadorEliminado = arrayJugadores.splice(index, 1);
        let estadoConexion = parseInt(jugadorEliminado[0].conectado);
        
        // Por si se eliminara el propio admin, salir de la página
        if (estadoConexion === 1 && jugadorEliminado[0].rol === 'administrador') {
            console.log("Hola patata");
            window.location.href = "../index.html";

        } else {
            //recargamos página para forzar actualizar visualmente los datos
            location.reload();
        }

        // Guardamos
        localStorage.setItem("jugadores", JSON.stringify(arrayJugadores));
    
});


botonGuardar.addEventListener('click',function(e){

    e.preventDefault();

    // obtenim valors actuals del form, i comprovem abans d'enviar a guardar
    // si tot està bé
        let nombreJugador = document.querySelector('#nomUsuario').value;
        let pwd1 = document.querySelector('#pwd1').value;
        let pwd2 = document.querySelector('#pwd2').value;
        let botonAdmin = document.querySelector('#admin');
        let botonUsuario = document.querySelector('#usuario');
        let menorDeEdad = document.querySelector('#menor');
        let mayorDeEdad = document.querySelector('#mayor');
        let idUsuario = document.querySelector('#idUsuario').value;
        let rolJugador = " ";
        let esMayorDeEdad = false;
        nombreJugador = nombreJugador.trim();
        pwd1 = pwd1.trim();
        pwd2 = pwd2.trim();
        idUsuario.trim();

        // verificació de que esta triat un rol:
            if(!botonAdmin.checked && !botonUsuario.checked){

                smallRolesVacios.style.display = 'block';
                datosIncorrectos = true;

                setTimeout(function(){

                    smallRolesVacios.style.display = 'none';
        
                },1000);
            }else{

                // comprovem quin tipus d'usuari és
                if(botonAdmin.checked){
                        
                    rolJugador = 'administrador';

                }else if(botonUsuario.checked){
                    
                    rolJugador = 'usuario';
                } 
            }

            // verificació de que s'ha informat de l'edat
            if(!menorDeEdad.checked && !mayorDeEdad.checked){

                smallConfirmMayoriEdad.style.display = 'block';
                datosIncorrectos = true;

                setTimeout(function(){

                    smallConfirmMayoriEdad.style.display = 'none';
        
                },1000);

            }else{
                // comprovem si és o no major d'edat
                if(menorDeEdad.checked){

                    esMayorDeEdad = false;
                }else if(mayorDeEdad.checked){

                    esMayorDeEdad = true;
                }
            }

            // comprovem que no es deixi camps buits als inputs:
            if(nomUsuario.length === 0 || pwd1.length === 0 || pwd2.length === 0){

                smallCamposVacios.style.display = 'block';
                datosIncorrectos = true;

                setTimeout(function(){

                    smallCamposVacios.style.display = 'none';
        
                },1000);
            }

            // si las contraseñas no coinciden lanzamos mensaje de error:
            if(pwd1.trim() !== pwd2.trim()){
                
                smallError.style.display = 'block';
                contraseñaValida = false;
                datosIncorrectos = true;

                setTimeout(function(){

                    smallError.style.display = 'none';
        
                },1000);

            }else{

                contraseñaValida = true;
            }

            if(nombresExistentes){

                for(let i = 0; i < nombresExistentes.length;i++){
                    
                    // si el nom que hem canvuiat està present a l'array de noms
                    // dels jugadors existents, pero no es el mateix que el del jugador
                    // que estem editant, es qwue l'ha repetit, cosa que no es permet
                    if(nombreJugador === nombresExistentes[i] && nombreJugador !== nombreAntiguo){

                        console.log("Entra aqui,en nombre a cambiar");
        
                        smallNombreUnico.style.display = 'block';
                        // location.reload();
                        datosIncorrectos = true;
        
                        // per resetejar i que conti el nou nom, sino s'hem quedaba atrapat en el vell
                        // i donaba error en considerarlo diferent tot i ser el mateix
                        setTimeout(function(){
        
                            location.reload();
                        },1200);
                    }
                }
            }

            // cerquem posició de l'objecte que volem actualitzar a l'array
            // on els haviem guardat tots:
            let index = arrayJugadores.findIndex(jugador => jugador.id === parseInt(idUsuario));

            // si entrem per aqui a aquestes alçades vol dir 
            // que totes les dades són correctes i cridem a la funció que guarda la info
            // al localStorage:
            if(!datosIncorrectos){

                // actualitzem les dades del jugador a la posició correcta
                // que ocupaba
                let nuevoJugador = {

                                nomJugador : nombreJugador,
                                password : pwd1,
                                rol : rolJugador,
                                adulto : esMayorDeEdad,
                                conectado : 1
                            }

                    // Limpiamos valores de los campos:
                    document.querySelector('#nomUsuario').value = " ";
                    document.querySelector('#pwd1').value = " ";
                    document.querySelector('#pwd2').value = " ";
                    document.querySelector('#idUsuario').value = " ";
                    document.querySelector('#admin').checked = false;
                    document.querySelector('#usuario').checked = false;
                    document.querySelector('#mayor').checked = false;
                    document.querySelector('#menor').checked = false;

                    // guardem jugador actualitzat al localStorage:
                    guardarInfoLocalStorage(nuevoJugador,index);
                }
});

function guardarInfoLocalStorage(nuevoJugador, index) {

    //Creamos array para comparar los valores que ya tenemos almacenados
    // con los que vamos a modificar
    let jugadorExistente = arrayJugadores[index];

    //actualizamos solo los campos que han sido actualizados
    jugadorExistente.nomJugador = nuevoJugador.nomJugador || jugadorExistente.nomJugador;
    jugadorExistente.password = nuevoJugador.password || jugadorExistente.password;
    jugadorExistente.rol = nuevoJugador.rol || jugadorExistente.rol;
    jugadorExistente.adulto = nuevoJugador.adulto || jugadorExistente.adulto;
    jugadorExistente.id = nuevoJugador.id || jugadorExistente.id;
    jugadorExistente.partidaGuardada = nuevoJugador.partidaGuardada || jugadorExistente.partidaGuardada;

    //actualizamos la posición en el localStorage con la informacion asignada, 
    // esto mantiene la que no hemos modificado en este script como id y partidaGuardada, 
    // sino desaparecerian
    arrayJugadores[index] = jugadorExistente;

    // guardamos en localStorage
    localStorage.setItem("jugadores", JSON.stringify(arrayJugadores));

    location.reload();
}

cargarListaJugadores();

    


