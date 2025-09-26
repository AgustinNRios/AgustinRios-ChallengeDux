import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import styles from "./layout.module.css";

// Theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
// Core CSS
import "primereact/resources/primereact.min.css";
// Icons
import "primeicons/primeicons.css";
import Link from "next/link";
import { ClientOnly } from "@/components/hocs/ClientOnly/ClientOnly";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton/LoadingSkeleton";
import AppSidebar from "@/components/sidebar/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Challenge Dux - Gestión de Usuarios",
  description: "Aplicación para la gestión de usuarios, desarrollada como parte del Challenge de Dux.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${styles.body} ${geistSans.variable} ${geistMono.variable}`}
      >
        <header className={styles.header}>
          {/* ClientOnly previene errores de hidratación en componentes que dependen del navegador */}
          <ClientOnly fallback={<div className={styles.logoFallback}></div>}>
            <Image src="/logo.png" alt="Logo Dux" width={44} height={43} priority />
          </ClientOnly>
          <Link href="/" className={styles.headerLink} aria-label="Configuración">
            <i className="pi pi-cog"></i>
          </Link>
        </header>

        <div className={styles.contentWrapper}>
          <AppSidebar />
          <main className={styles.main}>
            <ClientOnly fallback={<LoadingSkeleton />}>
              {children}
            </ClientOnly>
          </main>
        </div>
      </body>
    </html>
  );
}
