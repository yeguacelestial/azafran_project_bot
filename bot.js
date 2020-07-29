// TODO: Command /testimonios_recibidos

// Import Telegraf library
const Telegraf = require('telegraf')
const { Markup } = require('telegraf')
const { Extra } = require('telegraf')
    
// Import config data
const config = require('./config')

// Get token from config data
const token = config.token

// Initialize bot object
const bot = new Telegraf(token);

// Import functions from fetch_requests.js
const eataAPI = require('./fetch_requests')
const endpoint_url = eataAPI.api_endpoint_url
const api_denuncias_recibidas = eataAPI.api_denuncias_recibidas
const api_denuncias_publicadas = eataAPI.api_denuncias_publicadas
const href = 'http://exponatuagresor.herokuapp.com'

/* Main functions */
// Actualizar testimonio
function actualizarTestimonioEnMensaje(json, testimonio_actual, cantidad_testimonios, tipo_testimonio){
    // Data of Testimonios
    let id_testimonio = JSON.stringify(json[testimonio_actual].id)
    let genero_testimonio = JSON.stringify(json[testimonio_actual].genero)
    let contenido_testimonio = json[testimonio_actual].denuncia
    
    // Message data
    let mensaje_cantidad_testimonios = `Actualmente, hay ***${cantidad_testimonios} testimonios ${tipo_testimonio}.***`
    let mensaje_id_testimonio = `***ID del testimonio:*** ${id_testimonio} \n`
    let mensaje_genero_testimonio = `***Género:*** ${genero_testimonio} \n`
    let mensaje_contenido_testimonio = `\n***Testimonio:***\n${contenido_testimonio}`

    return {mensaje_cantidad_testimonios, mensaje_id_testimonio, mensaje_genero_testimonio, mensaje_contenido_testimonio}
}

/* BOT COMMANDS */
// Start
bot.start( (ctx) => {
    ctx.reply(`¡Hola, ${ctx.from.first_name}! Soy el bot de 'Expón a tu agresor.'`)
    
    // Initialize timer
    let timer = 0
    
    timer += 1000
    setTimeout(
        () => {ctx.reply('Ahora mismo me encuentro en desarrollo, pero ¡puedes regresar más tarde!')}
        , timer)
    
    timer += 1000
    setTimeout(
        () => {ctx.replyWithHTML('Pulsa <a href="http://exponatuagresor.herokuapp.com/">aquí</a> para visitar la página oficial de la plataforma.\n')}
        , timer)

    console.log(`\n[+] BOT INICIADO`)
    console.log(`[*] Usuario: ${ctx.from.username}`)
    console.log(`[*] Nombre: ${ctx.from.first_name}`)
    console.log(`[*] Mensaje: ${ctx.message.text}`)
})

// Comando 'Ayuda'
bot.command('ayuda', (ctx) => {
    ctx.replyWithHTML('<b><i>Comandos del bot</i></b>\n'+
    '/start - Inicializa el bot.\n'+
    '/ayuda - Despliega este menú de ayuda.\n'+
    '/testimonios_recibidos - Testimonios recibidos en la base de datos. Los testimonios de aquí no están publicados en la plataforma, hasta que son publicados por ti.\n'+
    '/testimonios_publicados - Testimonios publicados en la plataforma. Estos testimonios son los que tu decidiste publicar.'
    )
})

