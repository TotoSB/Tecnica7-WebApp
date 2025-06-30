import { Request, Response, NextFunction } from 'express';
import prisma from '../services/database.service';
import { sendMail } from '../services/mail.service';
import config from '../config';

interface ContactRequestBody {
  Email?: string;
  nombre?: string;
  comentario?: string;
  nombre2?: string; // Este campo estaba en el PHP original, lo incluimos por si acaso
}

export const handleContactForm = async (req: Request, res: Response, next: NextFunction) => {
  const { Email, nombre, comentario, nombre2 } = req.body as ContactRequestBody;

  // Validación básica (se puede mejorar con librerías como Joi o Zod)
  if (!Email || !nombre || !comentario) {
    return res.status(400).json({ message: 'Email, nombre y comentario son campos requeridos.' });
  }

  try {
    // 1. Guardar en la base de datos
    const newSubmission = await prisma.contactSubmission.create({
      data: {
        email: Email,
        name: nombre,
        message: comentario,
        // submittedAt se establece por defecto por la BD
      },
    });
    console.log('Contact form submission saved to DB:', newSubmission.id);

    // 2. Enviar correo electrónico (similar al script PHP original)
    const mailContent = `Nuevo mensaje de contacto:
Nombre: ${nombre}
Email: ${Email}
Mensaje: ${comentario}
${nombre2 ? `Nombre2 (campo adicional): ${nombre2}` : ''}
ID de Registro en BD: ${newSubmission.id}`;

    const mailSent = await sendMail({
      to: config.mail.to, // Destinatario configurado en .env (originalmente $destino)
      subject: `Nuevo Contacto Web de: ${nombre}`,
      text: mailContent,
    });

    if (mailSent) {
      // El script PHP original solo hacía un `echo "<h4> Joya </h4>";`
      // Devolvemos una respuesta JSON más estructurada.
      // Si mailSent es una URL (Ethereal), la incluimos.
      const responseMessage = typeof mailSent === 'string' && mailSent.startsWith('http') 
        ? 'Formulario enviado con éxito. Email de prueba visible en: ' + mailSent 
        : 'Formulario enviado con éxito. Email enviado.';
      return res.status(200).json({ 
        message: responseMessage, 
        submissionId: newSubmission.id,
        mailPreviewUrl: typeof mailSent === 'string' && mailSent.startsWith('http') ? mailSent : undefined
      });
    } else {
      // Si el correo no se pudo enviar, pero los datos se guardaron en la BD
      console.error(`Failed to send contact email for submission ${newSubmission.id}, but data was saved to DB.`);
      return res.status(200).json({ 
        message: 'Formulario guardado, pero hubo un problema al enviar el correo de notificación.',
        submissionId: newSubmission.id 
      });
    }

  } catch (error) {
    console.error('Error processing contact form:', error);
    // Manejo de errores específicos de Prisma (ej. email duplicado si es unique)
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ message: 'Este email ya ha sido registrado.' });
    }
    next(error); // Pasa a middleware de error global
  }
};
