import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Package,
    ArrowRightLeft,
    LogOut,
    Menu,
    X,
    User,
    Settings,
    ChevronRight,
    History,
    BarChart3,
    Sparkles,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const SidebarItem = ({ icon: Icon, label, path, active, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const iconColors = {
        '/': 'from-blue-500 to-cyan-500',
        '/products': 'from-purple-500 to-pink-500',
        '/operations': 'from-emerald-500 to-teal-500',
        '/reports': 'from-amber-500 to-orange-500',
        '/settings': 'from-slate-500 to-slate-600'
    };

    const gradient = iconColors[path] || 'from-indigo-500 to-purple-500';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link
                to={path}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={clsx(
                    "relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden",
                    active
                        ? "bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-indigo-600/30 text-white shadow-2xl shadow-indigo-500/20 border border-indigo-500/40"
                        : "text-slate-400 hover:bg-white/5 hover:text-white hover:border-white/10 border border-transparent"
                )}
            >
                {/* Active state glow */}
                {active && (
                    <>
                        <motion.div
                            layoutId="active-glow"
                            className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 blur-xl"
                            transition={{ duration: 0.3 }}
                        />
                        <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r-full"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    </>
                )}

                {/* Icon with gradient background */}
                <motion.div
                    className={clsx(
                        "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                        active
                            ? `bg-gradient-to-br ${gradient} shadow-lg shadow-indigo-500/30`
                            : "bg-white/5 group-hover:bg-white/10 border border-white/10 group-hover:border-white/20"
                    )}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {active && (
                        <motion.div
                            className="absolute inset-0 bg-white/20 rounded-xl"
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    )}
                    <Icon className={clsx(
                        "w-5 h-5 relative z-10 transition-all duration-300",
                        active ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                    )} />
                    {active && (
                        <motion.div
                            className="absolute -top-1 -right-1"
                            animate={{ 
                                rotate: [0, 360],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{ 
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                        </motion.div>
                    )}
                </motion.div>

                {/* Label */}
                <span className={clsx(
                    "font-semibold relative z-10 transition-all duration-300",
                    active ? "text-white" : "group-hover:text-white"
                )}>
                    {label}
                </span>

                {/* Active indicator dot */}
                {active && (
                    <motion.div
                        className="ml-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]" />
                    </motion.div>
                )}

                {/* Hover arrow */}
                {!active && isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="ml-auto"
                    >
                        <ChevronRight className="w-4 h-4 text-indigo-400" />
                    </motion.div>
                )}
            </Link>
        </motion.div>
    );
};

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Package, label: 'Products', path: '/products' },
        { icon: ArrowRightLeft, label: 'Operations', path: '/operations' },
        { icon: BarChart3, label: 'Reports', path: '/reports' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-100 flex selection:bg-indigo-500/30">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-80 border-r border-white/10 bg-gradient-to-b from-slate-950/95 via-slate-950/90 to-slate-950/95 backdrop-blur-3xl fixed h-full z-20 shadow-2xl">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
                </div>

                <div className="relative z-10 p-6 pb-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 backdrop-blur-xl"
                    >
                        <motion.div
                            className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 group overflow-hidden"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-white/30"
                                animate={{ 
                                    rotate: [0, 360],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ 
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                            <Package className="w-7 h-7 text-white relative z-10 drop-shadow-lg" />
                            <motion.div
                                className="absolute -top-1 -right-1"
                                animate={{ 
                                    rotate: [0, 360],
                                    scale: [1, 1.3, 1]
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Zap className="w-4 h-4 text-yellow-400 drop-shadow-lg" />
                            </motion.div>
                        </motion.div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-black bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent tracking-tight mb-1">
                                StockMaster
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Inventory System</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <nav className="relative z-10 flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="px-4 mb-4"
                    >
                        <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Navigation</p>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                        </div>
                    </motion.div>
                    {navItems.map((item, index) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                            index={index}
                        />
                    ))}
                </nav>

                <div className="relative z-10 p-4 border-t border-white/10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link 
                            to="/profile" 
                            className="relative flex items-center gap-4 px-4 py-4 rounded-2xl bg-gradient-to-br from-white/5 via-white/5 to-white/0 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group cursor-pointer overflow-hidden"
                        >
                            {/* Hover gradient effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <motion.div
                                className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 flex items-center justify-center border border-indigo-500/30 group-hover:border-indigo-500/50 transition-all duration-300"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <User className="w-6 h-6 text-indigo-300 group-hover:text-white transition-colors" />
                                <motion.div
                                    className="absolute inset-0 rounded-xl bg-white/10"
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>
                            <div className="flex-1 min-w-0 relative z-10">
                                <p className="text-sm font-bold truncate text-slate-200 group-hover:text-white transition-colors mb-0.5">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-slate-500 truncate group-hover:text-slate-400 transition-colors">
                                    {user?.email}
                                </p>
                            </div>
                            <motion.button
                                onClick={(e) => {
                                    e.preventDefault();
                                    logout();
                                }}
                                className="relative z-10 p-2.5 hover:bg-red-500/20 rounded-xl text-slate-400 hover:text-red-400 transition-all duration-300 group/btn"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-white">StockMaster</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:text-white">
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden fixed inset-0 z-20 bg-slate-950 pt-20 px-4 pb-6 flex flex-col"
                    >
                        <nav className="space-y-2 flex-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-4 rounded-xl border transition-all",
                                        location.pathname === item.path
                                            ? "bg-indigo-600/20 text-white border-indigo-500/30"
                                            : "bg-white/5 text-slate-400 border-transparent"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                    <ChevronRight className="ml-auto w-4 h-4 opacity-50" />
                                </Link>
                            ))}

                            <Link
                                to="/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-4 rounded-xl border border-transparent bg-white/5 text-slate-400 mt-4"
                            >
                                <User className="w-5 h-5" />
                                <span className="font-medium">My Profile</span>
                                <ChevronRight className="ml-auto w-4 h-4 opacity-50" />
                            </Link>
                        </nav>

                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 mt-auto"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 md:pl-72 pt-20 md:pt-0 min-h-screen transition-all duration-300">
                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
