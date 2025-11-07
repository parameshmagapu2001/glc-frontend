import Box from '@mui/material/Box';
import Main from './main';
import AdminHeader from './admin-header';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
 
  return (
    <>
      <AdminHeader/>

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Main>{children}</Main>
      </Box>
    </>
  );
}
