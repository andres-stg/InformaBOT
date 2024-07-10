const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const path = require("path");
const fs = require("fs");
const { delay } = require('@whiskeysockets/baileys');

const mensajesDir = path.join(__dirname, "mensajes");

// Función para leer archivos de mensajes
const readMessage = (fileName) => {
    const filePath = path.join(mensajesDir, fileName);
    return fs.readFileSync(filePath, "utf8");
};

const menuPath = path.join(mensajesDir, "Republica.txt");
const menu = fs.readFileSync(menuPath, "utf8");

const flowCurso = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test1.txt'), { capture: true }, async (ctx, { gotoFlow, flowDynamic }) => {
        if (isValidResponse(ctx.body)) {
            if (ctx.body.toLowerCase().includes('sí') || ctx.body === '1') {
                return gotoFlow(flowCurso2);
            } else {
                return await flowDynamic('*Datavenger: Ok acá estaré esperándote*');
            }
        } else {
            return await flowDynamic('Respuesta no válida. Por favor selecciona "Sí", "No", "1" o "2".');
        }
    });

const flowCurso2 = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test2.txt'), { capture: true }, async (ctx, { gotoFlow, flowDynamic }) => {
        if (isValidResponse(ctx.body)) {
            if (ctx.body.toLowerCase().includes('sí') || ctx.body === '1') {
                return gotoFlow(flowCurso3);
            } else {
                return await flowDynamic('Vale, quizás necesitas un café para volver con más energía ☕⚡');
            }
        } else {
            return await flowDynamic('Respuesta no válida. Por favor selecciona "Sí", "No", "1" o "2".');
        }
    });

function isValidResponse(response) {
    const validResponses = ['sí', 'no', '1', '2'];
    return validResponses.includes(response.toLowerCase());
}


const flowCurso3 = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test3.txt'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
        if (ctx.body.toLowerCase() === 'a') {
            await flowDynamic('¡Correcto! Toda información falsa presentada como verdadera es desinformación.*');
        } else if (ctx.body.toLowerCase() === 'b') {
            await flowDynamic('Incorrecto. La respuesta correcta es A. El ejemplo que seleccionaste corresponde a información errónea.*');
        } else if (ctx.body.toLowerCase() === 'c') {
            await flowDynamic('Incorrecto. La respuesta correcta es A. El ejemplo que seleccionaste corresponde a información maliciosa.*');
        }
        return gotoFlow(flowCurso4);
    });

const flowCurso4 = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test4.txt'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
        if (ctx.body.toLowerCase() === 'b') {
            await flowDynamic('¡Correcto! Recuerda que es importante verificar la fuente para asegurarse de que la información es fiable.');
        } else {
            await flowDynamic('Incorrecto. Recuerda que buscar la noticia en múltiples fuentes confiables puede ayudarte a asegurar que es información veraz.*');
        }
        return gotoFlow(flowCurso5);
    });

const flowCurso5 = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test5.txt'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
        if (ctx.body.toLowerCase() === 'c') {
            await flowDynamic('¡Correcto! Los memes son formatos creativos para presentar hechos pero recuerda siempre verificar la información.*');
        } else {
            await flowDynamic('Incorrecto. Algunos memes pueden ayudar a informar. Ya sabes lo que dicen, la gente aprende mientras ríe.*');
        }
        return gotoFlow(flowCurso6);
    });

const flowCurso6 = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test6.txt'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
        if (ctx.body.toLowerCase() === 'a') {
            await flowDynamic('¡Correcto! Todos debemos verificar la información en fuentes confiables antes de compartirla.*');
        } else {
            await flowDynamic('Incorrecto. La respuesta correcta es B. Los titulares sensacionalistas llaman la atención pero pueden distorsionar la verdad.*');
        }
        return gotoFlow(flowCurso7);
    });

const flowCurso7 = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Test7.txt'), { capture: true }, async (ctx, { flowDynamic }) => {
        if (ctx.body.toLowerCase() === 'b') {
            await flowDynamic('¡Correcto! Puedes verificar la autenticidad de una imagen o video en Google Imágenes y TinEye (al final te compartiremos el link)*');
        } else {
            await flowDynamic('Incorrecto. La respuesta correcta es B. Te recomendamos usar Google Imágenes y TinEye para verificar imágenes y videos.*');
        }
        return gotoFlow(flowCursoFinal);
    });

