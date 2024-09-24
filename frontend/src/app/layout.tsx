'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/nav";
import SearchBar from "./components/search_bar";
import Toasts from "./components/toast";
import { Provider } from "react-redux";
import store from "./redux/store";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Friendz",
  description: "The next gen social network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " d-flex flex-row h-100"}>
        <Provider store={store}>
          <Nav />
          <div className="flex-fill h-100 p-2">
            <SearchBar />
            {children}
          </div>
          <Toasts />
        </Provider>
      </body>
    </html>
  );
}
