let inputNom = document.querySelector('#nombreUnico');
let pwd1 = document.querySelector('#pwd1');
let pwd2 = document.querySelector('#pwd2');
let botonGuardar = document.querySelector('#botonGuardar');
const smallError = document.querySelector('#errorPwds');
const smallCamposVacios = document.querySelector('#camposVacios');
const smallNombreUnico = document.querySelector('#nombreUnico');
// array per emmagatzemar info que ve del local
let usuarioInfo = [];
// per guardar nom actual del jugador, per si s'el vol deixar:
let nomActual = '';

// array per portarnos els noms existents, per si s'el volguès canviar:
let nombresExistentes = [];
// boolean de control para ver si enviamos la nuevo info a guardar o no:
let infoValida = true;
// para coger el id
let idUsuario;
// array per emmagatzemar info del jugador a eliminar:
let arrayJugadores = [];

// En quant carregui la pàgina llegim del localStorage per mostrar info a 
// l'usuari sobre el seu compte:
// queda pendent per futur en implementació del joc llegir puntuacions
// de jocs jugats:
function traerInfoDelLocalStorage(){

    const datosdatosJugador = localStorage.getItem("jugadores");
    usuarioInfo = JSON.parse(datosdatosJugador);

    //mirem x conectado, i portem la info corresponent:  
    usuarioInfo.forEach(usuario =>{

        if(usuario.conectado === 1){
            // emmagatzemem per si el volgués mantenir i només volgués canvuar pwd
            nomActual = usuario.nomJugador;
            document.querySelector('#nomActual').textContent = usuario.nomJugador;
            document.querySelector('#pwdActual').textContent = usuario.password;
            idUsuario = usuario.id;
            arrayJugadores.push(usuario);
            console.log(arrayJugadores);
        }
        //Aprovechamos loop para sacar todos los nombres por si se lo quisiera cambiar
        // respetar el tema de que no se pueden repetir los nombres de usuario
        nombresExistentes.push(usuario.nomJugador);

        if(usuario.conectado && usuario.rol === 'administrador'){
            document.querySelector('.enlaceVerUsuarios').style.display = 'inline';
        }
    });
}

traerInfoDelLocalStorage();

// event per guardar al localStorage en cas que es modifiqui la info dels camps
botonGuardar.addEventListener('click', function(e){

    e.preventDefault();

    // obtenim valors introduïts, que seràn se suposa nous
    let inputNom = document.querySelector('#nomUsuario').value;
    let pwd1 = document.querySelector('#pwd1').value;
    let pwd2 = document.querySelector('#pwd2').value;

    inputNom = inputNom.trim();
    pwd1 = pwd1.trim();
    pwd2 = pwd2.trim();

    // Comprovem que no s'hagi deixat cap camp buit, i si ho ha fet informem:
    if(inputNom.length === 0 || pwd1.length === 0 || pwd2.length === 0){

            smallCamposVacios.style.display = 'block';

            setTimeout(function(){
                smallCamposVacios.style.display = 'none';  
                document.querySelector('#nomUsuario').value = " ";
                document.querySelector('#pwd1').value = " ";
                document.querySelector('#pwd2').value = " ";

            },700);

            infoValida = false;
    }else{

        // cerquem index que coincideixi amb el del jugador a 
        // si tot té info primer de tot comprovem que no hi hagi cap usuari
        // ja registrat amb el mateix nom que ens estàn introduïnt
        for(let i = 0; i < nombresExistentes.length;i++){

            if(inputNom === nombresExistentes[i] && nomActual !== nombresExistentes[i]){

                infoValida = false;

                smallNombreUnico.style.display = 'block';

                setTimeout(function(){

                    smallNombreUnico.style.display = 'none';
                    document.querySelector('#nomUsuario').value = " ";
                    document.querySelector('#pwd1').value = " ";
                    document.querySelector('#pwd2').value = " ";
                },700);
                
            }
        }
        // Si quan arribem aquí el condicional es true vol dir que tot està ok
        // per enviar la info al localStorage:
        if(infoValida){

                guardarCambiosUsuario(inputNom,pwd1);
        }
    }
});

// Funció per guadrar canvis a localStorage:
function guardarCambiosUsuario(inputNom,pwd1){

    // Traer datos del jugador para setearlos:
    const datosJugador = localStorage.getItem("jugadores");

    let jugador = JSON.parse(datosJugador);

    // Trovem jugador i canviem la info vella per la nova:
    jugador.forEach((usuario,index )=>{

        if(usuario.conectado === 1){

                jugador[index].nomJugador = inputNom;
                jugador[index].password = pwd1;

                console.log('nom del jugador',jugador[index].nomJugador);

                // actualitzem info del localStorage:
                localStorage.setItem("jugadores",JSON.stringify(jugador));
        }
    });
    // Netejem camps quan acabem:
    document.querySelector('#nomUsuario').value = " ";
    document.querySelector('#pwd1').value = " ";
    document.querySelector('#pwd2').value = " ";

    location.reload();
}

// PER SI L'USUARI ES VOL ELIMINAR EL PERFIL
botonEliminar.addEventListener('click', function () {
    
    let jugadores = JSON.parse(localStorage.getItem("jugadores"));

    //Trobar index del jugador a eliminar:
    let index = jugadores.findIndex(jugador => jugador.id === idUsuario);

        // Eliminamos al jugador del array
        jugadores.splice(index, 1);
        localStorage.setItem("jugadores", JSON.stringify(jugadores));

        // Redirigim l'usuario
        window.location.href = "../index.html";
    
});





