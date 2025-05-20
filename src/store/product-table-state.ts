import { hookstate } from '@hookstate/core';

export const productTableState = hookstate({
  selectedRowId: null as number | null,
});