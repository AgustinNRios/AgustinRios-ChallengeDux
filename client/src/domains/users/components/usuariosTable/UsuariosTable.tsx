'use client';

import { DataTable, DataTableStateEvent, DataTableSortEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Skeleton } from 'primereact/skeleton';
import { UserStatus, Usuario } from '@/domains/users/model/usuario';
import styles from './UsuariosTable.module.css';

interface UsuariosTableProps {
  usuarios: Usuario[];
  loading: boolean;
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (event: DataTableStateEvent) => void;
  sortField: string;
  sortOrder: 1 | -1 | null;
  onSort: (event: DataTableSortEvent) => void;
}

export const UsuariosTable = ({
  usuarios,
  loading,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  sortField,
  sortOrder,
  onSort,
}: UsuariosTableProps) => {
  const toast = useRef<Toast>(null);

  const confirmDelete = (usuario: Usuario) => {
    confirmDialog({
      message: '¿Estás seguro de que deseas eliminar este usuario?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => onDelete(usuario),
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
    });
  };

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
    <div className="card">
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
        onPage={onPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate=""
        emptyMessage="No se encontraron usuarios"
        className="p-datatable-sm"
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort}
        removableSort
      >
        <Column 
          field="id" 
          header="ID" 
          body={createTextBodyTemplate('id')}
          sortable 
          style={{ width: '5%' }} 
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
                className="cursor-pointer text-blue-500 hover:text-blue-700 underline"
                onClick={() => onEdit(rowData)}
                style={{ cursor: 'pointer' }}
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
