'use client';

import { Skeleton } from 'primereact/skeleton';
import styles from './TableSkeleton.module.css';

/**
 * Componente de skeleton para mostrar mientras se cargan los datos de la tabla.
 * Simula la estructura visual de la tabla de usuarios para mejorar la UX.
 */
export const TableSkeleton = () => {
  return (
    <div className={styles.container}>
      {/* Header skeleton */}
      <div className={styles.header}>
        <Skeleton width="200px" height="2rem" className="mb-2" />
        <Skeleton width="150px" height="2.5rem" />
      </div>

      {/* Filters skeleton */}
      <div className={styles.filters}>
        <Skeleton width="300px" height="2.5rem" />
        <Skeleton width="200px" height="2.5rem" />
        <div className={styles.filterButtons}>
          <Skeleton shape="circle" width="2.5rem" height="2.5rem" />
          <Skeleton shape="circle" width="2.5rem" height="2.5rem" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className={styles.table}>
        {/* Table header */}
        <div className={styles.tableHeader}>
          <Skeleton width="50px" height="1.5rem" />
          <Skeleton width="120px" height="1.5rem" />
          <Skeleton width="80px" height="1.5rem" />
          <Skeleton width="80px" height="1.5rem" />
          <Skeleton width="100px" height="1.5rem" />
        </div>

        {/* Table rows */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={styles.tableRow}>
            <Skeleton width="30px" height="1.5rem" />
            <Skeleton width="100px" height="1.5rem" />
            <Skeleton width="60px" height="1.5rem" />
            <Skeleton width="60px" height="1.5rem" />
            <Skeleton shape="circle" width="2rem" height="2rem" />
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className={styles.pagination}>
        <Skeleton width="300px" height="2rem" />
      </div>
    </div>
  );
};
