import { useState, useEffect, useCallback } from 'react';
// @mui
import Collapse from '@mui/material/Collapse';
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

  const pathname = usePathname();

  const active = useActiveLink(data.path, hasChild);

  const externalLink = data.path.includes('http');

  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (!active) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <NavItem
        item={data}
        depth={depth}
        open={open}
        active={active}
        externalLink={externalLink}
        onClick={handleToggle}
        config={config}
      />

      {hasChild && (
        <Collapse in={open} unmountOnExit>
          <NavSubList data={data.children} depth={depth} config={config} id={id} />
        </Collapse>
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
    <>
      {data.map((list) => (
        (permissionsData.role_id === 1 || permissionsData[id]?.indexOf(list.id) !== -1) &&
        < NavList
          key={list.title + list.path}
          data={list}
          id={id}
          depth={depth + 1}
          hasChild={!!list.children}
          config={config}
        />
      ))}
    </>
  );
}
