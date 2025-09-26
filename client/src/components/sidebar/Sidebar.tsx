"use client";

import { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import styles from "./Sidebar.module.css";

export default function AppSidebar() {
    const [visible, setVisible] = useState(false);

    const menuItems = [1, 2, 3, 4, 5, 6];

    return (
        <>
        {/* Botón hamburguesa solo en mobile */}
        <div className={styles.mobileToggle}>
            <Button 
            icon="pi pi-bars" 
            onClick={() => setVisible(true)} 
            className="p-button-text" 
            />
        </div>

        {/* Sidebar para mobile */}
        <Sidebar
            visible={visible}
            onHide={() => setVisible(false)}
            className={styles.mobileSidebar}
        >
            <ul className={styles.menuList}>
                {menuItems.map((item) => (
                    <li key={item}>
                        <i className="pi pi-box "></i>
                    </li>
                ))}
            </ul>
        </Sidebar>

        {/* Sidebar fijo para desktop */}
        <aside className={styles.desktopSidebar}>
            <ul className={styles.menuList}>
            {menuItems.map((item) => (
                <li key={item}>
                    <i className="pi pi-box "></i>
                </li>
            ))}
            </ul>
        </aside>
        </>
    );
}

{/* <nav className={styles.sidebar}>
            <ul className={styles.menuList}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <li key={item}>
                  <ClientOnly fallback={<div className={styles.menuItemFallback}></div>}>
                    <Image 
                      className={styles.menuItem}
                      src="/box.svg" 
                      alt={`Menu item ${item}`} 
                      width={20} 
                      height={20}
                      priority={item <= 2}
                    />
                  </ClientOnly>
                </li>
              ))}
            </ul>
          </nav> */}