// Import fetch API
const fetch = require('node-fetch')

// Endpoint
const endpoint_url = 'http://exponatuagresor.herokuapp.com/api/denuncia/'

// Function for fetching testimonios
function getTestimoniosPublicados(endpoint_url){
    return fetch(endpoint_url)
        .then(
            response => response.json()
        )
        .then(
            (testimonios) => {return testimonios}
        ).catch(error => {console.log(`Pasó algo raro: ${error}\n`)})
}

// Function for posting testimonios
function postTestimonios(endpoint_url, genero, denuncia, edad, escuela){
    let testimonio = {
        "genero": genero,
        "denuncia": denuncia,
        "edad": edad,
        "escuela": escuela
    }

    fetch(endpoint_url, {
        method: 'POST',
        body: JSON.stringify(testimonio),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .catch(error => console.error(`[-] Error: ${error}`))
        .then(json => {console.log(`[+] Success: ${JSON.stringify(json)}`);return json})
}

// Function for deleting testimonios
function deleteTestimonio(endpoint_url, id_testimonio){
    return fetch(endpoint_url + id_testimonio, {
        method: 'delete'
    })
    .then(response => response.json())
}

// Calling testimonios function and doing something with the json file
// getTestimonios(endpoint_url).then(
//     (json) => {
//         // Do something with testimonios
//         console.log(json)
//     }
// )

// Posting a testimonio from postTestimonios function
// postTestimonios(endpoint_url,
//      genero='M', 
//      denuncia='Cuarto testimonio enviado desde función postTestimonios', 
//      edad=5,
//      escuela=6)

// Deleting a testimonio from deleteTestimonio function
// deleteTestimonio(endpoint_url, 8)

// Export functions
module.exports = {
    getTestimoniosPublicados: getTestimoniosPublicados,
    postTestimonios: postTestimonios,
    deleteTestimonio: deleteTestimonio,
    endpoint_url: endpoint_url
}