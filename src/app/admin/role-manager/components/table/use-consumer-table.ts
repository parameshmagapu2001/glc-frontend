import { useState, useCallback } from 'react';
//
import { TableProps } from './types';

// ----------------------------------------------------------------------

type ReturnType = TableProps;

export type UseTableProps = {
  defaultDense?: boolean;
  defaultOrder?: 'asc' | 'desc';
  defaultOrderBy?: string;
  defaultSelected?: number[];
  defaultRowsPerPage?: number;
  defaultCurrentPage?: number;
  fetchData: (pageNumber: number, pageSize: number) => Promise<void>;
};

export default function useConsumerTable(props?: UseTableProps): ReturnType {

  const fetchData = props?.fetchData;
  
  const [dense, setDense] = useState(!!props?.defaultDense);

  const [page, setPage] = useState(props?.defaultCurrentPage || 0);

  const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'name');

  const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage || 10);

  const [order, setOrder] = useState<'asc' | 'desc'>(props?.defaultOrder || 'asc');

  const [selected, setSelected] = useState<number[]>(props?.defaultSelected || []);

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      if (id !== '') {
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
      }
    },
    [order, orderBy]
  );

  const onSelectRow = useCallback(
    (inputValue: number) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

   
  const onChangeRowsPerPage = useCallback(async(event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    const rows=parseInt(event.target.value, 10)
    setRowsPerPage(rows);
      if(fetchData) {
        await fetchData(0, rows);
      }
    },
    [fetchData]
  );
  
  const onChangeDense = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  }, []);

  const onSelectAllRows = useCallback((checked: boolean, inputValue: number[]) => {
    if (checked) {
      setSelected(inputValue);
      return;
    }
    setSelected([]);
  }, []);

  
  const onChangePage = useCallback(
    async (event: unknown, newPage: number) => {
      if (fetchData) {
        await fetchData(newPage, rowsPerPage);
      }
      setPage(newPage);
    },
    [fetchData, rowsPerPage]
  );
  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onUpdatePageDeleteRow = useCallback(
    (totalRowsInPage: number) => {
      setSelected([]);
      if (page) {
        if (totalRowsInPage < 2) {
          setPage(page - 1);
        }
      }
    },
    [page]
  );

  const onUpdatePageDeleteRows = useCallback(
    ({
      totalRows,
      totalRowsInPage,
      totalRowsFiltered,
    }: {
      totalRows: number;
      totalRowsInPage: number;
      totalRowsFiltered: number;
    }) => {
      const totalSelected = selected.length;

      setSelected([]);

      if (page) {
        if (totalSelected === totalRowsInPage) {
          setPage(page - 1);
        } else if (totalSelected === totalRowsFiltered) {
          setPage(0);
        } else if (totalSelected > totalRowsInPage) {
          const newPage = Math.ceil((totalRows - totalSelected) / rowsPerPage) - 1;
          setPage(newPage);
        }
      }
    },
    [page, rowsPerPage, selected.length]
  );

  return {
    dense,
    order,
    page,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeDense,
    onResetPage,
    onChangeRowsPerPage,
    onUpdatePageDeleteRow,
    onUpdatePageDeleteRows,
    //
    setPage,
    setDense,
    setOrder,
    setOrderBy,
    setSelected,
    setRowsPerPage,
  };
}
