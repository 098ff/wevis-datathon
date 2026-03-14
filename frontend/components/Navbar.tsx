"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navItems = [
    { name: "Overview", href: "#clustering" },
    { name: "Characteristics", href: "#characteristics" },
    { name: "Performance", href: "#performance" },
    { name: "Comments", href: "#comments" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
                    : "bg-transparent py-6"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                <a
                    href="#"
                    onClick={(e) => handleClick(e, "body")}
                    className="font-extrabold text-xl text-slate-900 tracking-tight"
                >
                    พรรค<span className="text-blue-600">teristic</span>
                </a>
                <ul className="hidden md:flex gap-8 items-center">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <a
                                href={item.href}
                                onClick={(e) => handleClick(e, item.href)}
                                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                            >
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="md:hidden flex items-center">
                    {/* Simple mobile menu icon placeholder */}
                    <div className="w-6 h-5 flex flex-col justify-between">
                        <span className="w-full h-0.5 bg-slate-800 rounded-full"></span>
                        <span className="w-full h-0.5 bg-slate-800 rounded-full"></span>
                        <span className="w-full h-0.5 bg-slate-800 rounded-full"></span>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
