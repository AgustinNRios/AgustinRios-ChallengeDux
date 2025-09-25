"use client";

import { Button } from "primereact/button";
import { ESTADOS } from "@/Domains/users/model/usuario";
import { Toast } from "primereact/toast";
import { InputGroup } from "@/components/ui/InputGroup";
import { Usuario } from "@/Domains/users/model/usuario";
import { UsuariosTable } from "@/Domains/users/components/UsuariosTable";
import { UsuarioModal } from "@/Domains/users/components/UsuarioModal";
import { useUsuarioManagement } from "@/Domains/users/hooks/useUsuarioManagement";
import { useEffect } from "react";

interface UsuariosPageClientProps {
  initialUsuarios?: Usuario[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function UsuariosPageClient({ initialUsuarios, initialPagination }: UsuariosPageClientProps) {
  const {
    usuarios,
    loading,
    pagination,
    showModal,
    editingUsuario,
    isEditing,
    filtros,
    toast,
    handleSearchChange,
    handleEstadoChange,
    handleSearch,
    handleCreate,
    handleEdit,
    closeModal,
    handleSave,
    handleDelete,
    handlePageChange,
    setInitialData,
  } = useUsuarioManagement();

  // Establecer datos iniciales del servidor
  useEffect(() => {
    if (setInitialData && initialUsuarios && initialUsuarios.length > 0 && initialPagination) {
      setInitialData(initialUsuarios, initialPagination);
    }
  }, [initialUsuarios, initialPagination, setInitialData]);

  // Mostrar datos iniciales mientras se cargan los datos del cliente
  const displayUsuarios = usuarios.length > 0 ? usuarios : (initialUsuarios || []);
  const isInitialLoad = usuarios.length === 0 && !loading;

  return (
    <div className="flex flex-col p-4">
      <Toast ref={toast} />
      
      {/* Header */}
      <div className="flex justify-between align-items-center mb-4">
        <h2 className="m-0">Lista de Usuarios</h2>
        <Button
          label="Nuevo Usuario"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={handleCreate}
        />
      </div>

      {/* Filtros */}
      <form onSubmit={handleSearch} className="flex flex-row gap-3 mb-4 p-fluid">
        <InputGroup
          type="text"
          icon="pi-search"
          value={filtros.search}
          onChange={handleSearchChange}
          placeholder="Buscar por nombre o usuario"
          className="flex-1"
        />
        
        {/* Sector fijo en 5000 - no mostrar filtro */}
        
        <InputGroup
          type="dropdown"
          icon="pi-check-circle"
          value={filtros.estado}
          options={ESTADOS}
          onChange={handleEstadoChange}
          placeholder="Seleccionar estado"
        />
      </form>

      {/* Indicador de datos pre-cargados */}
      {isInitialLoad && initialUsuarios && initialUsuarios.length > 0 && (
        <div className="mb-3 p-2 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
          <p className="text-sm">
            <i className="pi pi-info-circle mr-2"></i>
            Mostrando datos pre-cargados. Los datos se actualizarán automáticamente.
          </p>
        </div>
      )}

      {/* Tabla */}
      <UsuariosTable
        usuarios={displayUsuarios}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Modal */}
      <UsuarioModal
        visible={showModal}
        onHide={closeModal}
        onSave={handleSave}
        usuario={editingUsuario || undefined}
        isEditing={isEditing}
      />
    </div>
  );
}
