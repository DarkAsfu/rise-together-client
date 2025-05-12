import { Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "./Provider/AuthProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Rise Together",
  description: "An Online Croudfunding Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased`}
        suppressHydrationWarning
      >
        {/* <h1>Navbar</h1> */}
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* <h1>Footer</h1> */}
      </body>
    </html>
  );
}
