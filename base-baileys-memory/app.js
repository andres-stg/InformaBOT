const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowPrincipal = addKeyword([''])
    .addAnswer('🙌 ¡Hola! bienvenido a este *InformaBot* de la *República TV*.')
    .addAnswer('Nuestro objetivo es garantizar el *libre*, *verídico* y *confiable* acceso a la información ✅')

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer("probando el beta", {
        delay: 2000, 
    })

const flowRedes = addKeyword(['redes', 'Redes', 'REDES']).addAnswer(
    ['📲 Síguenos en Instagram', 'https://www.instagram.com/larepublica_tv/', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
