import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "../Components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Rise Together",
  description: "An online croudfunding platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* <h1>Navbar</h1>
         */}
         <Navbar/>
        {children}
        <h1>Footer</h1>
      </body>
    </html>
  );
}
