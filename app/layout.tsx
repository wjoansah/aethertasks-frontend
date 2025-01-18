import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {CognitoAuthProvider} from "@/providers/CognitoAuthProvider";
import {AppProvider} from "@/app/providers/appContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AetherTasks",
    description: "Tasks managed in the cloud.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AppProvider>
            <CognitoAuthProvider>
                <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                {children}
                </body>
                </html>
            </CognitoAuthProvider>
        </AppProvider>
    );
}
