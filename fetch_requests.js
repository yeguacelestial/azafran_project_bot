// Import fetch API
const fetch = require('node-fetch')

// Endpoint
const api_endpoint_url = 'http://exponatuagresor.herokuapp.com/api/'
const api_denuncias_recibidas = `${api_endpoint_url}denuncias_recibidas/`
const api_denuncias_publicadas = `${api_endpoint_url}denuncias_publicadas/`

// Function for fetching testimonios
function getTestimonios(endpoint_url){
    return fetch(endpoint_url)
        .then(
            response => response.json()
        )
        .then(
            (testimonios) => {return testimonios}
        ).catch(error => {console.log(`Pasó algo raro: ${error}\n`)})
}

// Function for posting testimonios
function postTestimonio(endpoint_url, json_testimonio){
    fetch(endpoint_url, {
        method: 'post',
        body: JSON.stringify(json_testimonio),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(json => {console.log(`[+] Success: ${JSON.stringify(json)}`);return json})
        .catch(error => console.error(`[-] Error: ${error}`))
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
    getTestimonios: getTestimonios,
    postTestimonio: postTestimonio,
    deleteTestimonio: deleteTestimonio,
    api_endpoint_url: api_endpoint_url,
    api_denuncias_recibidas: api_denuncias_recibidas,
    api_denuncias_publicadas: api_denuncias_publicadas
}