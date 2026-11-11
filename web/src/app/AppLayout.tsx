import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { Link, Outlet } from 'react-router';
import logo from '@/assets/namu-logo.webp';
import { paths } from './paths';

export function AppLayout() {
  return (
    <div className="min-h-dvh">
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Link to={paths.catalog} className="flex rounded-md">
              <img
                src={logo}
                alt="Namu — página inicial"
                width={398}
                height={128}
                className="h-8 w-auto"
              />
            </Link>
          </Toolbar>
        </Container>
      </AppBar>
      <Container component="main" maxWidth="lg" className="py-8">
        <Outlet />
      </Container>
    </div>
  );
}
