import React from "react";
import Header from "@/components/shared/header/header";

export default function PublicLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <header>
                <Header/>
            </header>
            <main>
                {children}
            </main>
        </>
    );
}
