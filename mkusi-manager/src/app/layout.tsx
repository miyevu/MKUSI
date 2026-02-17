'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import { ProductProvider } from '@/context/ProductContext';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Add suppressHydrationWarning here 👇 */}
      <body className={inter.className} suppressHydrationWarning={true}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <ProductProvider>
              {children}
            </ProductProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}