// Comando para ver Testimonios recibidos
bot.command('testimonios_recibidos', (ctx) => {
    // Create initial keyboard (when there is only one testimonio)
    const initial_keyboard_exclusive = Markup.inlineKeyboard([
        Markup.callbackButton('💬Publicar', 'publicar')
    ])

    // Create initial keyboard (when there is more than one testimonio)
    const initial_keyboard = Markup.inlineKeyboard([
        Markup.callbackButton('💬Publicar', 'publicar'),
        Markup.callbackButton('Siguiente ➡️', 'siguiente')
    ])

    // Display inline buttons
    const normal_keyboard = Markup.inlineKeyboard([
        Markup.callbackButton('⬅️ Anterior', 'anterior'),
        Markup.callbackButton('💬Publicar', 'publicar'),
        Markup.callbackButton('Siguiente ➡️', 'siguiente')
    ])

    // Create ending keyboard
    const ending_keyboard = Markup.inlineKeyboard([
        Markup.callbackButton('⬅️ Anterior', 'anterior'),
        Markup.callbackButton('💬Publicar', 'publicar'),
    ])

    // Browse through testimonios
    eataAPI.getTestimonios(api_denuncias_recibidas).then(
        (json) => {
            let tipo_testimonio = 'recibidos'
            let testimonio_actual = 0
            let cantidad_testimonios = json.length

            // Si solo hay un testimonio recibido...
            if (cantidad_testimonios === 1){
                // Cantidad of testimonios
                let {mensaje_cantidad_testimonios} = actualizarTestimonioEnMensaje(json, testimonio_actual, cantidad_testimonios, tipo_testimonio)
                ctx.replyWithMarkdown(mensaje_cantidad_testimonios)

                // Display testimonio
                setTimeout(() => {
                    let {mensaje_id_testimonio, mensaje_genero_testimonio, mensaje_contenido_testimonio} =                     
                    actualizarTestimonioEnMensaje(json, testimonio_actual, cantidad_testimonios)

                    ctx.replyWithMarkdown(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                    , Extra.markdown().markup(initial_keyboard_exclusive))}, 1000)
                
                // Handling buttons:
                // Button 'Publicar'
                bot.action('publicar', ctx => {
                    let testimonio_a_publicar = json[testimonio_actual]
                    eataAPI.postTestimonio(api_denuncias_publicadas, testimonio_a_publicar)
                    eataAPI.deleteTestimonio(api_denuncias_recibidas, testimonio_a_publicar.id)

                    ctx.editMessageText(`Publicaste el testimonio <b>${JSON.stringify(testimonio_a_publicar.id)}.</b> Puedes ver los testimonios publicados pulsando <a href="${href}/testimonios">aqui, </a>o con el comando de /testimonios_publicados.\n\nIntroduce el comando <i>/testimonios_recibidos</i> si quieres seguir consultando los testimonios recibidos.`
                    , Extra.HTML())
                })
                .catch(error => {
                    let testimonio_a_publicar = json[testimonio_actual]
                    ctx.reply(`No se pudo publicar el testimonio ${testimonio_a_publicar.id}.`)
                    console.log(`[-] ERROR AL INTENTAR PUBLICAR TESTIMONIO: ${error}`)
                })
            }

            // If hay más de un testimonio recibido...
            else if (cantidad_testimonios > 0 && testimonio_actual < json.length){
                // Cantidad of testimonios
                let {mensaje_cantidad_testimonios} = actualizarTestimonioEnMensaje(json, testimonio_actual, cantidad_testimonios, tipo_testimonio)
                ctx.replyWithMarkdown(mensaje_cantidad_testimonios)

                // Display testimonio
                setTimeout(() => {
                    let {mensaje_id_testimonio, mensaje_genero_testimonio, mensaje_contenido_testimonio} =                     
                    actualizarTestimonioEnMensaje(json, testimonio_actual, cantidad_testimonios)

                    ctx.replyWithMarkdown(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                    , Extra.markdown().markup(initial_keyboard))}, 1000)
                
                // Handling buttons:
                    // Button 'Siguiente'
                    bot.action('siguiente', ctx => {
                        testimonio_actual += 1
                        let {mensaje_id_testimonio, mensaje_genero_testimonio, mensaje_contenido_testimonio} = actualizarTestimonioEnMensaje(json, testimonio_actual, cantidad_testimonios)

                        // If testimonio is the last one, display ending keyboard
                        if (testimonio_actual === json.length - 1){
                            ctx.editMessageText(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                            , Extra.markdown().markup(ending_keyboard))
                        } else {
                            ctx.editMessageText(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                            , Extra.markdown().markup(normal_keyboard))
                        }
                    })

                    // Button 'Anterior'
                    bot.action('anterior', ctx => {
                        testimonio_actual -= 1
                        let {mensaje_id_testimonio, mensaje_genero_testimonio, mensaje_contenido_testimonio} = actualizarTestimonioEnMensaje(json, testimonio_actual, cantidad_testimonios)
                        
                        // If testimonio actual is the first one, display initial keyboard
                        if (testimonio_actual === 0){
                            ctx.editMessageText(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                            , Extra.markdown().markup(initial_keyboard))
                        } else {
                            ctx.editMessageText(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                                , Extra.markdown().markup(normal_keyboard))
                        }
                    })
                    
                    // Button 'Publicar'
                    bot.action('publicar', ctx => {
                        let testimonio_a_publicar = json[testimonio_actual]
                        eataAPI.postTestimonio(api_denuncias_publicadas, testimonio_a_publicar)
                        eataAPI.deleteTestimonio(api_denuncias_recibidas, testimonio_a_publicar.id)

                        ctx.editMessageText(`Publicaste el testimonio <b>${JSON.stringify(testimonio_a_publicar.id)}.</b> Puedes ver los testimonios publicados pulsando <a href="${href}/testimonios">aqui, </a>o con el comando de /testimonios_publicados.\n\nIntroduce el comando <i>/testimonios_recibidos</i> si quieres seguir consultando los testimonios recibidos.`
                        , Extra.HTML())
                    })
                    .catch(error => {
                        let testimonio_a_publicar = json[testimonio_actual]
                        ctx.reply(`No se pudo publicar el testimonio ${testimonio_a_publicar.id}.`)
                    })

            }   
            // De lo contrario, si no hay ningún testimonio recibido...
            else if (cantidad_testimonios === 0){
                ctx.reply('Aún no se ha recibido ningún testimonio.')
            }
        }
    ).catch(error => {console.log(`[-] ERROR AL OBTENER LOS TESTIMONIOS DE LA API: ${error}\n`)})

})

