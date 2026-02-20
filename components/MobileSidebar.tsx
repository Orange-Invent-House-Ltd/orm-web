import { Menu, X } from 'lucide-react';
import React from 'react';
import Sidebar from './Sidebar';
import { AnimatePresence, motion } from 'framer-motion';
import { useFinanceStore } from '@/store/financeStore';

function MobileSidebar() {
    const { isMobileOpen, setIsMobileOpen } = useFinanceStore();

    return (
        <>
            <button
                className="fixed top-1 right-4 z-50 p-2 rounded-md text-white cursor-pointer"
                onClick={() => setIsMobileOpen(!isMobileOpen)} 
                aria-label="Open sidebar"
            >
                {isMobileOpen ? <X /> : <Menu />} 
            </button>

            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.div
                            className="fixed top-0 right-0 h-full z-50"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 30,
                            }}
                        >
                            <Sidebar />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default MobileSidebar;