'use client';

import { DataTable, DataTableStateEvent, DataTableSortEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Skeleton } from 'primereact/skeleton';
import { UserStatus, Usuario } from '@/domains/users/model/usuario';
import { useUsuarioPagination } from '@/domains/users/hooks/useUsuarioPagination';
import { useUsuarioActions } from '@/domains/users/hooks/useUsuarioActions';
import { useUrlState } from '@/domains/users/hooks/useUrlState';
import { useUsuarioModalContext } from '@/domains/users/context/UsuarioModalContext';
import { buildSearchParamsFromStart, buildSearchParamsWithPage } from '@/domains/users/utils/searchUtils';
import { convertPaginationEvent } from '@/domains/users/utils/paginationUtils';
import styles from './UsuariosTable.module.css';

interface UsuariosTableProps {
  // Props mínimas necesarias desde el componente padre
  filtros?: {
    search: string;
    estado: string;
  };
}

/**
 * Componente de tabla de usuarios que maneja su propio estado interno.
 * Utiliza hooks especializados para paginación, acciones CRUD y estado de URL.
 * Se comunica con el modal a través del contexto para evitar prop drilling.
 */
export const UsuariosTable = ({ filtros = { search: '', estado: '' } }: UsuariosTableProps) => {
  const toast = useRef<Toast>(null);
  
  // Hooks para manejar estado y funcionalidad
  const { urlState, updateUrl, resetToFirstPage } = useUrlState();
  const { openEditModal, setOnDataChange } = useUsuarioModalContext();
  
  const {
    usuarios,
    loading,
    pagination,
    error,
    fetchUsuarios,
    refreshUsuarios,
  } = useUsuarioPagination();

  const {
    deleteUsuario,
    showSuccess,
    showError,
  } = useUsuarioActions({
    onSuccess: () => {
      refreshUsuarios();
    },
  });

  // Funciones de manejo de eventos
  const handlePageChange = (event: DataTableStateEvent) => {
    const { page, limit } = convertPaginationEvent(event, pagination);
    updateUrl({ page, limit });
    
    const params = buildSearchParamsWithPage(page, { ...pagination, limit }, filtros, urlState.sortField, urlState.sortOrder);
    fetchUsuarios(params);
  };

  const handleSort = (event: DataTableSortEvent) => {
    const field = event.sortField;
    const order = event.sortOrder as (1 | -1 | null);
    
    updateUrl({ sortField: field, sortOrder: order });
    
    const params = buildSearchParamsFromStart(pagination, filtros, field, order);
    fetchUsuarios(params);
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

  // Efecto centralizado para la carga de datos.
  // Se ejecuta cuando cambian los filtros, el ordenamiento o la página.
  useEffect(() => {
    const params = {
      ...filtros,
      page: urlState.page,
      limit: urlState.limit,
      sortField: urlState.sortField,
      sortOrder: urlState.sortOrder,
    };
    fetchUsuarios(params);
  }, [fetchUsuarios, filtros, urlState]);

  // Registrar el callback para refrescar los datos desde el modal.
  // Usamos un useEffect separado para que no se vuelva a registrar en cada render.
  useEffect(() => {
    setOnDataChange(() => fetchUsuarios({
      ...filtros,
      page: urlState.page,
      limit: urlState.limit,
      sortField: urlState.sortField,
      sortOrder: urlState.sortOrder,
    }));
  }, [setOnDataChange, fetchUsuarios, filtros, urlState]);

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

  const skeletonRows = Array.from({ length: 5 }, () => ({
    id: '',
    usuario: '',
    estado: UserStatus.ACTIVO,
    sector: '',
  }));

  return (
    <div className={styles.card}>
      <Toast ref={toast} />
      <ConfirmDialog />
      <DataTable
        value={loading && usuarios.length === 0 ? skeletonRows : usuarios}
        loading={false}
        lazy
        paginator
        rows={pagination.limit}
        totalRecords={pagination.total}
        first={(pagination.page - 1) * pagination.limit}
        onPage={handlePageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate=""
        emptyMessage="No se encontraron usuarios"
        className="p-datatable-sm"
        sortField={urlState.sortField}
        sortOrder={urlState.sortOrder}
        onSort={handleSort}
        removableSort
        responsiveLayout="scroll"
      >
        <Column 
          field="id" 
          header="ID" 
          body={createTextBodyTemplate('id')}
          sortable 
          style={{ width: '5%' }} 
          className={styles.colId}
        />
        <Column 
          field="usuario" 
          header="Usuario" 
          body={(rowData: Usuario) => {
            if (loading && usuarios.length === 0 && !rowData.id) {
              return <Skeleton width="90%" height="1.5rem" className="mb-2" />;
            }
            return (
              <a
                className={styles.userLink}
                onClick={() => handleEdit(rowData)}
              >
                {rowData.usuario}
              </a>
            );
          }}
          sortable 
          style={{ width: '20%' }} 
        />
        <Column 
          field="estado" 
          header="Estado" 
          body={statusBodyTemplate} 
          sortable 
          style={{ width: '15%' }} 
        />
        <Column 
          field="sector" 
          header="Sector" 
          body={createTextBodyTemplate('sector')}
          sortable 
          style={{ width: '15%' }} 
        />
        <Column 
          body={actionBodyTemplate} 
          style={{ width: '20%', textAlign: 'center' }} 
          bodyClassName="text-center"
        />
      </DataTable>
    </div>
  );
};
