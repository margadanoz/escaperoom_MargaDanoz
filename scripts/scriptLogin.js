// Coge enlace y botón que vamos a tener que ocultar y que mostrar cuando
// la persona se logee:
const botonLogout = document.querySelector('.botonLogout');
const enlaceLogin = document.querySelector('.enlaceLogin');
// boton que disparará el evento cuando se envie form de login
const loginButton = document.querySelector('#loginButton');
// per frase d'error al contrastar dades, o no està registrat o 
// estàn malament les dades:
let smallNoHayDatos = document.querySelector('#smallNoHayDatos');
let smallCamposVacios = document.querySelector('#smallCamposVacios');

// comprovarem si les dades proporcionades les tenim 
// al nostre localStorage:
loginButton.addEventListener('click',function(e){

    // e.preventDefault();

    let nomUsuario = document.querySelector('#nomUsuario').value;
    let password = document.querySelector('#password').value;

    nomUsuario = nomUsuario.trim();
    password = password.trim();

    // si no han omplert nom d'usuari o password:
    if(nomUsuario.length === 0 || password.length === 0){

        smallCamposVacios.style.display = 'block';

        setTimeout(function(){

            smallCamposVacios.style.display = 'none';
            document.querySelector('#nomUsuario').value = " ";
            document.querySelector('#password').value = " ";
        },1000);

    }else{

        // contrastatem les dades que ens acaben d'entrar amb les que tenim
        //a localStorage:
        leerInfoLocalStorage(nomUsuario,password);
    }
});

// comparem dades entrades amb existents, recuperem objecte
// jugador adequat i redirigim:
function leerInfoLocalStorage(nomUsuario, password){

     // si està tot omplert cridem al localStorage
     const infoLocalJugadores = localStorage.getItem('jugadores');

     if(infoLocalJugadores){

         let datosJugadores = JSON.parse(infoLocalJugadores);

         for(let i = 0; i < datosJugadores.length;i++){

            // si hi han coincidencias guardem dades d'aquest
            // actualitzem camp del jugador on surt conectat:
            if(datosJugadores[i].nomJugador === nomUsuario && datosJugadores[i].password === password){
                    
                    // actualitzem el camp de conectat a 1 i guardem al localStorage aixo actualitzat:
                    if(datosJugadores[i].rol === 'administrador'){

                        datosJugadores[i].conectado = 1;
                        localStorage.setItem("jugadores", JSON.stringify(datosJugadores));
                        window.location.href="pagina_admin.html";

                    }else if(datosJugadores[i].rol === 'usuario'){

                        datosJugadores[i].conectado = 1;
                        localStorage.setItem("jugadores", JSON.stringify(datosJugadores));
                        window.location.href="pagina_usuario.html";
                    }

                    break;

            }else{

                // mostrem missatge de que no coincideixen les dades introduïdes amb les del localStorage
                smallNoHayDatos.style.display = 'block';

                // ocultem missatge i netejem camps:
                setTimeout(function(){

                    smallNoHayDatos.style.display = 'none';
                    document.querySelector('#nomUsuario').value = " ";
                    document.querySelector('#password').value = " ";

                },1000);
            }
         }
     }
}



