(function(){

    /*En principio busque un enfoque por trabajar Vanilla JavaScript unicamente, pero despues explote el uso 
    de todos los frameworks que se mantienen en el proyecto, enfatizandome en el uso de la libreria JQuery */

    'use strict';
    
    //Variables globales
    /*esta sección contempla todas las variables comunes que use durante el desarrollo del codigo */

    const baseUrl = 'https://swapi.dev/api/';
    const allCharacters = 'https://swapi.dev/api/people/?page=';

    // Variables respecto objetos del DOM
    const nameCharacter = document.querySelector('#nameCharacter');
    const buttonName = document.querySelector('#buttonName');
    const name = document.querySelector('#name');
    const mass = document.querySelector('#mass');
    const height = document.querySelector('#height');
    const homeworld = document.querySelector('#homeworld');

    //Eventos de los objetos
    /*En esta parte del codigo se agrupan todos los eventos con los que tiene interacción el usuario */

    // Este evento prepara el DataTable con todos los controles definidos, asi mismo llama una función
    // para traer a todos los personajes
    document.addEventListener('DOMContentLoaded', ()=>{
        $('#example').DataTable({
            'paging': true,
            'pageLength' : 10,
            'lengthChange' : true,
            'searching': true,
            'ordering' : true,
            'info' : true,
            'autoWidth' : false,
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
        });

        getAllUsers();

    })

    // Click para la busqueda de un personaje usando un string como identificador de su nombre
    buttonName.addEventListener('click',()=>{
        if(nameCharacter.value == '' || nameCharacter.value == ' '){
            Swal.fire(
                'No ingresaste nada',
                'Intenta escribir algo adecuado para buscar',
                'question'
            )
        } else
            getUser(nameCharacter.value);
    });

    // Click para la busqueda bajo un parametros de ordenamiento
    name.addEventListener('click',()=>{
        getByOrder('name');
    });
    mass.addEventListener('click',()=>{
        getByOrder('mass');
    });
    height.addEventListener('click',()=>{
        getByOrder('height');
    });
    homeworld.addEventListener('click',()=>{
        getByOrder('homeworld');
    });

    // Esta función llama a el listado original de 50 personajes 

    allPeople.addEventListener('click', e =>{
        e.preventDefault();
        getAllUsers();
    })

    // Funciones elementales del sitio
    // Funcion que extrae un solo usuario explotando la URL
    function getUser(name){
        fetch(`${baseUrl}people?search=${name}`)
        .then(data => data.json())
        .then(user => {
            tableClear();
            if(user.results.length === 0){
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops, sin resultados con ese nombre',
                    text: '¿Por qué no intentas buscar algo diferente?'
                })
            } else {
                eatTable(user.results);
            }
        })
    }

    // Función que añade los 50 personajes de la API
    
    function getAllUsers(){
        for(var i = 1; i<=5; i++){
            fetch(`${allCharacters}${i}`)
            .then(data => data.json())
            .then(group => {
                tableClear();
                eatTable(group.results);
            })
        }
    }

    /* Funcion de endpoint con ordenamiento
        Algo interesante es que el parametro para ordenar no se encuentra disponible dentro de la API
        La documentación sugiera que podria ser la palabra "ordering" pero al aplicarla no existe un cambio
        como en el caso de search. En algun repositorio de GitHub se sugiere el uso de "sort" pero de igual modo
        no existe un cambio en la respuesta. */

    /*  En esta función se usura logica de programación para obtener un resultado adecuado, sin embargo, 
        la interfaz grafic con DataTable provee un soporte adecuado para el ordenamiento y clasificación. No resulto
        un distintivo o sesgo en los requerimientos estrictos del codigo.*/
    
    function getByOrder(typeOrder){
        for(var i = 1; i<=5; i++){
            // Insisto en remarcar que se ocuparon terminos como sort, order, ordering pero el REST no responde, sino
            // lo toma como una parametro mas de GET
            fetch(`${baseUrl}people?sort=${typeOrder}&page=${i}`)
            .then(data => data.json())
            .then(group => {
                tableClear();
                eatTable(group.results);
                var table = $('#example').DataTable();

                switch(typeOrder){
                    case 'name':
                        table.order( [ 0, 'asc' ] ).draw();
                        break;
                    case 'mass':
                        table.order( [ 1, 'asc' ] ).draw();
                        break;
                    case 'height':
                        table.order( [ 2, 'asc' ] ).draw();
                        break;
                    case 'homeworld':
                        table.order( [ 3, 'asc' ] ).draw();
                        break;
                    default:
                        table.order( [ 0, 'asc' ] ).draw();
                        break;
                }
            })
        }
    }

    // Hacemospetición y nos traemos el nombre original del planeta al que pertenece un personaje, puesto que
    // La API solo retornaba la ruta ligada al REST

    function whoPlanet(name){
        return fetch(name)
    }

    // LLenamos la tabla con todos los registros recaudados
    function eatTable(users){
        var table = $('#example').DataTable();
        users.forEach(element => {

            // Extraemos el planeta adecuado e insertamos todo lo recopilado al DOM
            whoPlanet(element.homeworld)
            .then(data => data.json())
            .then(planet => {
                table.row.add([element.name,
                    element.mass,
                    element.height,
                    planet.name]).draw(false);
            })
        });
    }

    //Utilidades del programa

    // Limpiar tabla de datos

    function tableClear(){
        var table = $('#example').DataTable();
        table.clear().draw();
    }

})();