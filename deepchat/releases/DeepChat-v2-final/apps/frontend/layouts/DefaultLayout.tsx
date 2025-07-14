import React, { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

const DefaultLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md p-4">
                {/* Header content goes here */}
                <h1 className="text-xl font-bold">DeepChat</h1>
            </header>
            <main className="p-4">
                {children}
            </main>
            <footer className="text-center p-4 text-gray-500">
                &copy; {new Date().getFullYear()} DeepChat
            </footer>
        </div>
    );
};

export default DefaultLayout; 