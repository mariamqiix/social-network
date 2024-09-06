import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/nav";
import SearchBar from "./components/search_bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className + " d-flex flex-row h-100"}>
                <Nav />
                <div className="flex-fill h-100 p-2">
                    <SearchBar />
                    {children}
                </div>
            </body>
        </html>
    );
}
