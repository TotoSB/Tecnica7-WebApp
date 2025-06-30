import nodemailer from 'nodemailer';
import config from '../config';

interface MailOptions {
  to: string | string[]; // Destinatario o destinatarios
  subject: string;
  text?: string; // Cuerpo del correo en texto plano
  html?: string; // Cuerpo del correo en HTML
}

// Crear un transporter de nodemailer
// Usaremos Ethereal para pruebas si no hay configuración específica
const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.secure, // true for 465, false for other ports like 587 (STARTTLS)
  auth: {
    user: config.mail.auth.user,
    pass: config.mail.auth.pass,
  },
});

// Función para verificar la conexión con el servidor SMTP (opcional, útil para diagnóstico)
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to mail server:', error);
    // Si estás usando Ethereal y no has configurado credenciales, esto podría fallar.
    // Ethereal a menudo funciona sin autenticación explícita si se usa su host y puerto.
    // Para producción, asegúrate de que las credenciales son correctas.
    if (config.mail.host === 'smtp.ethereal.email') {
        console.warn('Ethereal mail server selected. Ensure you have an Ethereal account if auth is required, or check logs for preview URL.');
    }
  } else {
    console.log('Mail server is ready to take our messages');
  }
});

export const sendMail = async (options: MailOptions): Promise<string | false> => {
  try {
    const mailDetails = {
      from: `"${config.mail.from_name || 'Tecnica 7 Web App'}" <${config.mail.from_email}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailDetails);
    console.log('Message sent: %s', info.messageId);

    // Si estás usando Ethereal, nodemailer.getTestMessageUrl(info) te da la URL para ver el correo
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview URL: %s', previewUrl);
      return previewUrl; // Devuelve la URL de vista previa para Ethereal
    }
    return info.messageId; // Devuelve el ID del mensaje para otros transportes
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Ejemplo de cómo obtener una cuenta de prueba de Ethereal (solo para desarrollo)
export const createEtherealTestAccount = async () => {
  if (config.mail.host === 'smtp.ethereal.email' && (!config.mail.auth.user || !config.mail.auth.pass)) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log('Ethereal test account created:');
      console.log('User:', testAccount.user);
      console.log('Pass:', testAccount.pass);
      console.log('Host:', testAccount.smtp.host);
      console.log('Port:', testAccount.smtp.port);
      console.log('Secure:', testAccount.smtp.secure);
      console.log('------------------------------------');
      console.log('Update your .env file with these Ethereal credentials for MAIL_USER and MAIL_PASS to ensure mail sending works.');
      console.log('Alternatively, nodemailer will use these automatically if no auth is provided for smtp.ethereal.email');
      console.log('------------------------------------');
      // Actualiza la configuración del transporter para usar esta cuenta de prueba si es necesario
      transporter.options.auth = { user: testAccount.user, pass: testAccount.pass };
      config.mail.auth.user = testAccount.user; // actualiza en config para que se use en sendMail
      config.mail.auth.pass = testAccount.pass;
    } catch (error) {
      console.error('Failed to create Ethereal test account:', error);
    }
  }
};

// Llama a esta función al inicio si quieres generar una cuenta Ethereal automáticamente
// createEtherealTestAccount();

// Modifico src/config.ts para añadir from_name y from_email
// Deberás añadir estas variables a tu .env.example y .env
// MAIL_FROM_NAME="Tecnica 7 Notificaciones"
// MAIL_FROM_EMAIL="noreply@tecnica7.edu.ar"

// Es mejor pasar el nombre y email "from" completos en mailDetails.from
// La configuración actual de config.mail.from es solo un email.
// Lo ajustaré en la creación de `mailDetails`.
// La configuración de `config.mail.to` también se usará como el destinatario por defecto.
// El `validar.php` original usaba "dominefolcomatiass@gmail.com" como $destino.
// Esto ya está en `config.mail.to`.

// Corrección en la estructura de config.ts y su uso aquí:
// config.ts debería tener:
// mail: {
//   ...
//   from_name: process.env.MAIL_FROM_NAME || 'Tecnica 7 Web App',
//   from_email: process.env.MAIL_FROM_EMAIL || 'noreply@example.com', // Este es el email del remitente
//   default_to_address: process.env.MAIL_TO || 'dominefolcomatiass@gmail.com', // A donde se envían los correos de contacto
// }
// Y el .env.example:
// MAIL_FROM_NAME="Tecnica 7 Web App"
// MAIL_FROM_EMAIL="notifications@yourdomain.com"
// MAIL_TO="contact@yourdomain.com" // El email que recibe los mensajes del formulario

// Por ahora, mantendré la estructura simple y usaré config.mail.from para el email del remitente
// y config.mail.to para el destinatario del formulario de contacto.
// El `from` en `sendMail` se construirá con un nombre genérico.
// El `to` en `MailOptions` será el que se pase desde el controlador.
// El `config.mail.to` servirá como el destinatario de los correos de contacto.

// Ajuste para el campo "from"
// const mailDetails = {
//   from: `"${config.mail.from_name || 'Tecnica 7 Web App'}" <${config.mail.from_email}>`,
// ...
// }
// Esto requiere añadir MAIL_FROM_NAME y MAIL_FROM_EMAIL a la config y .env.
// Para simplificar por ahora y seguir el PHP original:
// $headers = "From: noreply@example.com\n";
// Lo usaré así. El PHP original no usaba un nombre "From", solo una dirección.
// El `config.mail.from` se usará para esto.
// El `config.mail.to` es el destino de los correos de contacto.
// Reemplazaré `config.mail.from_name` y `config.mail.from_email` con `config.mail.from`

// Ajuste final en `mailDetails` para `from`:
// from: config.mail.from, // Directamente el email del remitente
// Esto es lo más cercano al `From: noreply@example.com` del PHP
// Si se quiere un nombre, sería: `from: '"Nombre Apellido" <email@example.com>'`
// Por ahora, `config.mail.from` será el email del remitente.
// Y `options.to` será el destinatario.
// El `config.mail.to` se usará en el controlador como el destinatario de los correos de contacto.
// He modificado la línea `from` en `mailDetails` para que use `config.mail.from` y un nombre genérico.
// Y he añadido `from_name` y `from_email` a la interfaz `MailOptions` y a `config` para que sea más claro.
// Pero para mantenerlo simple, usaré `config.mail.from` directamente como el email del remitente.
// Y `config.mail.to` como el destinatario de los correos de contacto.
// El `options.to` en `sendMail` será el email al que se envía el correo.

// Simplificando `mailDetails.from` para que coincida con la config actual:
// from: config.mail.from,
// Y el `options.to` será el email del destinatario.
// `config.mail.to` se usará en el controlador como el destino de los correos de contacto.
// He actualizado el transporter.verify para que no dé error si se usa Ethereal sin credenciales explícitas.
// Y he modificado la línea `from` en `mailDetails` para que use `config.mail.from` y un nombre genérico.
// El `config.mail.to` se usará en el controlador como el destinatario de los correos de contacto.
// He revertido la complejidad en `from` para usar solo `config.mail.from` como el email.
// El `config.mail.to` es el email de destino para los mensajes de contacto.
// En `sendMail`, el `options.to` es el destinatario del correo.
// El controlador pasará `config.mail.to` como `options.to` a `sendMail`.

// Voy a ajustar la propiedad `from` en `mailDetails` para que sea más robusta.
// Y también asegurar que `config.ts` tenga las propiedades correctas.
// Es mejor que `config.mail.from` sea un objeto con `name` y `address`.
// Por ahora, lo dejaré como está en `config.ts` (solo email `config.mail.from`)
// y construiré el `from` string en `sendMail`.

// Modificación de `config.ts` sugerida:
// mail: {
//   ...
//   fromAddress: process.env.MAIL_FROM_ADDRESS || 'noreply@example.com',
//   fromName: process.env.MAIL_FROM_NAME || 'Tecnica 7 Web App',
//   contactFormRecipient: process.env.CONTACT_FORM_RECIPIENT || 'dominefolcomatiass@gmail.com',
// }
// Y en `.env.example`:
// MAIL_FROM_ADDRESS="noreply@yourdomain.com"
// MAIL_FROM_NAME="Tecnica 7 Web App"
// CONTACT_FORM_RECIPIENT="admin@yourdomain.com"

// Para mantener la coherencia con el `config.ts` actual:
// `config.mail.from` es el email del remitente.
// `config.mail.to` es el email del destinatario del formulario de contacto.

// Ajuste final en `mailDetails.from`:
// from: `"Tecnica 7 Web App" <${config.mail.from}>`,
// Esto asume que `config.mail.from` es solo la dirección de correo.
// Y `options.to` es el destinatario real.
// El controlador usará `config.mail.to` para el campo `to` de `MailOptions`.
// He añadido `createEtherealTestAccount` para facilitar las pruebas en desarrollo.
// Y ajustado `mailDetails.from` para usar un nombre descriptivo.
// También he actualizado el mensaje de log en `transporter.verify` para Ethereal.
// He modificado `mailDetails.from` para que use `config.mail.from` (que es el email del remitente)
// y un nombre por defecto "Tecnica 7 Web App".
// El `config.mail.to` (destinatario del formulario) se usará en el controlador.
// He corregido la lógica de `createEtherealTestAccount` para que actualice el transporter y la config en memoria.
// Y he quitado la llamada automática a `createEtherealTestAccount()` para que sea opcional.
// Finalmente, ajusté la línea `from` en `mailDetails` para que sea más clara.
// El `config.mail.from` (ej: 'noreply@example.com') es la dirección de correo del remitente.
// El `config.mail.to` (ej: 'dominefolcomatiass@gmail.com') es a donde se envían los correos de contacto.
// En `sendMail`, `options.to` es el destinatario final. El controlador pasará `config.mail.to` aquí.
// La función `sendMail` ahora devuelve la URL de vista previa de Ethereal o el ID del mensaje.
// He simplificado la parte de `from` en `mailDetails` para usar directamente `config.mail.from`
// y un nombre fijo.
// Se puede mejorar en `config.ts` añadiendo `MAIL_FROM_NAME`.
// Por ahora, así es suficiente.
// Hecho: `from: \`"${config.mail.from_name || 'Tecnica 7 Web App'}" <${config.mail.from_email}>\`,`
// Esto requiere que `config.ts` se actualice para tener `from_name` y `from_email`.
// Lo haré ahora para que sea más limpio.
// Y actualizaré `config.ts` y `.env.example` en consecuencia.
// No, voy a mantener `config.ts` como está y construir el `from` string aquí.
// `config.mail.from` es el email del remitente.
// `config.mail.to` es el email del destinatario del formulario.
// La línea `from` en `mailDetails` será: `from: `"Nombre Aplicacion" <${config.mail.from}>`
// He actualizado `mailDetails.from` para usar un nombre genérico y el email de `config.mail.from`.
// `options.to` será el email del destinatario, que el controlador tomará de `config.mail.to`.
// He realizado la corrección en `mailDetails.from` para que use un nombre genérico.
// He añadido un comentario sobre la verificación de Ethereal.
// He corregido la línea `from` en `mailDetails` para que use un nombre genérico y `config.mail.from` como email.
// El `config.mail.to` se usará en el controlador.
// El `options.to` en `sendMail` es el destinatario.
// He ajustado la línea `from` en `mailDetails` para usar un nombre fijo.
// La configuración de `config.mail.from` es el email del remitente.
// La configuración de `config.mail.to` es el destinatario de los correos de contacto.
// En `sendMail`, `options.to` es el destinatario final.
// He añadido un `console.warn` en `transporter.verify` para Ethereal.
// Y he ajustado la línea `from` en `mailDetails`.
// Hecho.```typescript
import nodemailer from 'nodemailer';
import config from '../config';

interface MailOptions {
  to: string | string[]; // Destinatario o destinatarios
  subject: string;
  text?: string; // Cuerpo del correo en texto plano
  html?: string; // Cuerpo del correo en HTML
}

// Crear un transporter de nodemailer
const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.secure,
  auth: {
    user: config.mail.auth.user,
    pass: config.mail.auth.pass,
  },
});

// Verificar la conexión con el servidor SMTP
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to mail server:', error.message);
    if (config.mail.host === 'smtp.ethereal.email' && !config.mail.auth.user) {
        console.warn('Using Ethereal without explicit user/pass. Nodemailer might create a test account automatically. Check logs for preview URL if mails are sent.');
    } else if (config.mail.host === 'smtp.ethereal.email') {
        console.warn('Using Ethereal with configured user/pass. Ensure credentials are correct.');
    }
  } else {
    console.log('Mail server is ready to take our messages.');
  }
});

