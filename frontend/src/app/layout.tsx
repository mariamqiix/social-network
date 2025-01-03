'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/nav";
import SearchBar from "./components/search_bar";
import Toasts from "./components/toast";
import { Provider } from "react-redux";
import store from "./redux/store";
import Metadata from "./components/Metadata";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationsBox from "./components/Notifications";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " d-flex flex-sm-row h-100 flex-column-reverse"}>
        <Metadata seoTitle="Friendz" seoDescription="The next gen social network" />
        <Provider store={store}>
          <Nav />
          <div className="flex-fill h-100 p-2">
            <div className="d-flex flex-row-reverse">
              {/* <SearchBar /> */}
              <NotificationsBox />
            </div>
            {children}
          </div>
          {/* <Toasts /> */}
        </Provider>
      </body>
    </html>
  );
}
