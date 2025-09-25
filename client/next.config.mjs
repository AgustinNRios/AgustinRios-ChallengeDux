/** @type {import('next').NextConfig} */
const nextConfig = {
  
  // Headers para mejorar el rendimiento
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },

  // Configuración de imágenes si es necesario
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
