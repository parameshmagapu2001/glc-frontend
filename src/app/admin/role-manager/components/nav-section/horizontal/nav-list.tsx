import { useState, useEffect, useRef } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import { appBarClasses } from '@mui/material/AppBar';
// routes
import { usePathname } from 'src/routes/hooks';
import { useActiveLink } from 'src/routes/hooks/use-active-link';
//
import { NavListProps, NavConfigProps } from '../types';
import NavItem from './nav-item';

// ----------------------------------------------------------------------

type NavListRootProps = {
  data: NavListProps;
  depth: number;
  hasChild: boolean;
  config: NavConfigProps;
  id: string;
};

export default function NavList({ data, depth, hasChild, config, id }: NavListRootProps) {
  const navRef = useRef(null);

  const pathname = usePathname();

  const active = useActiveLink(data.path, hasChild);

  const externalLink = data.path.includes('http');

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const appBarEl = Array.from(
      document.querySelectorAll(`.${appBarClasses.root}`)
    ) as Array<HTMLElement>;

    // Reset styles when hover
    const styles = () => {
      document.body.style.overflow = '';
      document.body.style.padding = '';
      // Apply for Window
      appBarEl.forEach((elem) => {
        elem.style.padding = '';
      });
    };

    if (open) {
      styles();
    } else {
      styles();
    }
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <NavItem
        ref={navRef}
        item={data}
        depth={depth}
        open={open}
        active={active}
        externalLink={externalLink}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        config={config}
      />

      {hasChild && (
        <Popover
          open={open}
          anchorEl={navRef.current}
          anchorOrigin={
            depth === 1
              ? { vertical: 'bottom', horizontal: 'left' }
              : { vertical: 'center', horizontal: 'right' }
          }
          transformOrigin={
            depth === 1
              ? { vertical: 'top', horizontal: 'left' }
              : { vertical: 'center', horizontal: 'left' }
          }
          slotProps={{
            paper: {
              onMouseEnter: handleOpen,
              onMouseLeave: handleClose,
              sx: {
                width: 160,
                ...(open && {
                  pointerEvents: 'auto',
                }),
              },
            },
          }}
          sx={{
            pointerEvents: 'none',
          }}
        >
          <NavSubList data={data.children} depth={depth} config={config} id={id} />
        </Popover>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type NavListSubProps = {
  data: NavListProps[];
  depth: number;
  config: NavConfigProps;
  id: string;
};

function NavSubList({ data, depth, config, id }: NavListSubProps) {

  const permissionsData = config.permissions ? config.permissions : {};

  return (
    <Stack spacing={0.5}>
      {data.map((list) => (
        (permissionsData.role_id === 1 || permissionsData[id]?.indexOf(list.id) !== -1) &&
        <NavList
          key={list.title + list.path}
          data={list}
          id={id}
          depth={depth + 1}
          hasChild={!!list.children}
          config={config}
        />
      ))}
    </Stack>
  );
}