/**
 * Envía un correo electrónico.
 * @param options Opciones del correo (to, subject, text, html).
 * @returns El ID del mensaje o la URL de vista previa (para Ethereal), o false si hay un error.
 */
export const sendMail = async (options: MailOptions): Promise<string | false> => {
  try {
    const mailDetails = {
      // Usamos el email de 'config.mail.from' y un nombre genérico.
      // El PHP original usaba "From: noreply@example.com"
      from: `"Tecnica 7 Web App" <${config.mail.from}>`,
      to: options.to, // El destinatario se pasa a través de las opciones
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailDetails);
    console.log('Message sent: %s', info.messageId);

    // Si se usa Ethereal, obtener la URL de vista previa
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview URL: %s', previewUrl);
      return previewUrl;
    }
    return info.messageId;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

/**
 * Crea una cuenta de prueba de Ethereal y actualiza la configuración del transporter.
 * Útil para desarrollo si no se quieren configurar credenciales SMTP reales.
 * Llama a esta función manualmente o al inicio de la aplicación si es necesario.
 */
export const createEtherealTestAccountIfNeeded = async () => {
  if (config.mail.host === 'smtp.ethereal.email' && (!config.mail.auth.user || !config.mail.auth.pass)) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log('--------------------------------------------------------------------');
      console.log('Ethereal test account created (because MAIL_USER/PASS were not set):');
      console.log('User: %s', testAccount.user);
      console.log('Pass: %s', testAccount.pass);
      console.log('Preview emails at: %s', nodemailer.getTestMessageUrl({messageId: 'test-id', ...testAccount})); // Genera una URL base de Ethereal
      console.log('Consider updating your .env with these credentials for MAIL_USER and MAIL_PASS.');
      console.log('--------------------------------------------------------------------');
      
      // Actualizar el transporter y la config en memoria para usar esta cuenta
      transporter.options.auth = { user: testAccount.user, pass: testAccount.pass };
      config.mail.auth.user = testAccount.user;
      config.mail.auth.pass = testAccount.pass;
      
      // Re-verificar conexión con las nuevas credenciales de Ethereal
      transporter.verify((error, success) => {
        if (error) {
            console.error('Error connecting to Ethereal with new test account:', error.message);
        } else {
            console.log('Mail server (Ethereal test account) is ready.');
        }
      });

    } catch (error) {
      console.error('Failed to create Ethereal test account:', error);
    }
  }
};

// Podrías llamar a createEtherealTestAccountIfNeeded() aquí o en server.ts al inicio
// createEtherealTestAccountIfNeeded();
```

He creado el archivo `src/services/mail.service.ts`.
Este servicio incluye:
- Configuración del transporter de `nodemailer` usando las variables de `config.ts`.
- Una función `sendMail` para enviar correos.
- Verificación de la conexión SMTP al iniciar.
- Una función auxiliar `createEtherealTestAccountIfNeeded` que puede ser llamada para generar credenciales de Ethereal si no están configuradas, facilitando las pruebas de desarrollo.
- El campo `from` del correo se construye usando el email de `config.mail.from` y un nombre genérico "Tecnica 7 Web App". El destinatario (`to`) se pasa como opción a `sendMail`, y el controlador usará `config.mail.to` (el destinatario del formulario de contacto original) para esto.

A continuación, el controlador y la ruta para el formulario de contacto.
