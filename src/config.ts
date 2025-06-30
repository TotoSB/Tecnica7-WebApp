import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb?schema=public',
  mail: {
    host: process.env.MAIL_HOST || 'smtp.ethereal.email', // Usar Ethereal para pruebas por defecto
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
    secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER || 'your_ethereal_user@ethereal.email', // Usuario Ethereal o de tu proveedor SMTP
      pass: process.env.MAIL_PASS || 'your_ethereal_password', // Contraseña Ethereal o de tu proveedor SMTP
    },
    from: process.env.MAIL_FROM || 'noreply@example.com', // Dirección "De" para los correos
    to: process.env.MAIL_TO || 'dominefolcomatiass@gmail.com', // Dirección "Para" por defecto (tomada del PHP original)
  },
};

export default config;
