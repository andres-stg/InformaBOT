// require('dotenv').config();

const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MongoAdapter = require('@bot-whatsapp/database/mongo');
const path = require("path");
const fs = require("fs");

// Directorio de mensajes
const mensajesDir = path.join(__dirname, "mensajes");

// Función para leer mensajes desde archivos
const readMessage = (fileName) => {
    const filePath = path.join(mensajesDir, fileName);
    return fs.readFileSync(filePath, "utf8");
};

// Función para manejar mensajes multimedia
const handleMediaMessage = async (ctx, db) => {
    const media = await downloadMediaMessage(ctx);
    const { type, message, from } = ctx;
    await db.collection('messages').insertOne({
        type,
        message,
        from,
        media,
        timestamp: new Date()
    });
};

// Cargar el menú desde un archivo
const menuPath = path.join(mensajesDir, "Republica.txt");
const menu = fs.readFileSync(menuPath, "utf8");

// Flujos hijos
const flowCursoFinal = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Testfinal.txt'), { capture: false }, async ({ gotoFlow }) => {
        return gotoFlow(flowMenu);
    });

const flowCurso7 = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test7.txt'), { capture: true }, async (ctx, { flowDynamic }) => {
        if (ctx.body.toLowerCase() === 'b') {
            await flowDynamic('¡Correcto! Puedes verificar la autenticidad de una imagen o video en Google Imágenes y TinEye *(al final te compartiremos el link)*');
        } else {
            await flowDynamic('Incorrecto. Te recomendamos usar Google Imágenes y TinyEye para verificar imágenes y videos.');
        }
        return gotoFlow(flowCursoFinal);
    });

const flowCurso6 = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test6.txt'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
        if (ctx.body.toLowerCase() === 'a') {
            await flowDynamic('¡Correcto! Todos debemos verificar las informaciones que nos llegan, independientemente del tema o nuestra edad.');
        } else {
            await flowDynamic('Incorrecto. La respuesta correcta es A: los titulares o contenidos sensacionalistas y capaces de llamar nuestra atención pueden ser una distorsión de la realidad. ¡Estemos *atentos*! 🔋');
        }
        return gotoFlow(flowCurso7);
    });

const flowCurso5 = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test5.txt'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
        if (ctx.body.toLowerCase() === 'c') {
            await flowDynamic('¡Correcto! Los memes son *formatos creativos para presentar hechos*, pero no olvides que es fundamental investigar por tu cuenta para contrastar las afirmaciones.');
        } else {
            await flowDynamic('Incorrecto. Algunos memes _pueden ayudar a informar_. Ya sabes lo que dicen: la gente *aprende mientras se ríe* :).');
        }
        return gotoFlow(flowCurso6);
    });

const flowCurso4 = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test4.txt'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
        if (ctx.body.toLowerCase() === 'b') {
            await flowDynamic('¡Correcto! Recuerda que es importante verificar la *fuente* para asegurarnos de que _la información es fiable._');
        } else {
            await flowDynamic('Incorrecto. Recuerda que buscar la noticia en varias fuentes confiables puede ayudarte a asegurar que una información es veraz.');
        }
        return gotoFlow(flowCurso5);
    });

const flowCurso3 = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test3.txt'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
        if (ctx.body.toLowerCase() === 'a') {
            await flowDynamic('¡Correcto! Toda información falsa presentada como verdadera es *desinformación.*');
        } else {
            await flowDynamic('Incorrecto. La opción *B* corresponde a _información errónea_, y la opción *C* se trata de _información maliciosa_');
        }
        return gotoFlow(flowCurso4);
    });

const flowCurso2 = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test2.txt'), { capture: true }, async (ctx, { gotoFlow, flowDynamic }) => {
        if (isValidResponse(ctx.body)) {
            if (isYesResponse(ctx.body)) {
                return gotoFlow(flowCurso3);
            } else if (isNoResponse(ctx.body)) {
                return await flowDynamic('Vale, quizás necesitas un café para volver con más energía ☕⚡', flowMenu);
            }
        } else {
            return await flowDynamic('Respuesta no válida. Por favor selecciona "Sí", "No", "1" o "2".', flowCurso2);
        }
    });

const flowCurso = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test1.txt'), { capture: true }, async (ctx, { gotoFlow, flowDynamic }) => {
        if (isValidResponse(ctx.body)) {
            if (isYesResponse(ctx.body)) {
                return gotoFlow(flowCurso2);
            } else if (isNoResponse(ctx.body)) {
                return await flowDynamic('*Datavenger: Ok acá estaré esperándote*', flowMenu);
            }
        } else {
            return await flowDynamic('Respuesta no válida. Por favor selecciona "Sí", "No", "1" o "2".', flowCurso);
        }
    });

// Funciones de validación
function isValidResponse(response) {
    const validResponses = ['sí', 'Sí', 'SI', 'SÍ', 'si', 'Si', 'no', 'NO', 'No', '1', '2'];
    return validResponses.includes(response);
}

