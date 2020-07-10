// Import Telegraf library
const Telegraf = require('telegraf')
const extra = require('telegraf/extra')
const markup = extra.markdown()

// Import config data
const config = require('./config')
const { markdown } = require('telegraf/extra')

// Get token from config data
const token = config.token

// Initialize bot object
const bot = new Telegraf(token)

/* BOT COMMANDS */
// Start
bot.start( (ctx) => {
    ctx.reply(`¡Hola, ${ctx.from.first_name}! Soy el bot de 'Expón a tu agresor.'`)
    ctx.reply('Ahora mismo me encuentro en desarrollo, pero ¡puedes regresar más tarde!')
    ctx.reply('Página oficial de la plataforma: http://exponatuagresor.herokuapp.com\n')
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
})

// Denuncias aceptadas
bot.command('denuncias_publicadas', (ctx) => {
    ctx.reply('Denuncias aceptadas')
})

// Launch bot
bot.launch()