import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pack Navideño | RenderDevo",
  description: "Gráficos navideños personalizados gratis. Descarga 6 diseños para tu negocio.",
  openGraph: {
    title: "Pack Navideño | RenderDevo",
    description: "Gráficos navideños personalizados gratis",
    url: "https://navidadcon.renderdevo.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}