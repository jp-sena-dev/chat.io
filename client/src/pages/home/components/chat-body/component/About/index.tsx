import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  IconButton,
  Link,
  Typography,
} from '@mui/material';

interface AboutProps {
  handleChangeClose: () => void;
}

export function About({ handleChangeClose }: AboutProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        p: '24px',
        textIndent: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        overflowX: 'auto',
      }}
    >
      <IconButton
        onClick={handleChangeClose}
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      >
        <CloseIcon sx={{ fontSize: '2rem' }} />
      </IconButton>
      <Typography component="h1" sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '4rem' }} variant="h4">
        Chat
        <Typography component="span" color="primary" sx={{ fontWeight: 'bold', fontSize: '4rem' }}>.io</Typography>
      </Typography>
      <Box
        sx={{
          textIndent: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <Typography>
          Olá e seja bem-vindo ao
          {' '}
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            Chat
            <Typography component="span" sx={{ fontWeight: 'bold' }} color="primary">.io</Typography>
          </Typography>
          ! Este projeto foi cuidadosamente elaborado para
          proporcionar uma plataforma versátil e dinâmica  de criação de chats. Aqui, os
          usuários têm total liberdade para criar suas próprias salas, podendo personalizá-las
          escolhendo nome e foto exclusivos.
        </Typography>
        <Typography>
          Desenvolvido como parte do meu
          {' '}
          <Link target="_blank" rel="noreferrer" href="https://www.jp-sena.dev/" sx={{ fontWeight: 'bold' }} color="primary">
            portfólio pessoal
          </Link>
          , este projeto não só visa oferecer uma
          experiência interativa, mas também se revelou uma oportunidade valiosa para
          aprimorar minhas habilidades como desenvolvedor.
        </Typography>
        <Typography>
          No backend, a aplicação é impulsionada pelo
          {' '}
          <Link target="_blank" rel="noreferrer" href="https://expressjs.com/pt-br/" sx={{ fontWeight: 'bold' }} color="primary">
            Express
          </Link>
          , fornecendo uma base sólida e eficiente para o funcionamento do
          {' '}
          <Link target="_blank" rel="noreferrer" href="https://socket.io/" sx={{ fontWeight: 'bold' }} color="primary">
            Socket.io
          </Link>
          , a tecnologia essencial por trás das conversas em tempo real. Todas as informações
          essenciais são armazenadas de forma segura e eficaz no
          {' '}
          <Link target="_blank" rel="noreferrer" href="https://firebase.google.com/?hl=pt-br" sx={{ fontWeight: 'bold' }} color="primary">
            Firebase
          </Link>
          , garantindo a confiabilidade e integridade dos dados.
        </Typography>
        <Typography>
          Durante a jornada de criação deste projeto, adquiri uma compreensão valiosa do Socket.io,
          uma ferramenta poderosa para comunicação em tempo real. Este projeto foi desenvolvido por
          mim, e você pode explorar mais do meu trabalho no
          {' '}
          <Link target="_blank" rel="noreferrer" href="https://github.com/joaopedr0sena" sx={{ fontWeight: 'bold' }} color="primary">
            GitHub
          </Link>
          {' ou '}
          <Link target="_blank" rel="noreferrer" href="https://www.jp-sena.dev/" sx={{ fontWeight: 'bold' }} color="primary">
            meu site
          </Link>
          . Estou empolgado em apresentar
          esta plataforma e espero que você desfrute das diversas possibilidades de personalização
          e interação que o
          {' '}
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            Chat
            <Typography component="span" sx={{ fontWeight: 'bold' }} color="primary">.io</Typography>
          </Typography>
          {' '}
          tem a oferecer. Boas conversas aguardam por você no Chat.io!
        </Typography>
      </Box>
    </Box>
  );
}
