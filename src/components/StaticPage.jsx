import { Box, Container, Typography, Divider, Stack, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { HiHome } from 'react-icons/hi2';
import PaqueteriaInfo from './PaqueteriaInfo';

const PAGE_CONTENT = {
  terminos: {
    title: 'Términos y Condiciones',
    content: `
      Estos términos y condiciones rigen el uso de los servicios de Remesas BYS. Al acceder a nuestra plataforma, usted acepta cumplir con estas disposiciones.
      
      1. Registro: El usuario debe ser mayor de edad y proporcionar información veraz.
      2. Operaciones: Remesas BYS actúa como intermediario para el envío de remesas.
      3. Comisiones: Todas las tarifas se muestran antes de confirmar la operación.
      4. Responsabilidad: El usuario es responsable de la exactitud de los datos del destinatario.
    `
  },
  privacidad: {
    title: 'Política de Privacidad',
    content: `
      En Remesas BYS, la privacidad de su información es nuestra prioridad. 
      
      - Recolectamos datos básicos para validar su identidad y procesar sus envíos.
      - No compartimos su información con terceros para fines comerciales.
      - Utilizamos encriptación de grado bancario para proteger sus transacciones.
      - Usted tiene derecho a solicitar la eliminación de sus datos en cualquier momento.
    `
  },
  cookies: {
    title: 'Política de Cookies',
    content: `
      Utilizamos cookies para mejorar su experiencia en nuestra plataforma. 
      
      - Cookies técnicas: Necesarias para el funcionamiento del sitio y la sesión.
      - Cookies de análisis: Nos ayudan a entender cómo se usa el sitio para mejorarlo.
      - Usted puede desactivar las cookies en la configuración de su navegador.
    `
  },
  seguridad: {
    title: 'Seguridad',
    content: `
      Su dinero y sus datos están protegidos por múltiples capas de seguridad.
      
      - Verificación de Identidad (KYC) para prevenir fraude.
      - Conexiones seguras SSL/TLS.
      - Monitoreo de transacciones 24/7.
      - Soporte dedicado en caso de cualquier incidencia.
    `
  },
  paqueteria: {
    title: 'Paquetería puerta a puerta a Venezuela',
    custom: true
  },
  nosotros: {
    title: 'Sobre Remesas BYS',
    content: `
      Remesas BYS nació con la misión de derribar las fronteras financieras para la comunidad hispana en el exterior.
      
      Creemos en un sistema de remesas justo, transparente y extremadamente rápido. Nuestra tecnología conecta familias de forma humana, permitiendo que el esfuerzo de quienes trabajan fuera llegue íntegro y seguro a su destino.
    `
  },
  carreras: {
    title: 'Trabaja con Nosotros',
    content: `
      ¿Te apasiona la tecnología y el impacto social? En Remesas BYS estamos buscando talentos que quieran revolucionar el mundo de las remesas.
      
      Ofrecemos un ambiente de trabajo dinámico, remoto y enfocado en resultados. Escríbenos a talento@remesasbys.com con tu CV y cuéntanos por qué quieres ser parte de la manada.
    `
  },
  contacto: {
    title: 'Contacto',
    content: `
      Estamos aquí para ayudarte. Puedes contactarnos a través de los siguientes canales:

      - Email: contacto@bnsglobalservices.com
      - WhatsApp (USA): +1 (832) 815-9187
      - WhatsApp (Chile): +56 9 3571 6037
      - Horario de Atención: Lunes a Viernes de 9:00 a 18:00 hrs.
      
      También puedes seguirnos en nuestras redes sociales para estar al tanto de las últimas novedades y tasas.
    `
  }
};

export default function StaticPage({ page, onBack }) {
  const data = PAGE_CONTENT[page] || { title: 'Página no encontrada', content: 'Lo sentimos, la página que buscas no existe.' };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: { xs: 4, md: 10 } }}>
      <Container maxWidth="md">
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
          <MuiLink
            component="button"
            onClick={onBack}
            sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontWeight: 500 }}
            underline="hover"
          >
            <HiHome style={{ marginRight: 4 }} /> Inicio
          </MuiLink>
          <Typography color="text.primary" fontWeight={700}>{data.title}</Typography>
        </Breadcrumbs>

        <Box sx={{ bgcolor: 'background.paper', p: { xs: 4, md: 8 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h2" gutterBottom fontWeight={900}>
            {data.title}
          </Typography>
          <Divider sx={{ my: 4 }} />
          {data.custom ? (
            <PaqueteriaInfo />
          ) : (
            <Stack spacing={3}>
              {data.content.split('\n').map((line, i) => (
                <Typography key={i} variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.1rem' }}>
                  {line.trim()}
                </Typography>
              ))}
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
}
