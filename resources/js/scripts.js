    //Toda la lógica va en esta carpeta! Sin las etiquetas scipts :-)

    // 1-'Escuchamos' el evento -> submit y lo pasamos x consola + un alert. Ponemos un FormData y lo guarda en la const form. 
    // 2-Luego el método del navegador insert...(q se guarda en la let que contiene al FormData -ver la let transactionObj ).
    //Luego le paso la function saveTransactionObject.
    // "Escuchamos" q el html haya sido compltetamete cargado y parseado (sin css ni subframe) El 1er param es el evento.


const form = document.getElementById("transactionForm");


form.addEventListener("submit", function(event){
    event.preventDefault(); 
    let transactionFormData = new FormData(form);
    //(abajo)creo una let que tendrá la función para convertir al FormData en Objeto
    let transactionObj = convertFormDataToTransactionObj(transactionFormData)   
    //guardamos nuestra transaccion en el localStorage.
    saveTransactionObj(transactionObj)
    //con este la insertamos en una tabla.
    insertRowInTransactionTable(transactionObj) //cambiamos en transactionFormData por el transacctionObj (así trabajamos con el objeto clave:valor).
    //agregamos reset para que al finalizar lo de arriba y guardar, 
    //deje los casilleron en blanco. Al clickear en "Añadir". Resetear es volver al estado inicial.           
    //Abajo, aplicamos un reset (volver al estado inicial-el ingreso está chequeado como estado inicial-) 
    //a los cuadros de texto input de la tabla, así al recargar la web no se
    //ve lo puesto al tocar el añadir.
    form.reset();
    })


    function drawCategory() {
        let allCategories = ["Alquiler", "Comida", "Diversión", "Antojo", "Gasto", "Transporte"];
        for (let index = 0; index < allCategories.length; index++){
            insertCategory(allCategories[index])
        }
    };

    function insertCategory(categoryName) {
        
        const selectElement = document.getElementById("transactionCategory")
        let htmlToInsert = `<option> ${categoryName} </option>`
        selectElement.insertAdjacentHTML("beforeend", htmlToInsert)
    };




    //Esta function va a detectar lo q hay en el localStoragey con el forEach, 
    //y agrego a la tabla. Puedo "eliminar" pero al recargar la pág. 
    //el contenio del localStorage me aparece cargado en el cuadro denuevo. 
    //Más ariba en el addEventListener summint vamos a poner el reset.
    //el domCL, trae el html y lo parsea (va detectando lo q hay adentro).
    //El forEach tiene la función de obtener c/entrada, ya que si no, tendría que tipearla a mano.
    //(arrayElement), es la variable interna del forEach.
    document.addEventListener("DOMContentLoaded", function(event){
    drawCategory()
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"))
    transactionObjArr.forEach(function(arrayElement){
        insertRowInTransactionTable(arrayElement)
        })
    });

    //Esta func creará un nuevo Idpara el nuevo dato ingresado al form.
    //Esta let va a buscar el dato al lStorage para asignar un número al nuevo.
    // o si no hay, le asigne 1.
function getNewTransactionId(){
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
    let newTransactionId = JSON.parse(lastTransactionId) + 1;
    localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId))
    //alternativo al anterior: newTransactionId.toString()
    return newTransactionId;
}



    //Le cambiamos el param de transactionFormData a transactionObj:
function convertFormDataToTransactionObj(transactionFormData) {
    //convierte de un FormData a un Objeto de Transacción = {"tipo" : "ingreso", "descripción"}
    //Por eso le pasamos como parámetro un FormData.
    //Luego, tomará los campos que le pasamos y los transformará en variables (los guarda).
    //El Return, es el objeto q retorna y tendrá el par clave:valor.
    let transactionType = transactionFormData.get("transactionType");
    let transactionDescription = transactionFormData.get("transactionDescription");
    let transactionAmount = transactionFormData.get("transactionAmount");
    let transactionCategory = transactionFormData.get("transactionCategory");
    //agregamos el de abajo para distinguir las transacciones.
    //Con transaction ID le damos un nº único de id al dato ingresado.
    let transactionId = getNewTransactionId();
    //Ponemos el atributo abajo y hacemos una función para obtener 
    //su resultado (+arriba)    
    return {
        "transactionType": transactionType,
        "transactionDescription": transactionDescription,
        "transactionAmount": transactionAmount,
        "transactionCategory": transactionCategory,
        "transactionId" : transactionId,
        }
     }



    //1 -Esta function recibe un FormData (a través de transactionFormData).
    //2 -Obtiene los 4 valores
    //3 -Devuelve un objeto, el cuál nos da pares clave : valor. 
    //¿Pq la hice? pq lo anterios no me daba los datos en el par clave:valor para pasarle el JSON.Stringify
  
    //le cambiamos acá también el transactionFormData por el transacctionObj sacamo () y ponemos [].
