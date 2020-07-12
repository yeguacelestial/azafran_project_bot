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
const endpoint_url = eataAPI.endpoint_url


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
    // Display inline buttons
    const keyboard = Markup.inlineKeyboard([
        Markup.callbackButton('⬅️ Anterior', 'anterior'),
        Markup.urlButton('💬Publicar', 'http://exponatuagresor.herokuapp.com/'),
        Markup.callbackButton('Siguiente ➡️', 'siguiente')
    ])

})

// Comando para ver Testimonios publicados
bot.command('testimonios_publicados', (ctx) => {
    // Create inline keyboard
    const keyboard = Markup.inlineKeyboard([
        Markup.callbackButton('⬅️ Anterior', 'anterior'),
        Markup.callbackButton('Eliminar', 'eliminar'),
        Markup.callbackButton('Siguiente ➡️', 'siguiente')
    ])

    // Get current Testimonios json file
    eataAPI.getTestimoniosPublicados(endpoint_url).then(
        (json) => {

            // Initial data
            let testimonio_actual = 0
            let cantidad_testimonios = json.length

            function actualizarTestimonio(json, testimonio_actual, cantidad_testimonios){
                // Data of Testimonios
                let id_testimonio = JSON.stringify(json[testimonio_actual].id)
                let genero_testimonio = JSON.stringify(json[testimonio_actual].genero)
                let contenido_testimonio = json[testimonio_actual].denuncia
                
                // Message data
                let mensaje_cantidad_testimonios = `Actualmente, hay <b>${cantidad_testimonios}</b> testimonios publicados.`
                let mensaje_id_testimonio = `<b><i>ID del testimonio:</i></b> ${id_testimonio} \n`
                let mensaje_genero_testimonio = `<b><i>Género:</i></b> ${genero_testimonio} \n`
                let mensaje_contenido_testimonio = `\n<b><i>Testimonio:</i></b>\n${contenido_testimonio}`

                return {mensaje_cantidad_testimonios, mensaje_id_testimonio, mensaje_genero_testimonio, mensaje_contenido_testimonio}
            }

            // Cantidad of testimonios
            let {mensaje_cantidad_testimonios} = actualizarTestimonio(json, testimonio_actual, cantidad_testimonios)
            ctx.replyWithHTML(mensaje_cantidad_testimonios)

            // Display testimonio
            setTimeout(() => {
                let {mensaje_id_testimonio, mensaje_genero_testimonio, mensaje_contenido_testimonio} = actualizarTestimonio(json, testimonio_actual, cantidad_testimonios)

                ctx.replyWithHTML(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                , Extra.HTML().markup(keyboard))}, 1000)
            
            // Handling buttons:
                // Button 'Anterior'
                bot.action('siguiente', ctx => {
                    testimonio_actual += 1
                    let {mensaje_id_testimonio, mensaje_genero_testimonio, mensaje_contenido_testimonio} = actualizarTestimonio(json, testimonio_actual, cantidad_testimonios)

                    ctx.editMessageText(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                    , Extra.HTML().markup(keyboard))
                })

                // Button 'Siguiente'
                bot.action('anterior', ctx => {
                    testimonio_actual -= 1
                    let {mensaje_id_testimonio, mensaje_genero_testimonio, mensaje_contenido_testimonio} = actualizarTestimonio(json, testimonio_actual, cantidad_testimonios)

                    ctx.editMessageText(mensaje_id_testimonio+mensaje_genero_testimonio+mensaje_contenido_testimonio
                    , Extra.HTML().markup(keyboard))
                })
                
                // Button 'Eliminar'
                bot.action('eliminar', ctx => {
                    return ctx.reply('Eliminaste el testimonio')
                })

        }
    )

})

// Launch bot
bot.launch()

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