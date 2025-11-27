import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase'; 
import { collection, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../componentes/useUserData';
import { X, Shield, Lock, Loader, Eye, LogOut, Users, AlertTriangle, Settings } from 'lucide-react';
import Swal from 'sweetalert2';
import { signOut } from 'firebase/auth'; 
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const Intranet = () => {
  const { user, userData, loading } = useUserData();
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();
  const myRole = userData?.rol || 'usuario'; 

  // --- PROTECCIÓN ---
  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/login'); return; }
    if (myRole !== 'admin' && myRole !== 'editor') {
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'Zona restringida. Redirigiendo...',
        background: '#1e1e1e',
        color: '#fff',
        timer: 2000,
        showConfirmButton: false
      });
      navigate('/');
    }
  }, [user, myRole, loading, navigate]);

  // --- LECTURA DATOS ---
  useEffect(() => {
    const canViewList = myRole === 'admin' || myRole === 'editor';
    if (!user || !canViewList) return;

    const unsubscribe = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsersList(usersData.sort((a, b) => {
        const roleA = a.rol || 'usuario';
        const roleB = b.rol || 'usuario';
        if (roleA === 'admin') return -1;
        if (roleB === 'admin') return 1;
        if (roleA === 'editor') return -1;
        return 1;
      }));
    });
    return () => unsubscribe();
  }, [user, myRole]);

  // --- ACCIONES ---
  const handleRoleChange = async (targetUserId, newRole) => {
    if (myRole !== 'admin') return Swal.fire('Error', 'Solo Admin puede editar.', 'error');
    try {
      await updateDoc(doc(db, "usuarios", targetUserId), { rol: newRole, role: newRole });
      const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: '#333', color: '#fff' });
      Toast.fire({ icon: 'success', title: `Rol actualizado a ${newRole}` });
    } catch (error) { Swal.fire('Error', 'Fallo en base de datos.', 'error'); }
  };

  const handleDeleteUser = async (targetUserId) => {
    if (myRole !== 'admin') return;
    Swal.fire({
      title: '¿Eliminar usuario?', 
      text: "Esta acción es irreversible.",
      icon: 'warning',
      background: '#1e1e1e',
      color: '#fff',
      showCancelButton: true, 
      confirmButtonColor: '#d33', 
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try { await deleteDoc(doc(db, "usuarios", targetUserId)); Swal.fire({title:'Eliminado', icon:'success', background: '#1e1e1e', color: '#fff'}); } 
        catch (error) { Swal.fire('Error', 'No se pudo borrar.', 'error'); }
      }
    });
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (myRole !== 'admin' && myRole !== 'editor') return null; 

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-pink-500 selection:text-white overflow-hidden relative">
        
        {/* Fondo Cibernético (Grid & Glow) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-linear(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-pink-900/20 to-transparent blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
            
            {/* HEADER PANEL DE CONTROL */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
            >
                {/* Barra de acento neón */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-pink-500 via-purple-500 to-blue-500"></div>

                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center shadow-lg">
                            <Shield className="text-pink-500" size={32} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-black rounded-full animate-pulse"></div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Intranet <span className="text-pink-500">Privada</span></h1>
                        <p className="text-gray-400 flex items-center gap-2 mt-1">
                            Bienvenido, <span className="text-white font-semibold">{userData?.nombre || 'Agente'}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${myRole==='admin' ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-blue-500 text-blue-400 bg-blue-500/10'}`}>
                                {myRole}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    {myRole === 'editor' && (
                        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-yellow-500 bg-yellow-500/10 px-3 py-2 rounded-lg border border-yellow-500/20">
                            <Eye size={14} /> READ_ONLY_MODE
                        </div>
                    )}
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-3 bg-red-500/10 hover:bg-red-600 hover:text-white text-red-400 font-medium rounded-xl transition-all duration-300 border border-red-500/20 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] w-full md:w-auto justify-center"
                    >
                        <LogOut size={18} /> <span className="md:hidden lg:inline">Cerrar Sesión</span>
                    </button>
                </div>
            </motion.div>

            {/* TABLA DE USUARIOS */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#0F0F0F] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-linear-to-r from-gray-900 to-black">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="text-gray-400" size={20} /> 
                        Base de Usuarios
                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-md ml-2">{usersList.length}</span>
                    </h2>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-800">
                                <th className="p-5 font-semibold">Usuario</th>
                                <th className="p-5 font-semibold hidden md:table-cell">Identificador</th>
                                <th className="p-5 font-semibold">Nivel de Acceso</th>
                                <th className="p-5 font-semibold text-center">Protocolos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            <AnimatePresence>
                                {usersList.map((u, idx) => {
                                    const userRole = u.rol || 'usuario';
                                    return (
                                        <motion.tr 
                                            key={u.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-white/2 transition-colors group"
                                        >
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <img 
                                                            src={u.avatar || u.foto || `https://ui-avatars.com/api/?name=${u.nombre || 'User'}&background=random&color=fff`} 
                                                            alt="Avatar" 
                                                            className="w-10 h-10 rounded-full bg-gray-800 object-cover ring-2 ring-transparent group-hover:ring-pink-500/50 transition-all"
                                                        />
                                                        {userRole === 'admin' && <div className="absolute -top-1 -right-1 text-yellow-400 bg-black rounded-full p-0.5"><Shield size={10} fill="currentColor"/></div>}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{u.nombre || 'Desconocido'}</p>
                                                        <p className="text-xs text-gray-500 font-mono md:hidden">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td className="p-5 hidden md:table-cell">
                                                <p className="text-xs text-gray-500 font-mono bg-gray-900/50 px-2 py-1 rounded inline-block border border-gray-800">
                                                    {u.email}
                                                </p>
                                            </td>

                                            <td className="p-5">
                                                {myRole === 'admin' ? (
                                                    <div className="relative group/select">
                                                        <select 
                                                            value={userRole} 
                                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                            className={`appearance-none cursor-pointer w-32 pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-black transition-all
                                                                ${userRole === 'admin' ? 'bg-purple-900/20 border-purple-500/30 text-purple-400 focus:ring-purple-500' : 
                                                                  userRole === 'editor' ? 'bg-blue-900/20 border-blue-500/30 text-blue-400 focus:ring-blue-500' : 
                                                                  'bg-gray-800 border-gray-700 text-gray-400 focus:ring-gray-500'}`}
                                                        >
                                                            <option value="admin">Admin</option>
                                                            <option value="editor">Editor</option>
                                                            <option value="usuario">Usuario</option>
                                                        </select>
                                                        <Settings size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover/select:text-white transition-colors"/>
                                                    </div>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                                                        ${userRole === 'admin' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 
                                                          userRole === 'editor' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 
                                                          'bg-gray-800 border-gray-700 text-gray-400'}`}>
                                                        {userRole === 'admin' && <Shield size={10} />}
                                                        {userRole === 'editor' && <Eye size={10} />}
                                                        {userRole === 'usuario' && <Users size={10} />}
                                                        {userRole}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="p-5 text-center">
                                                {myRole === 'admin' ? (
                                                    <button 
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        className="text-gray-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200"
                                                        title="Eliminar Usuario"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                ) : (
                                                    <Lock size={16} className="text-gray-700 mx-auto" />
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                
                {usersList.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <Loader className="mx-auto mb-3 animate-spin" />
                        <p>Cargando datos...</p>
                    </div>
                )}
            </motion.div>

            {/* Footer Simple */}
            <div className="mt-8 text-center text-xs text-gray-600 font-mono">
                <p>SISTEMA SEGURO v2.0 • NOVAGLOW CORP</p>
                <p className="mt-1 opacity-50">Acceso autorizado únicamente.</p>
            </div>

        </div>
    </div>
  );
};

export default Intranet;