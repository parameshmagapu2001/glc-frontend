import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CustomBreadcrumbsProps } from './types';

export default function CustomBreadcrumbs({
  links,
  action,
  heading,
  moreLink,
  activeLast,
  sx,
  ...other
}: CustomBreadcrumbsProps) {

  const lastLink = links[links.length - 1].name;

  return (
    <Box sx={{ ...sx, py: 2 }}>
      <Stack direction="row" alignItems="center">
        <Box sx={{ flexGrow: 1 }}>
          {/* HEADING */}
          {heading && (
            <Typography variant="h4" gutterBottom>
              {heading}
            </Typography>
          )}

          {/* BREADCRUMBS */}
          {!!links.length && (
            <Breadcrumbs separator="/" {...other}>
              {links.map((link, index) => {
                const isLast = link.name === lastLink;
                const isFirst = index === 0;

                if (isLast) {
                  return (
                    <Box>
                      <Link
                        key={link.name || ''}
                        component="button"
                        color="inherit"
                        underline="none"
                        sx={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#000000',
                        }}
                      >
                        {link.name}
                      </Link>
                    </Box>
                  );
                }

                return (
                  <Stack key={link.name || ''} direction="row" alignItems="center" spacing={1.5}>
                    {isFirst && (
                      <Link
                        href={link.href}
                        underline="none"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <ArrowBackIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                      </Link>
                    )}
                    <Box>
                      <Link
                        href={link.href}
                        color="inherit"
                        underline="none"
                        sx={{
                          fontSize: '16px',
                          color: 'text.secondary',
                        }}
                      >
                        {link.name}
                      </Link>
                    </Box>
                  </Stack>
                );
              })}
            </Breadcrumbs>
          )}
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Stack>

      {/* MORE LINK */}
      {!!moreLink && (
        <Box sx={{ mt: 2 }}>
          {moreLink.map((href) => (
            <Link
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: 'table' }}
            >
              {href}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
}
