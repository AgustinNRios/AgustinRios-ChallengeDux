"use client";

import { Button } from "primereact/button";
import { ESTADOS } from "@/domains/users/model/usuario";
import { Toast } from "primereact/toast";
import { InputGroup } from "@/components/ui/inputGroup/InputGroup";
import { Usuario } from "@/domains/users/model/usuario";
import { UsuariosTable } from "@/domains/users/components/usuariosTable/UsuariosTable";
import { UsuarioModal } from "@/domains/users/components/usuarioModal/UsuarioModal";
import { useUsuarioManagement } from "@/domains/users/hooks/useUsuarioManagement";
import { useEffect } from "react";
import styles from "./UsuariosPageClient.module.css";
import Image from "next/image";

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
    <div className={styles.container}>
      <Toast ref={toast} />
      
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Usuarios</h2>
        <Button
          label="Nuevo Usuario"
          icon="pi pi-plus"
          className={styles.mainButton}
          onClick={handleCreate}
        />
      </div>

      {/* Filtros */}
      <form onSubmit={handleSearch} className={styles.filters}>
        <InputGroup
          type="text"
          icon="pi-search"
          value={filtros.search}
          onChange={handleSearchChange}
          placeholder="Buscar"
          className={styles.flex1}
        />
        
        {/* Sector fijo en 5000 - no mostrar filtro */}
        
        <InputGroup
          type="dropdown"
          icon="pi-search"
          value={filtros.estado}
          options={ESTADOS}
          onChange={handleEstadoChange}
          placeholder="Seleccionar el Sector"
        />

        <InputGroup
          type="dropdown"
          icon="pi-search"
          value={filtros.estado}
          options={ESTADOS}
          onChange={handleEstadoChange}
          placeholder="Seleccionar el Sector"
        />

        <Button icon={<span className={styles.iconWrapper}><Image src="/filter-fill.svg" alt="Filtro" width={16} height={16} /></span>} severity="secondary" aria-label="Bookmark" className={styles.button}/>
        <Button icon={<span className={styles.iconWrapper}><Image src="/sliders-v.svg" alt="Filtro" width={16} height={16} /></span>} severity="secondary" aria-label="Bookmark" className={styles.button}/>
      </form>

      {/* Indicador de datos pre-cargados */}
      {isInitialLoad && initialUsuarios && initialUsuarios.length > 0 && (
        <div className={styles.infoBox}>
          <p className={styles.infoText}>
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
