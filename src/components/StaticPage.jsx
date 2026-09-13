import { Box, Container, Typography, Divider, Stack, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { HiHome } from 'react-icons/hi2';
import PaqueteriaInfo from './PaqueteriaInfo';
import TerminosCondiciones from './TerminosCondiciones';
import EnvioUPS from './EnvioUPS';

const PAGE_CONTENT = {
  terminos: {
    title: 'Términos y Condiciones',
    custom: true
  },
  'envio-ups': {
    title: 'Envía tu paquete por UPS (SendBox)',
    custom: true
  },
  privacidad: {
    title: 'Política de Privacidad',
    content: `
      En B&S Global Services, la privacidad de su información es nuestra prioridad.

      - Recolectamos únicamente los datos necesarios para validar su identidad y procesar sus remesas o envíos de paquetería.
      - No vendemos ni compartimos su información con terceros para fines comerciales.
      - Utilizamos encriptación de grado bancario para proteger sus datos y transacciones.
      - Usted tiene derecho a solicitar la corrección o eliminación de sus datos en cualquier momento escribiéndonos a contacto@bnsglobalservices.com.
    `
  },
  cookies: {
    title: 'Política de Cookies',
    content: `
      Utilizamos cookies para mejorar su experiencia en nuestra plataforma.

      - Cookies técnicas: necesarias para mantener su sesión iniciada y el funcionamiento del sitio.
      - Cookies de análisis: nos ayudan a entender cómo se usa el sitio para seguir mejorándolo.
      - Usted puede desactivar las cookies desde la configuración de su navegador en cualquier momento.
    `
  },
  seguridad: {
    title: 'Seguridad',
    content: `
      Tu dinero, tus paquetes y tus datos están protegidos en cada paso del proceso.

      - Verificación de identidad (KYC) para prevenir fraude y suplantación.
      - Conexiones cifradas SSL/TLS en toda la plataforma.
      - Alianza con Cargoexpress Venezuela y Tealca para una red de distribución verificada de más de 110 oficinas en Venezuela.
      - Comprobante y seguimiento disponibles para cada remesa y cada paquete enviado.
      - Soporte directo por WhatsApp ante cualquier duda o incidencia.
    `
  },
  paqueteria: {
    title: 'Paquetería puerta a puerta a Venezuela',
    custom: true
  },
  nosotros: {
    title: 'Sobre B&S Global Services',
    content: `
      B&S Global Services nació para resolver un problema muy concreto: enviar dinero y paquetes a Venezuela sin que la familia tenga que hacer filas, pagar de más, o quedarse esperando sin saber qué pasó con su envío.

      Desde nuestra oficina en Fishers, Indiana, conectamos a la comunidad venezolana en Estados Unidos con sus seres queridos, combinando remesas con las mejores tasas y paquetería con entrega puerta a puerta en más de 320 puntos del país.

      Somos agentes autorizados de Cargoexpress Venezuela, aliados con Tealca para la distribución nacional, lo que nos permite ofrecer una red de entrega real y verificada, no solo una promesa.

      Creemos en un servicio rápido, transparente y humano: tasas claras antes de confirmar cada envío, seguimiento de principio a fin, y un equipo que responde por WhatsApp cuando lo necesitas, no un buzón de voz.
    `
  },
  carreras: {
    title: 'Trabaja con Nosotros',
    content: `
      ¿Te apasiona ayudar a la comunidad venezolana en el exterior? En B&S Global Services estamos construyendo el servicio de remesas y paquetería de confianza para quienes tienen a su familia en Venezuela.

      Ofrecemos un ambiente de trabajo dinámico y enfocado en resultados reales para nuestros clientes. Escríbenos a contacto@bnsglobalservices.com con tu CV y cuéntanos por qué quieres ser parte del equipo.
    `
  },
  contacto: {
    title: 'Contacto',
    content: `
      Estamos aquí para ayudarte con tu remesa o tu envío de paquetería. Puedes contactarnos a través de los siguientes canales:

      - Email: contacto@bnsglobalservices.com
      - WhatsApp (USA): +1 (832) 815-9187
      - WhatsApp (Chile): +56 9 3571 6037
      - Horario de atención: Lunes a Viernes de 9:00 a.m. a 6:00 p.m.

      También puedes seguirnos en Instagram y Facebook (@remesasbys1) para estar al tanto de las últimas tasas y novedades.
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
          {page === 'paqueteria' ? (
            <PaqueteriaInfo />
          ) : page === 'terminos' ? (
            <TerminosCondiciones />
          ) : page === 'envio-ups' ? (
            <EnvioUPS />
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
