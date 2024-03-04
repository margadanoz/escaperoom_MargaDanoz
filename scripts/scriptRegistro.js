// no podrá
// haber dos jugadores en la página con el mismo nombre:
const clavesLocalStorage = "";
// asignacion de id para identificarlos como primary key:
let idNuevoJugador = 0;
//per veure id's presents al localStorage i sapiguer quin hem de posar a continuació:
let idsExistentes = [];
// botons de radio
const botonAdmin = document.querySelector('#admin');
const botonUsuario = document.querySelector('#usuario');
const menorDeEdad = document.querySelector('#menor');
const mayorDeEdad = document.querySelector('#mayor');
// etiwuetas para mostrar errores en form
const smallError = document.querySelector('#errorPwds');
const smallCamposVacios = document.querySelector('#camposVacios');
const smallRolesVacios = document.querySelector('#rolesVacios');
const smallConfirmMayoriEdad = document.querySelector('#confirmMayoriaEdad');
const smallNombreUnico = document.querySelector('#nombreUnico');
// envio de formulario, boton
const botonSubmit = document.querySelector('#submitButton');
// boton logout, lo haremos visible una vez registrado, proque lo logeamos automáticamente:
const botonLogout = document.querySelector('#botonLogout');
// variables per emmagatzemar valors de usuari,rol i confirmar majoria d'edat
let esMayorDeEdad = false;
let contraseñaValida = false;
let datosIncorrectos = false;
let rolJugador;
let nombresExistentes = [];
// array de objetos para almacenar todas las características del usuario
let jugadores = [];

// event per comprovar validessa de camps i guardar posteriorment la ifno
botonSubmit.addEventListener('click',function(e){

    datosIncorrectos = false;
    // agafem valors del dom, dels inputs per comprovar
    const nomUsuario = document.querySelector('#nomUsuario').value;
    const pwd1 = document.querySelector('#pwd1').value;
    const pwd2 = document.querySelector('#pwd2').value;
    // evitar envio de form fins que no es confirmin que tots els camps
    // són correctes:
    e.preventDefault();

    // verificació de que esta triat un rol:
    if(!botonAdmin.checked && !botonUsuario.checked){

        smallRolesVacios.style.display = 'block';
        datosIncorrectos = true;
        setTimeout(function(){
            smallRolesVacios.style.display = 'none';
            document.querySelector('#nomUsuario').value = "";
            document.querySelector('#pwd1').value = "";
            document.querySelector('#pwd2').value = "";

        },800);

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
                document.querySelector('#nomUsuario').value = "";
                document.querySelector('#pwd1').value = "";
                document.querySelector('#pwd2').value = "";

            },800);
    }else{
        // comprovem si és o no major d'edat
        if(menorDeEdad.checked){

            esMayorDeEdad = false;
        }else if(mayorDeEdad.checked){

            esMayorDeEdad = true;
        }
    }
    // PER NOM UNIC
    // si existeixen jugadors al localStorage:
    if(nombresExistentes.length > 0){

        for(let i = 0; i < nombresExistentes.length;i++){

            if(nomUsuario === nombresExistentes[i]){

                smallNombreUnico.style.display = 'block';
                // location.reload();
                datosIncorrectos = true;

                setTimeout(function(){
                    smallNombreUnico.style.display = 'none';
                },800);
                //parem bucle si el nom ja existeix
                return;
            }
            // PER ID UNIC:
            // cuando lleguemos a la ultima posición del array
            // cogemos el valor del id y le sumamos 1:
            if(i === nombresExistentes.length-1){

                idNuevoJugador = idsExistentes[idsExistentes.length - 1];
                idNuevoJugador = idNuevoJugador + 1;
            }
        }
        // si aún no hay jugadores en el array asignaremos el id 1
    }else{
        idNuevoJugador = idNuevoJugador + 1;
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

    // si todo está correcto procedemos a guardar la información.
    // creamos objeto para guardar en localStorage y recuperar cuando logee:
    if(!datosIncorrectos){

        let nuevoJugador = {

                    nomJugador : nomUsuario,
                    password : pwd1,
                    rol : rolJugador,
                    adulto : esMayorDeEdad,
                    // será 1 para conectado, 0 para desconectado
                    // al registrarse lo conectamos automáticamente:
                    conectado : 1,
                    id : idNuevoJugador,
                    // será un array de objetos,donde se almacenará nombre dele scape y todo lo relativo para retomar la partida:
                    partidaGuardada : [{

                    }],
                }

        // Limpiamos valores de los campos:
        document.querySelector('#nomUsuario').value = " ";
        document.querySelector('#pwd1').value = " ";
        document.querySelector('#pwd2').value = " ";
        document.querySelector('#admin').checked = false;
        document.querySelector('#usuario').checked = false;
        document.querySelector('#mayor').checked = false;
        document.querySelector('#menor').checked = false;

        // Llamamos a la función que guarda la info en el localStorage:
        guardarInfoLocalStorage(nuevoJugador);
        // Para redigirigir a página de usuario, 
        // donde podrá editar el perfil:
        if(rolJugador === 'administrador'){

            window.location.href = "pagina_admin.html";

            // fem visible ja perque s'ha logejat automàticament amb el registre
            // el botó de logout
            botonLogout.style.display = 'block';
        }else if(rolJugador === 'usuario'){
            
            window.location.href = "pagina_usuario.html";
            botonLogout.style.display = 'block';
        }
    }
});


// para guardar la informacion de los nuevos jugadores registrados
// en el localStorage:
function guardarInfoLocalStorage(nuevoJugador){

        // cargamos info del localStorage:
        const jugadoresGuardados = localStorage.getItem("jugadores");
    
        // Si hay jugadores existentes, los cargamos y agregamos el nuevo jugador
        if(jugadoresGuardados){

            jugadores = JSON.parse(jugadoresGuardados);
        }      
        // metemos el nuevo jugador registrado:
        jugadores.push(nuevoJugador);   
        localStorage.setItem("jugadores", JSON.stringify(jugadores));

}

function leerInfoLocalStorage() {
    // solo podrá haber un jugador con el mismo nombre, para luego poder indentificarlos bien al buscarlos:
    const clavesLocalStorage = localStorage.getItem("jugadores");
    // si tenim info al localStorage fem JSON.parse
    // per agafar els noms:
    if(clavesLocalStorage){

        let jugadoresNombres = JSON.parse(clavesLocalStorage);
        // iterem la info
        jugadoresNombres.forEach(jugador => {
            // fiquem a l'array per compararho més endavant i que només pugui haverhi un amb el mateix nom:
            nombresExistentes.push(jugador.nomJugador);

            idsExistentes.push(jugador.id);
        });
    }
}

window.onload = function() {
    leerInfoLocalStorage();
};








