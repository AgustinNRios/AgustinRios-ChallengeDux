export function LoadingSkeleton() {
  return (
    <div className="flex flex-col p-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between align-items-center mb-4">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Filtros skeleton */}
      <div className="flex flex-row gap-3 mb-4">
        <div className="flex-1 h-12 bg-gray-200 rounded"></div>
        <div className="w-48 h-12 bg-gray-200 rounded"></div>
        <div className="w-48 h-12 bg-gray-200 rounded"></div>
      </div>

      {/* Tabla skeleton */}
      <div className="border rounded">
        {/* Header de tabla */}
        <div className="flex p-3 bg-gray-50 border-b">
          <div className="flex-1 h-4 bg-gray-200 rounded mr-4"></div>
          <div className="flex-1 h-4 bg-gray-200 rounded mr-4"></div>
          <div className="flex-1 h-4 bg-gray-200 rounded mr-4"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
        
        {/* Filas de tabla */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex p-3 border-b">
            <div className="flex-1 h-4 bg-gray-200 rounded mr-4"></div>
            <div className="flex-1 h-4 bg-gray-200 rounded mr-4"></div>
            <div className="flex-1 h-4 bg-gray-200 rounded mr-4"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