function insertRowInTransactionTable(transactionObj){
        let transactionTableRef = document.getElementById("transactionTable");

        let newTransactionRowRef = transactionTableRef.insertRow(-1);
        //hay que agregar esto para almacenar el id y luego poder borrar.
        newTransactionRowRef.setAttribute("data-transaction-Id", transactionObj["transactionId"])
        

        let newTypeCellRef = newTransactionRowRef.insertCell(0);
        newTypeCellRef.textContent = transactionObj["transactionType"];

        newTypeCellRef = newTransactionRowRef.insertCell(1);
        newTypeCellRef.textContent = transactionObj["transactionDescription"];

        newTypeCellRef = newTransactionRowRef.insertCell(2);
        newTypeCellRef.textContent = transactionObj["transactionAmount"];

        newTypeCellRef = newTransactionRowRef.insertCell(3);
        newTypeCellRef.textContent = transactionObj["transactionCategory"];

        let newDeleteCell = newTransactionRowRef.insertCell(4);
        let deleteButton = document.createElement("button");
        //El button se va a agrandar cuando le pongamos txt.
        deleteButton.textContent="Eliminar";
        //Que cree una nueva celda para cada nuevo botón.
        newDeleteCell.appendChild(deleteButton)
        //Hay que escuchar el evento para saber cuando va a funcionar.
        //() => {} es igual a function() {...} | es la función arrow.
        deleteButton.addEventListener("click", (event) => {
            let transactionRow = event.target.parentNode.parentNode;
            let transactionId = transactionRow.getAttribute("data-transaction-id");
            transactionRow.remove();
            deleteTransactionObj(transactionId);
            //esto me da el dato del elemento que clickeo-deleteButton-. 
            //El 2do parentNode me da los datos de la fila en donde se pulsó el botón.
            //Remove, lo borra. Pero cuidado, esto lo borra sólo del html pero sigue 
            //en el LocalStorage. O sea, al recargar la web, aparecen en la form 
            //todos los datos almacenados en el LStorage.
       });
    }

    //Vamos a hacer un método para BORRAR el LocalStorage pero buscando por ID.
    //Splice es una func q nos permite borrar  un elemento de un array. borra del array el elemento q cooincide c/ eñ índice q marque.
    //Luego de borrar hay que guardar el array nuevamnete. Voy a ir al button delete par aque ambas se borren, html y DStorage. Antes ir al newTransationRowRef

function deleteTransactionObj(transactionId){
    
    //Obtengo las transacciones de mi "base de datos"y las meto en una let. Desconvierto de json a Objeto.
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"))
    //Busco el índice o posicion que coincide con la transacción q quiero eliminar.
    let transactionIndexInArray = transactionObjArr.findIndex(element => element.transactionId === transactionId )
    //Tomamos el objeto con toda la adata y elimino el elemento que corresponde al índice q quiero eliminar.
    transactionObjArr.splice(transactionIndexInArray, 1);
    //Convierto nuevamente de objeto a JSON.
    let transactionArrayJSON = JSON.stringify(transactionObjArr);
    //y lo vuelvo a Guardar mi array de transacción en formato JSON en el LocalStorage.
    localStorage.setItem("transactionData", transactionArrayJSON)
}    

    // 1-Ahora haremos una function para guardar en el LocalStorage lo q hicimos arriba.
    // 2- Para que los datos que ingreso no se regraben unos encima de otros, 
    //hago la let myTransactionArray y le paso un push para cargarla. 
    // 3- Tengo q ver si no hay un array existente y por lo  tanto, no arranco en 0.

function saveTransactionObj(transactionObj) {

    //Pongo JSON.parse para transformar el txt a datos clave:valor(convierto a objeto). 
    //Uso getItem para averiguar si ya existe un array. Pq sino se cuelgaal no encontra nada -caso q esté vacío-
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];
    myTransactionArray.push(transactionObj);
     
    //Convierto mi array de transacción a JSON.
    let transactionArrayJSON = JSON.stringify(myTransactionArray);
    //Guardo mi array de transacción en formato JSON en el LocalStorage.
    localStorage.setItem("transactionData", transactionArrayJSON)
};
