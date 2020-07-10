// Import Telegraf library
const Telegraf = require('telegraf')
const { Markup } = require('telegraf')
const { Extra } = require('telegraf')

// Import config data
const config = require('./config')

// Get token from config data
const token = config.token

// Initialize bot object
const bot = new Telegraf(token)

// Initialize timer
let timer = 0

/* BOT COMMANDS */
// Start
bot.start( (ctx) => {
    ctx.reply(`¡Hola, ${ctx.from.first_name}! Soy el bot de 'Expón a tu agresor.'`)
    
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

// Ayuda
bot.command('ayuda', (ctx) => {
    ctx.replyWithHTML('<b><i>Comandos del bot</i></b>\n'+
    '/start - Inicializa el bot.\n'+
    '/ayuda - Despliega este menú de ayuda.\n'+
    '/testimonios_recibidos - Testimonios recibidos en la base de datos. Los testimonios de aquí no están publicados en la plataforma, hasta que son publicados por ti.\n'+
    '/testimonios_publicados - Testimonios publicados en la plataforma. Estos testimonios son los que tu decidiste publicar.'
    )
})

// Denuncias recibidas
bot.command('denuncias_recibidas', (ctx) => {
    ctx.reply('Denuncias recibidas')

    // Display inline buttons
    const keyboard = Markup.inlineKeyboard([
        Markup.urlButton('Plataforma', 'http://exponatuagresor.herokuapp.com/'),
        Markup.callbackButton('Delete', 'delete')
    ])

    ctx.telegram.sendCopy(ctx.chat.id, ctx.message, Extra.markup(keyboard))

})

// Denuncias aceptadas
bot.command('denuncias_publicadas', (ctx) => {
    ctx.reply('Denuncias aceptadas')
})

// Launch bot
bot.launch()