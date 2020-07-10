// Import fetch API
const fetch = require('node-fetch')

// Endpoint
const url = 'http://exponatuagresor.herokuapp.com/api/denuncia/'

// GET request
fetch(url)
    .then(function(response){
        return response.json()
    })
    .then(function(myJson){
        console.log(myJson)
    })

// POST request
// let denuncia = {
//     "genero": "M",
//     "denuncia": "Testimonio enviado desde NodeJS",
//     "edad": 2,
//     "escuela": 7
// }

// fetch(url, {
//     method: 'POST',
//     body: JSON.stringify(denuncia),
//     headers: {
//         'Content-Type': 'application/json'
//     }
// }).then(res => res.json())
// .catch(error => console.error(`[-] Error: ${error}`))
// .then(response => console.log(`[+] Success: ${response}`))