const flowCursoFinal = addKeyword(EVENTS.ACTION)
    .addAnswer(readMessage('Testfinal.txt'), { capture: true }, async (ctx, { flowDynamic }) => {
        return await flowDynamic('¡Gracias por participar en el test! Aquí tienes algunas herramientas para combatir la desinformación:*\n\n1. *Verifica siempre la fuente*: Asegúrate de que la información proviene de una fuente confiable. Puedes usar sitios como La TV Calle y sus canales de noticias (link)\n\n2. *Usa la búsqueda inversa de imágenes*: Herramientas como [Google Imágenes](https://images.google.com/) y [TinEye](https://tineye.com/) pueden ayudarte a verificar la autenticidad de fotos y videos.\n\n3. *Educa a otros*: Comparte información verificada y ayuda a tus amigos y familiares a identificar desinformación. Puedes encontrar recursos educativos en [Cazadores de Fake News](https://cazadoresdefakenews.info/) y [Probox](https://probox.com.ve/).\n\n4. *Se escéptico con los titulares sensacionalistas*: Investiga más antes de compartir.\n\n5. *Utiliza memes con responsabilidad*: Los memes pueden ser una herramienta poderosa para educar y combatir la desinformación de manera efectiva y atractiva. Aquí tienes una guía sobre cómo crear memes informativos en [Crehana](https://www.crehana.com/co/blog/diseno-grafico/como-crear-memes/).');
    });

const flowInvestiga = addKeyword(EVENTS.ACTION)
    .addAnswer('prueba investiga')

const flowBoletin = addKeyword(EVENTS.ACTION)
    .addAnswer('¡Únete a nuestro *canal de difusión* para estar al tanto de lo que sucede! 📢📺 https://shorturl.at/hQntC')

const flowRedes = addKeyword(EVENTS.ACTION)
    .addAnswer('prueba redes')

const flowCierre = addKeyword(EVENTS.ACTION)
    .addAnswer('prueba ¡chao!')

const flowInicio = addKeyword(['datavenger', 'Datavenger', 'DATAVENGER', 'DataAvenger'])
    .addAnswer('🙌 ¡Hola! Bienvenido al *Datavenger* 🦸🏽‍♀🦸🏻‍♂ de la *República TV*', { delay: 2000 })
    .addAnswer('Nuestro objetivo es garantizar el *libre*, *verídico* y *confiable* acceso a la información ✅', { delay: 2500 })
    .addAnswer('➡ Será posible *enviar esos datos que te tienen dudando*, y nuestro equipo _verificará si son ciertos_ o _te quieren ver la cara_ 🤡', { delay: 3000 })
    .addAnswer('➡ Podrás sugerirnos temas que quieres que investiguemos', { delay: 2500 })
    .addAnswer('➡ Y tendrás la oportunidad de hacer nuestro *curso exprés* para que estés preparado para *combatir la desinformación* y seas un *#HeroeXLaInformación* 🦸🏻‍♂🦸🏽‍♀', { delay: 3000 })
    .addAnswer('🤖 ¿En qué podemos ayudarte? Escribe *República* para ver las opciones', { delay: 2500, capture: true }, async (ctx, { gotoFlow }) => {
        if (['republica', 'república', 'República', 'Republica', 'REPÚBLICA', 'rEPÚBLICA', 'rEPUBLICA', 'REPUBLICA'].includes(ctx.body.toLowerCase())) {
            return gotoFlow(flowMenu);


        }
    }
    );

const flowMenu = addKeyword(EVENTS.ACTION)
    .addAnswer(
        menu,
        { capture: true, delay: 2500 },
        async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
            if (!["1", "2", "3", "4", "0"].includes(ctx.body)) {
                return await flowDynamic("Respuesta no válida, por favor selecciona una de las opciones.");
            }
            switch (ctx.body) {
                case "1":
                    return gotoFlow(flowCurso);
                case "2":
                    return gotoFlow(flowInvestiga);
                case "3":
                    return gotoFlow(flowBoletin);
                case "4":
                    return gotoFlow(flowRedes);
                case "0":
                    return await flowDynamic("Saliendo... Puedes volver a acceder a este menú escribiendo *República*");
            }
        }
    );



const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowInicio, flowMenu, flowCurso, flowInvestiga, flowBoletin, flowRedes, flowCierre]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();



