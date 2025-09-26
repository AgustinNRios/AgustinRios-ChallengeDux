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

export function UsuariosPageClient({ initialUsuarios, initialPagination }: UsuariosPageClientProps) {
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    filtros,
    setFiltros,
    handleSearchChange: handleSearchChangeBase,
  } = useUsuarioFilters();

  const { openCreateModal } = useUsuarioModalContext();

  const handleEstadoChange = (value: string | number) => {
    let estadoValue: string;
    if (typeof value === 'object') {
      estadoValue = '';
    } else {
      estadoValue = String(value);
    }
    setFiltros(prev => ({ ...prev, estado: estadoValue }));
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
  };

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

  const handleCreate = () => {
    openCreateModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Usuarios</h2>
        <Button
          label="Nuevo Usuario"
          icon="pi pi-plus"
          className={styles.mainButton}
          onClick={handleCreate}
        />
      </div>

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

      <UsuariosTable
        filtros={filtros}
      />

      <UsuarioModalContainer />
    </div>
  );
}
