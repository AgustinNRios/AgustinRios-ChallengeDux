import styles from "./LoadingSkeleton.module.css";

export function LoadingSkeleton() {
  return (
    <div className={styles.container}>
      {/* Header skeleton */}
      <div className={styles.header}>
        <div className={styles.headerTitle}></div>
        <div className={styles.headerButton}></div>
      </div>

      {/* Filtros skeleton */}
      <div className={styles.filters}>
        <div className={styles.filterFull}></div>
        <div className={styles.filter}></div>
        <div className={styles.filter}></div>
      </div>

      {/* Tabla skeleton */}
      <div className={styles.table}>
        {/* Header de tabla */}
        <div className={styles.tableHeader}>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cellSmall}></div>
        </div>
        
        {/* Filas de tabla */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.tableRow}>
            <div className={styles.cell}></div>
            <div className={styles.cell}></div>
            <div className={styles.cell}></div>
            <div className={styles.cellSmall}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
