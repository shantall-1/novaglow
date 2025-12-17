import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase'; 
import { 
  collection, doc, onSnapshot, getDocs, query, where, updateDoc, deleteDoc 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../componentes/useUserData';
import { 
  X, Shield, Loader, Info, ShoppingBag, Heart, Mail, Phone, MapPin, 
  ChevronRight, LogOut, Trash2, Package, Search, Download, Users, Star
} from 'lucide-react';
import { signOut } from 'firebase/auth'; 
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const Intranet = () => {
  const { user, userData, loading } = useUserData();
  const [usersList, setUsersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filterRole, setFilterRole] = useState("todos"); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [extraInfo, setExtraInfo] = useState({ pedidos: [], favoritos: [], loading: false });
  const navigate = useNavigate();
  
  const myRole = userData?.rol || 'usuario'; 

  const isAdmin = myRole === 'admin';
  const isEditor = myRole === 'editor';
  const canAccess = isAdmin || isEditor;

  const renderFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    if (typeof fecha === 'object' && fecha.seconds) {
      return new Date(fecha.seconds * 1000).toLocaleDateString() + ' ' + new Date(fecha.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    return String(fecha);
  };

  useEffect(() => {
    if (loading) return;
    if (!user || !canAccess) navigate('/');
  }, [user, myRole, loading, navigate]);

  useEffect(() => {
    if (!user || !canAccess) return;
    const unsubscribe = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      setUsersList(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, [user, myRole]);

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "todos" || (u.rol || 'usuario') === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: usersList.length,
    admins: usersList.filter(u => u.rol === 'admin').length,
    clientes: usersList.filter(u => !u.rol || u.rol === 'usuario').length
  };

  const exportToCSV = () => {
    const headers = "Nombre,Email,Rol,Telefono\n";
    const csvContent = usersList.map(u => 
      `${u.nombre},${u.email},${u.rol || 'usuario'},${u.telefono || 'N/A'}`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "reporte_clientes_novaglow.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchUserDetails = async (targetUser) => {
    setSelectedUser(targetUser);
    setSelectedOrder(null);
    setExtraInfo({ pedidos: [], favoritos: [], loading: true });

    try {
      const qPedidos = query(collection(db, "pedidos"), where("email", "==", targetUser.email));
      const snapPedidos = await getDocs(qPedidos);
      const snapFavs = await getDocs(collection(db, "favoritos", targetUser.id, "items"));

      setExtraInfo({
        pedidos: snapPedidos.docs.map(d => ({ id: d.id, ...d.data() })),
        favoritos: snapFavs.docs.map(d => ({ id: d.id, ...d.data() })),
        loading: false
      });
    } catch (error) {
      console.error("Error en Firebase:", error);
      setExtraInfo({ pedidos: [], favoritos: [], loading: false });
    }
  };

  const handleRoleChange = async (targetId, newRole) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "usuarios", targetId), { rol: newRole });
      Swal.fire({ title: 'Rol Actualizado', icon: 'success', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
    } catch (e) {
      Swal.fire('Error', 'No se pudo actualizar el rol.', 'error');
    }
  };

  const handleDeleteUser = async (targetId) => {
    if (!isAdmin) return;
    const result = await Swal.fire({
      title: '¿Eliminar Usuario?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff0055',
      confirmButtonText: 'Sí, borrar'
    });
    if (result.isConfirmed) await deleteDoc(doc(db, "usuarios", targetId));
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader className="animate-spin text-pink-500" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 p-4 md:p-12 font-sans selection:bg-pink-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="bg-pink-600 p-3 rounded-2xl shadow-[0_0_15px_rgba(219,39,119,0.4)]">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter">NOVAGLOW <span className="text-pink-500 underline decoration-double">INTRANET</span></h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Panel Maestro de Gestión</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button onClick={exportToCSV} className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-5 py-2.5 rounded-xl text-xs font-black hover:bg-white/10 transition-all">
              <Download size={16} /> EXPORTAR
            </button>
            <button onClick={() => signOut(auth)} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-5 py-2.5 rounded-xl text-xs font-black hover:bg-red-500 hover:text-white transition-all">
              <LogOut size={16} /> SALIR
            </button>
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-linear-to-br from-blue-600/20 to-transparent border border-white/5 p-6 rounded-4xl">
            <Users className="text-blue-500 mb-2" size={20} />
            <p className="text-[10px] text-gray-500 uppercase font-black">Total Usuarios</p>
            <p className="text-3xl font-black text-white">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-transparent border border-white/5 p-6 rounded-[2rem]">
            <Shield className="text-purple-500 mb-2" size={20} />
            <p className="text-[10px] text-gray-500 uppercase font-black">Administradores</p>
            <p className="text-3xl font-black text-white">{stats.admins}</p>
          </div>
          <div className="bg-gradient-to-br from-pink-600/20 to-transparent border border-white/5 p-6 rounded-[2rem]">
            <Star className="text-pink-500 mb-2" size={20} />
            <p className="text-[10px] text-gray-500 uppercase font-black">Clientes Finales</p>
            <p className="text-3xl font-black text-white">{stats.clientes}</p>
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-pink-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 overflow-x-auto w-full md:w-auto">
            {['todos', 'admin', 'editor', 'usuario'].map((role) => (
              <button key={role} onClick={() => setFilterRole(role)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all whitespace-nowrap ${filterRole === role ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-[#0D0D0D] rounded-[2.5rem] border border-gray-800/50 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/40 text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800/50">
                <tr>
                  <th className="p-6">Identidad</th>
                  <th className="p-6">Permisos</th>
                  <th className="p-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/30">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="p-6 flex items-center gap-4">
                      <div className="relative">
                        <img src={u.foto || `https://ui-avatars.com/api/?name=${u.nombre}`} className="w-11 h-11 rounded-full border border-gray-800 group-hover:border-pink-500/50 transition-all" alt="avatar" />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0D0D0D] ${u.rol === 'admin' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{u.nombre}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      {isAdmin ? (
                        <select value={u.rol || 'usuario'} onChange={(e) => handleRoleChange(u.id, e.target.value)} className="bg-black border border-gray-800 text-pink-500 text-[10px] font-black p-2 rounded-xl outline-none">
                          <option value="admin">ADMINISTRADOR</option>
                          <option value="editor">EDITOR (VER)</option>
                          <option value="usuario">CLIENTE FINAL</option>
                        </select>
                      ) : (
                        <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase text-gray-400">
                          {u.rol || 'usuario'}
                        </span>
                      )}
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => fetchUserDetails(u)} className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                          <Info size={18}/>
                        </button>
                        {isAdmin && u.id !== user.uid && (
                          <button onClick={() => handleDeleteUser(u.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 size={18}/>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL DETALLE */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0D0D0D] border border-white/10 w-full max-w-5xl rounded-[3rem] p-8 md:p-12 relative my-auto shadow-2xl">
              
              <button onClick={() => setSelectedUser(null)} className="absolute top-8 right-8 p-3 text-gray-400 hover:text-white bg-white/5 rounded-full transition-all hover:rotate-90"><X size={20}/></button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* COLUMNA IZQUIERDA: PERFIL */}
                <div className="lg:col-span-1 border-r border-white/5 pr-6">
                  <img src={selectedUser.foto || `https://ui-avatars.com/api/?name=${selectedUser.nombre}`} className="w-32 h-32 rounded-[2.5rem] mb-6 border-4 border-white/5 shadow-2xl object-cover" alt="profile" />
                  <h2 className="text-3xl font-black text-white mb-2 leading-none uppercase">{selectedUser.nombre}</h2>
                  <p className="text-pink-500 text-xs font-bold mb-8 tracking-widest uppercase">{selectedUser.rol || 'CLIENTE'}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                      <Mail size={16} className="text-pink-500 flex-shrink-0"/>
                      <div className="flex-1">
                        <p className="text-[9px] text-gray-500 uppercase font-bold">Email</p>
                        <p className="text-xs text-gray-200 truncate w-full">{selectedUser.email}</p>
                      </div>
                    </div>

                    {/* TELEFONO CON WHATSAPP AL LADO */}
                    <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                      <Phone size={16} className="text-pink-500 flex-shrink-0"/>
                      <div className="flex-1">
                        <p className="text-[9px] text-gray-500 uppercase font-bold">Teléfono</p>
                        <p className="text-xs text-gray-200">{selectedUser.telefono || 'N/A'}</p>
                      </div>
                      {selectedUser.telefono && (
                        <a 
                          href={`https://wa.me/${selectedUser.telefono.replace(/\s+/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                        >
                          <Phone size={14} />
                        </a>
                      )}
                    </div>

                    {/* NOTAS INTERNAS */}
                    <div className="mt-8 p-5 bg-[#151510] border border-yellow-500/10 rounded-[2rem]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                        <p className="text-[10px] text-yellow-500 uppercase font-black tracking-widest">Notas Internas</p>
                      </div>
                      <textarea 
                        placeholder="Agregar observación..."
                        className="w-full bg-transparent text-[11px] text-gray-400 outline-none resize-none h-24 custom-scrollbar leading-relaxed"
                        onBlur={async (e) => {
                          await updateDoc(doc(db, "usuarios", selectedUser.id), { notasInternas: e.target.value });
                          Swal.fire({ title: 'Nota guardada', icon: 'success', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
                        }}
                        defaultValue={selectedUser.notasInternas || ""}
                      />
                    </div>
                  </div>
                </div>

                {/* COLUMNA DERECHA: HISTORIAL Y WISHLIST */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
                    <h3 className="text-white font-black text-sm uppercase flex items-center gap-3 mb-6"><ShoppingBag size={18} className="text-blue-500"/> Historial de Compras</h3>
                    
                    {!selectedOrder ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-3 custom-scrollbar">
                        {extraInfo.pedidos.map(p => (
                          <div key={p.id} onClick={() => setSelectedOrder(p)} className="flex justify-between items-center p-5 bg-black/60 rounded-2xl border border-white/5 hover:border-blue-500/40 cursor-pointer transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 group-hover:bg-blue-500 transition-all"><Package size={18}/></div>
                                <div><p className="text-[10px] text-gray-500 uppercase font-mono">{p.id.substring(0,8)}</p><p className="text-xs text-white font-bold">{renderFecha(p.creadoEn)}</p></div>
                            </div>
                            <div className="text-right flex items-center gap-5">
                                <div><p className="text-sm font-black text-green-400">S/ {p.total}</p><p className="text-[9px] text-gray-500 uppercase">{p.metodoPago}</p></div>
                                <ChevronRight size={18} className="text-gray-700 group-hover:text-white transition-all"/>
                            </div>
                          </div>
                        ))}
                        {extraInfo.pedidos.length === 0 && <p className="text-center py-6 text-gray-600 text-xs italic">Sin pedidos registrados.</p>}
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-blue-500/[0.03] p-6 rounded-2xl border border-blue-500/20">
                        <button onClick={() => setSelectedOrder(null)} className="text-[10px] text-blue-400 font-black mb-4 uppercase flex items-center gap-2">← Volver al listado</button>
                        <div className="space-y-3">
                          {selectedOrder.productos?.map((prod, i) => (
                            <div key={i} className="flex justify-between items-center text-xs p-2 bg-white/5 rounded-lg">
                              <span className="text-gray-300">{prod.nombre || prod.name} <span className="text-pink-500 font-black ml-2">x{prod.cantidad}</span></span>
                              <span className="text-white font-bold">S/ {prod.precio}</span>
                            </div>
                          ))}
                          <div className="pt-4 mt-2 border-t border-white/5 flex justify-between font-black text-green-400 px-2">
                            <span className="text-xs uppercase">Total del Pedido</span>
                            <span>S/ {selectedOrder.total}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
                    <h3 className="text-white font-black text-sm uppercase flex items-center gap-3 mb-6"><Heart size={18} className="text-pink-500"/> Wishlist (Favoritos)</h3>
                    <div className="flex flex-wrap gap-3">
                      {extraInfo.favoritos.map(f => (
                        <div key={f.id} className="flex items-center gap-3 p-3 bg-pink-500/5 border border-pink-500/10 rounded-2xl">
                          <img src={f.image} className="w-10 h-10 rounded-xl object-cover" alt="fav" />
                          <span className="text-[10px] text-pink-400 font-black uppercase max-w-[120px] truncate">{f.name}</span>
                        </div>
                      ))}
                      {extraInfo.favoritos.length === 0 && <p className="text-gray-600 text-xs italic">Aún no tiene productos favoritos.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #db2777; }
      `}</style>
    </div>
  );
};

export default Intranet;