// Comando para ver Testimonios publicados
bot.command('testimonios_publicados', (ctx) => {
    // Create initial keyboard
    const initial_keyboard = Markup.inlineKeyboard([
        Markup.callbackButton('Eliminar', 'eliminar'),
        Markup.callbackButton('Siguiente ➡️', 'siguiente')
    ])

    // Create normal keyboard
    const normal_keyboard = Markup.inlineKeyboard([
        Markup.callbackButton('⬅️ Anterior', 'anterior'),
        Markup.callbackButton('Eliminar', 'eliminar'),
        Markup.callbackButton('Siguiente ➡️', 'siguiente')
    ])

    // Create ending keyboard
    const ending_keyboard = Markup.inlineKeyboard([
        Markup.callbackButton('⬅️ Anterior', 'anterior'),
        Markup.callbackButton('Eliminar', 'eliminar'),
    ])

    // Get current Testimonios json file
    eataAPI.getTestimonios(api_denuncias_publicadas).then(
        (json) => {
            // Update Inline testimonio content
            // function actualizarTestimonioEnMensaje(json, testimonio_actual, cantidad_testimonios){
            //     // Data of Testimonios
            //     let id_testimonio = JSON.stringify(json[testimonio_actual].id)
            //     let genero_testimonio = JSON.stringify(json[testimonio_actual].genero)
            //     let contenido_testimonio = json[testimonio_actual].denuncia
                
            //     // Message data
            //     let mensaje_cantidad_testimonios = `Actualmente, hay ***${cantidad_testimonios} testimonios publicados.***`
            //     let mensaje_id_testimonio = `***ID del testimonio:*** ${id_testimonio} \n`
            //     let mensaje_genero_testimonio = `***Género:*** ${genero_testimonio} \n`
            //     let mensaje_contenido_testimonio = `\n***Testimonio:***\n${contenido_testimonio}`

            //     return {mensaje_cantidad_testimonios, mensaje_id_testimonio, mensaje_genero_testimonio, mensaje_contenido_testimonio}
            // }

            // Initial data
            let tipo_testimonio = 'publicados'
            let testimonio_actual = 0
            let cantidad_testimonios = json.length

            if (cantidad_testimonios > 0 && testimonio_actual < json.length){
                // Cantidad of testimonios
                let {mensaje_cantidad_testimonios} = actualizarTestimonioEnMensaje(json, testimonio_actual, cantidad_testimonios, tipo_testimonio)
                ctx.replyWithMarkdown(mensaje_cantidad_testimonios)

                // Display testimonio
                setTimeout(() => {
                    let {mensaje_id_testimonio, mensaje_genero_testimonio, mensaje_contenido_testimonio} =                     
                    actualizarTestimonioEnMensaje(json, testimonio_actual, cantidad_testimonios)

                    ctx.replyWithMarkdown(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                    , Extra.markdown().markup(initial_keyboard))}, 1000)
                
                // Handling buttons:
                    // Button 'Siguiente'
                    bot.action('siguiente', ctx => {
                        testimonio_actual += 1
                        let {mensaje_id_testimonio, mensaje_genero_testimonio, mensaje_contenido_testimonio} = actualizarTestimonioEnMensaje(json, testimonio_actual, cantidad_testimonios)

                        // If testimonio is the last one, display ending keyboard
                        if (testimonio_actual === json.length - 1){
                            ctx.editMessageText(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                            , Extra.markdown().markup(ending_keyboard))
                        } else {
                            ctx.editMessageText(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                            , Extra.markdown().markup(normal_keyboard))
                        }
                    })

                    // Button 'Anterior'
                    bot.action('anterior', ctx => {
                        testimonio_actual -= 1
                        let {mensaje_id_testimonio, mensaje_genero_testimonio, mensaje_contenido_testimonio} = actualizarTestimonioEnMensaje(json, testimonio_actual, cantidad_testimonios)
                        
                        // If testimonio actual is the first one, display initial keyboard
                        if (testimonio_actual === 0){
                            ctx.editMessageText(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                            , Extra.markdown().markup(initial_keyboard))
                        } else {
                            ctx.editMessageText(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                                , Extra.markdown().markup(normal_keyboard))
                        }
                    })
                    
                    // Button 'Eliminar'
                    bot.action('eliminar', ctx => {
                        let id_testimonio = json[testimonio_actual].id
                        eataAPI.deleteTestimonio(api_denuncias_publicadas, id_testimonio)

                        ctx.editMessageText(`Eliminaste el testimonio <b>${id_testimonio}</b>.\nIntroduce <i>/testimonios_publicados</i> si quieres seguir consultando los testimonios publicados en la plataforma.`
                        , Extra.HTML())
                    })

            } else if (cantidad_testimonios === 0){
                ctx.reply('Aún no hay ningún testimonio publicado.')

            } else {
                ctx.reply('Sucedió algo raro. Por favor, contacta a @hombrecelestial.')
            }
        }
    ).catch(error => {console.log(`Pasó algo raro: ${error}\n`)})

})

// Launch bot
console.log('[*] Inicializando bot...')
bot.launch()
    .then( () => console.log('[+] El bot está VIVO.'))
    .catch(error => console.log(`[-] ERROR AL LANZAR EL BOT: ${error}`))


/* Other things */

//  Create a custom keyboard
// bot.command('custom', ({reply}) => {
//     return reply('Custom buttons keyboard', Markup
//         .keyboard([
//             ['Search', 'Popular'], // Row1 with 1 button
//             ['Setting', 'Feedback'],
//             ['Ads', 'Rate Us', 'Share']
//         ])
//         .oneTime()
//         .resize()
//         .extra()
//     )
// })

// Clear keuboard
// bot.on('text', (ctx) => {
//     ctx.reply(':)', Markup.removeKeyboard().extra())
// })

// Edit message and inline keyboard / callback functions when someone clicks on 'coke'
// bot.action('coke', (ctx) => {
// 	ctx.editMessageText('Now: <b>7up</b> or <b>Fanta</b>?', Extra.HTML().markup(m => m.inlineKeyboard([
// 			m.callbackButton('7up', '7up'),
// 			m.callbackButton('Fanta', 'fanta'),
// 		  ])))
// })