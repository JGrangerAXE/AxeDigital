import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
export const metadata:Metadata={metadataBase:new URL("https://axebuild.com"),title:{default:"Axe Build, LLC | Build Something Real",template:"%s | Axe Build, LLC"},description:"Construction and fabrication careers and capabilities at Axe Build, LLC.",openGraph:{title:"Axe Build, LLC",description:"Build something real.",url:"https://axebuild.com",siteName:"Axe Build, LLC",type:"website"},robots:{index:true,follow:true}};
export const viewport:Viewport={themeColor:"#0b1724",width:"device-width",initialScale:1};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><a href="#main-content" className="fixed left-3 top-3 z-[100] -translate-y-24 bg-white px-4 py-3 font-bold text-[var(--background-deep)] transition-transform focus:translate-y-0">Skip to content</a><Header/><main id="main-content">{children}</main><Footer/></body></html>}
