"use client";

import { Button } from "primereact/button";
import { ESTADOS } from "@/domains/users/model/usuario";
import { InputGroup } from "@/components/molecules/InputGroup/InputGroup";
import { Usuario } from "@/domains/users/model/usuario";
import { UsuariosTable } from "@/domains/users/components/usuariosTable/UsuariosTable";
import { useUsuarioFilters } from "@/domains/users/hooks/useUsuarioFilters";
import { useUsuarioModalContext } from "@/domains/users/context/UsuarioModalContext";
import { UsuarioModalContainer } from "@/domains/users/components/usuarioModalContainer/UsuarioModalContainer";
import { FormEvent, useRef } from "react";
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

/**
 * Componente cliente que gestiona la interactividad de la página de usuarios.
 * Recibe los datos iniciales del servidor (ISR) y se encarga de los filtros,
 * la paginación y la apertura de modales.
 */
export function UsuariosPageClient({ initialUsuarios, initialPagination }: UsuariosPageClientProps) {
  // Ref para gestionar el temporizador del "debounce" en la búsqueda.
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hook personalizado para centralizar la lógica de los filtros.
  const {
    filtros,
    setFiltros,
    handleSearchChange: handleSearchChangeBase,
  } = useUsuarioFilters();

  // Hook para acceder al contexto del modal y poder abrirlo.
  const { openCreateModal } = useUsuarioModalContext();

  /**
   * Maneja el cambio en el filtro de estado.
   * Incluye una salvaguarda por si el componente de UI devuelve un objeto en lugar de un valor primitivo.
   */
  const handleEstadoChange = (value: string | number) => {
    let estadoValue: string;
    // Algunos componentes de UI pueden devolver un objeto de evento en lugar del valor.
    // Esta comprobación asegura que siempre trabajemos con un string.
    if (typeof value === 'object') {
      estadoValue = '';
    } else {
      estadoValue = String(value);
    }
    setFiltros(prev => ({ ...prev, estado: estadoValue }));
  };

  /**
   * Previene el comportamiento por defecto del formulario (recarga de página) al presionar Enter.
   */
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
  };

  /**
   * Gestiona el cambio en el input de búsqueda con una técnica de "debounce".
   * Esto evita que se actualice el estado (y se dispare una nueva búsqueda) con cada tecla presionada,
   * mejorando el rendimiento al esperar 500ms después de que el usuario deja de escribir.
   */
  const handleSearchChange = (value: string | number) => {
    handleSearchChangeBase(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const searchValue = String(value);
      setFiltros(prev => ({ ...prev, search: searchValue }));
    }, 500);
  };

  /**
   * Abre el modal para la creación de un nuevo usuario.
   */
  const handleCreate = () => {
    openCreateModal();
  };

  return (
    <div className={styles.container}>
      {/* Encabezado de la página con título y botón de acción principal */}
      <div className={styles.header}>
        <h2 className={styles.title}>Usuarios</h2>
        <Button
          label="Nuevo Usuario"
          icon="pi pi-plus"
          className={styles.mainButton}
          onClick={handleCreate}
        />
      </div>

      {/* Sección de filtros para la tabla de usuarios */}
      <form onSubmit={handleSearch} className={styles.filters}>
        <InputGroup
          type="text"
          icon="pi-search"
          value={filtros.search}
          onChange={handleSearchChange}
          placeholder="Buscar por nombre, email..."
          className={styles.flex1}
        />
        
        <InputGroup
          type="dropdown"
          icon="pi-filter"
          value={filtros.estado}
          options={ESTADOS}
          onChange={handleEstadoChange}
          placeholder="Filtrar por estado"
        />

        <div className={styles.gap}>
          <Button icon={<span className={styles.iconWrapper}><Image src="/filter-fill.svg" alt="Filtro" width={16} height={16} /></span>} severity="secondary" aria-label="Filtro" className={styles.button}/>
          <Button icon={<span className={styles.iconWrapper}><Image src="/sliders-v.svg" alt="Filtro" width={16} height={16} /></span>} severity="secondary" aria-label="Configuración" className={styles.button}/>
        </div>
      </form>

      {/* Tabla que muestra los usuarios, recibe los filtros para re-renderizarse */}
      <UsuariosTable
        filtros={filtros}
      />

      {/* Contenedor del modal, se renderiza aquí para estar disponible en toda la página */}
      <UsuarioModalContainer />
    </div>
  );
}
