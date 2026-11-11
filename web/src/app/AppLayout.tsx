import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { alpha } from '@mui/material/styles';
import type { MouseEvent } from 'react';
import { Link, Outlet } from 'react-router';
import logo from '@/assets/namu-logo.webp';
import { paths } from './paths';

const MAIN_CONTENT_ID = 'conteudo-principal';

function focusMainContent(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  document.getElementById(MAIN_CONTENT_ID)?.focus();
}

export function AppLayout() {
  return (
    <div className="min-h-dvh">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        onClick={focusMainContent}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-1200 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-(--mui-palette-primary-dark) focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-(--mui-palette-primary-main)"
      >
        Pular para o conteúdo
      </a>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={({ palette }) => ({
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: alpha(palette.background.paper, 0.85),
          backdropFilter: 'blur(12px)',
        })}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Link to={paths.catalog} className="flex rounded-md">
              <img
                src={logo}
                alt="Namu, página inicial"
                width={398}
                height={128}
                className="h-8 w-auto"
              />
            </Link>
          </Toolbar>
        </Container>
      </AppBar>
      <Container
        component="main"
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        maxWidth="lg"
        className="py-8 outline-none"
      >
        <Outlet />
      </Container>
    </div>
  );
}