function isYesResponse(response) {
    const yesResponses = ['sí', 'Sí', 'SI', 'SÍ', 'si', 'Si', '1'];
    return yesResponses.includes(response);
}

function isNoResponse(response) {
    const noResponses = ['no', 'NO', 'No', '2'];
    return noResponses.includes(response);
}

// Flujos principales
const flowInvestiga = addKeyword(EVENTS.ACTION)
    .addAnswer('Puedes enviarme texto, imágenes, videos, documentos o notas de voz y lo guardaré en la base de datos.', { capture: true }, async (ctx, { db }) => {
        switch (ctx.type) {
            case 'imageMessage':
            case 'videoMessage':
            case 'documentMessage':
            case 'audioMessage':
                await handleMediaMessage(ctx, db);
                break;
            case 'textMessage':
                await db.collection('messages').insertOne({
                    type: 'text',
                    message: ctx.body,
                    from: ctx.from,
                    timestamp: new Date()
                });
                break;
            default:
                await db.collection('messages').insertOne({
                    type: 'unknown',
                    message: ctx.body,
                    from: ctx.from,
                    timestamp: new Date()
                });
        }
    });

const flowBoletin = addKeyword(EVENTS.ACTION)
    .addAnswer('¡Únete a los *canales de difusión* de *La TV Calle* https://shorturl.at/hQntC y *Noticias Todos Ahora* https://shorturl.at/7okVa para estar al tanto de lo que sucede! 📢📺', { capture: false }, async (ctx, { gotoFlow }) => {
        return gotoFlow(flowMenu);
    });

const flowRedes = addKeyword(EVENTS.ACTION)
    .addAnswer('Síguenos en nuestras Redes Sociales 📲😎 *Instagram:* https://www.instagram.com/larepublica_tv/ *X:* https://x.com/larepublica_tv *TikTok:* https://www.tiktok.com/@larepublica_tv', { capture: false }, async (ctx, { gotoFlow }) => {
        return gotoFlow(flowMenu);
    });

const flowCierre = addKeyword(EVENTS.ACTION)
    .addAnswer('prueba ¡chao!', { capture: true }, async (ctx, { gotoFlow }) => {
        if (['republica', 'República'].includes(ctx.body.toLowerCase())) {
            return gotoFlow(flowMenu);
        }
    });

const flowMenu = addKeyword([
    'republica',
    'república',
    'República',
    'Republica',
    'REPÚBLICA',
    'rEPÚBLICA',
    'rEPUBLICA',
    'REPUBLICA',
]).addAnswer(
    menu,
    { capture: true, delay: 2500 },
    async (ctx, { gotoFlow, flowDynamic }) => {
        switch (ctx.body) {
            case '1':
                return gotoFlow(flowCurso);
            case '2':
                return gotoFlow(flowInvestiga);
            case '3':
                return gotoFlow(flowBoletin);
            case '4':
                return gotoFlow(flowRedes);
            case '0':
                await flowDynamic(
                    'Saliendo... Puedes volver a acceder a este menú escribiendo República'
                );
                return;
            default:
                await flowDynamic(
                    'Respuesta no válida, por favor selecciona una de las opciones.'
                );
                return gotoFlow(flowMenu);
        }
    }
);

const flowInicio = addKeyword(['datavenger', 'Datavenger', 'DATAVENGER', 'DatAvenger'])
    .addAnswer('🙌 ¡Hola! Soy DatAvenger🦸🏽‍♀🦸🏻‍♂, tu aliado contra la desinformación creado por La República TV', { delay: 1000 })
    .addAnswer('Mi misión es garantizarte un libre, verídico y confiable acceso a la información pública ✅', { delay: 1000 })
    .addAnswer('➡ Acá podrás enviar esos datos que te tienen dudando, y nuestro equipo verificará si son ciertos o te quieren ver la cara 🤡', { delay: 1000 })
    .addAnswer('➡También podrás sugerirme temas que quieres que investigue ', { delay: 1000 })
    .addAnswer('➡ Y además tendrás la oportunidad de hacer el curso express para combatir la desinformación y convertirte en un #HeroeXLaInformación 🦸🏻‍♂🦸🏽‍♀', { delay: 1000 })
    .addAnswer('🤖 ¿En qué podemos ayudarte? Escribe *República* para ver las opciones', { delay: 1000, capture: true }, async (ctx, { gotoFlow }) => {
        if (['republica', 'república', 'República', 'Republica', 'REPÚBLICA', 'rEPÚBLICA', 'rEPUBLICA', 'REPUBLICA'].includes(ctx.body.toLowerCase())) {
            return gotoFlow(flowMenu);
        }
    });

const main = async () => {

    const adapterDB = new MongoAdapter({
        dbUri: process.env.MONGO_DB_URI,
        dbName: "Mensajes",
        options: {
            tlsInsecure: true,
        }
    });
    const adapterFlow = createFlow([flowInicio, flowMenu, flowInvestiga, flowBoletin, flowRedes, flowCierre, flowCursoFinal, flowCurso7, flowCurso6, flowCurso5, flowCurso4, flowCurso3, flowCurso2, flowCurso]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();