'use client';

import { DataTable, DataTableStateEvent, DataTableSortEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useRef, useEffect, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Skeleton } from 'primereact/skeleton';
import { UserStatus, Usuario } from '@/domains/users/model/usuario';
import { useUsuarioPagination } from '@/domains/users/hooks/useUsuarioPagination';
import { useUsuarioActions } from '@/domains/users/hooks/useUsuarioActions';
import { useUsuarioModalContext } from '@/domains/users/context/UsuarioModalContext';
import { convertPaginationEvent } from '@/domains/users/utils/paginationUtils';
import styles from './UsuariosTable.module.css';

interface UsuariosTableProps {
  filtros: {
    search: string;
    estado: string;
  };
}

export const UsuariosTable = ({ filtros }: UsuariosTableProps) => {
  const toast = useRef<Toast>(null);
  
  const [tableState, setTableState] = useState({
    page: 1,
    limit: 5,
    sortField: 'id',
    sortOrder: 1 as (1 | -1 | null),
  });

  const { openEditModal, setOnDataChange } = useUsuarioModalContext();
  
  const {
    usuarios,
    loading,
    pagination,
    error,
    fetchUsuarios,
  } = useUsuarioPagination();

  const { deleteUsuario } = useUsuarioActions({
    onSuccess: () => {
      // Llama a fetchUsuarios con los filtros y estado de tabla actuales para refrescar
      fetchUsuarios({ ...filtros, ...tableState });
    },
  });

  const handlePageChange = (event: DataTableStateEvent) => {
    const { page, limit } = convertPaginationEvent(event, pagination);
    setTableState(prev => ({ ...prev, page, limit }));
  };

  const handleSort = (event: DataTableSortEvent) => {
    const field = event.sortField;
    const order = event.sortOrder as (1 | -1 | null);
    setTableState(prev => ({ ...prev, sortField: field, sortOrder: order }));
  };

  const handleEdit = (usuario: Usuario) => {
    openEditModal(usuario);
  };

  const confirmDelete = (usuario: Usuario) => {
    confirmDialog({
      message: '¿Estás seguro de que deseas eliminar este usuario?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteUsuario(usuario),
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
    });
  };

  useEffect(() => {
    const params = {
      ...filtros,
      ...tableState,
    };
    fetchUsuarios(params);
  }, [fetchUsuarios, filtros, tableState]);

  useEffect(() => {
    const refreshData = () => fetchUsuarios({ ...filtros, ...tableState });
    setOnDataChange(refreshData);
  }, [setOnDataChange, fetchUsuarios, filtros, tableState]);

  const createTextBodyTemplate = (field: string) => {
    const TextBodyTemplate = (rowData: Usuario) => {
      if (loading && usuarios.length === 0 && !rowData.id) {
        return <Skeleton width="90%" height="1.5rem" className="mb-2" />;
      }
      return rowData[field as keyof Usuario];
    };
    TextBodyTemplate.displayName = `TextBodyTemplate_${field}`;
    return TextBodyTemplate;
  };

  const statusBodyTemplate = (rowData: Usuario) => {
    if (loading && usuarios.length === 0 && !rowData.id) {
      return <Skeleton width="80%" height="1.5rem" className="mb-2" />;
    }
    return rowData.estado === UserStatus.ACTIVO ? 'Activo' : 'Inactivo';
  };

  const actionBodyTemplate = (rowData: Usuario) => {
    if (loading && usuarios.length === 0 && !rowData.id) {
      return <Skeleton shape="circle" width="2rem" height="2rem" />;
    }
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-text p-button-danger"
        onClick={() => confirmDelete(rowData)}
        tooltip="Eliminar"
        tooltipOptions={{ position: 'top' }}
      />
    );
  };

  const skeletonRows = Array.from({ length: 5 }, () => ({ id: '', usuario: '', estado: UserStatus.ACTIVO, sector: '' }));

  return (
    <div className={styles.card}>
      <Toast ref={toast} />
      <ConfirmDialog />
      <DataTable
        value={loading && usuarios.length === 0 ? skeletonRows : usuarios}
        loading={false}
        lazy
        scrollHeight="flex"
        paginator
        rows={tableState.limit}
        totalRecords={pagination.total}
        first={(tableState.page - 1) * tableState.limit}
        onPage={handlePageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate=""
        emptyMessage="No se encontraron usuarios"
        className="p-datatable-sm"
        sortField={tableState.sortField}
        sortOrder={tableState.sortOrder}
        onSort={handleSort}
        removableSort
        responsiveLayout="scroll"
      >
        <Column field="id" header="ID" body={createTextBodyTemplate('id')} sortable style={{ width: '5%' }} className={styles.colId} />
        <Column 
          field="usuario" 
          header="Usuario" 
          body={(rowData: Usuario) => (
            <a className={styles.userLink} onClick={() => handleEdit(rowData)}>{rowData.usuario}</a>
          )}
          sortable 
          style={{ width: '20%' }} 
        />
        <Column field="estado" header="Estado" body={statusBodyTemplate} sortable style={{ width: '15%' }} />
        <Column field="sector" header="Sector" body={createTextBodyTemplate('sector')} sortable style={{ width: '15%' }} />
        <Column body={actionBodyTemplate} style={{ width: '20%', textAlign: 'center' }} bodyClassName="text-center" />
      </DataTable>
    </div>
  );
};
