'use client';

import { Skeleton } from 'primereact/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: Array<{
    width: string;
    header: string;
  }>;
}

export const TableSkeleton = ({ 
  rows = 5, 
  columns = [
    { width: '5%', header: 'ID' },
    { width: '20%', header: 'Usuario' },
    { width: '15%', header: 'Estado' },
    { width: '15%', header: 'Sector' },
    { width: '20%', header: 'Acciones' }
  ]
}: TableSkeletonProps) => {
  return (
    <div className="card">
      <div className="p-datatable p-component p-datatable-sm">
        {/* Header */}
        <div className="p-datatable-wrapper">
          <table className="p-datatable-table">
            <thead className="p-datatable-thead">
              <tr>
                {columns.map((col, index) => (
                  <th key={index} style={{ width: col.width }}>
                    <span className="p-column-title">{col.header}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="p-datatable-tbody">
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} style={{ width: col.width, padding: '0.75rem' }}>
                      <Skeleton 
                        width="80%" 
                        height="1.2rem"
                        className="mb-0"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginador skeleton */}
        <div className="p-paginator p-component p-paginator-bottom" style={{ padding: '0.75rem' }}>
          <div className="p-paginator-left-content">
            <Skeleton width="150px" height="1rem" />
          </div>
          <div className="p-paginator-right-content">
            <Skeleton width="200px" height="2rem" />
          </div>
        </div>
      </div>
    </div>
  );
};
