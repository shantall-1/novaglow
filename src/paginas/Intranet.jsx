import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase'; 
import { collection, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../componentes/useUserData';
import { X, Shield, Lock, Loader, Eye, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';
import { signOut } from 'firebase/auth'; // Necesario para logout
import { auth } from '../lib/firebase';

const Intranet = () => {
  // 1. Usamos el Hook Global para saber QUIÉN soy yo en tiempo real
  const { user, userData, loading } = useUserData();
  
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();

  // Definimos mi rol actual desde el hook
  // Basado en tu imagen de Firebase, el campo se llama 'rol'
  const myRole = userData?.rol || 'usuario'; 

  // --- 2. PROTECCIÓN DE RUTA ---
  useEffect(() => {
    if (loading) return;

    // A. Si no estoy logueado -> Login
    if (!user) {
      navigate('/login'); // O la ruta de tu login
      return;
    }

    // B. Si soy usuario normal -> Pa' fuera (Redirect al home)
    if (myRole !== 'admin' && myRole !== 'editor') {
      Swal.fire({
        icon: 'error',
        title: 'Acceso Restringido',
        text: 'No tienes permisos para estar aquí.',
        timer: 3000,
        showConfirmButton: false
      });
      navigate('/');
    }
  }, [user, myRole, loading, navigate]);


  // --- 3. LEER LISTA DE TODOS LOS USUARIOS (Tiempo Real) ---
  useEffect(() => {
    // Solo admins y editores pueden leer esta lista
    const canViewList = myRole === 'admin' || myRole === 'editor';
    if (!user || !canViewList) return;

    const unsubscribe = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
      // Ordenar: Admin > Editor > Usuario
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


  // --- 4. ACCIONES ---

  const handleRoleChange = async (targetUserId, newRole) => {
    // PROTECCIÓN: Solo admin puede editar
    if (myRole !== 'admin') {
      Swal.fire('Alto ahí', 'Solo los Administradores pueden cambiar roles.', 'error');
      return;
    }

    try {
      const targetUserRef = doc(db, "usuarios", targetUserId);
      // Actualizamos 'rol' (según tu imagen) y 'role' por si acaso tienes legacy code
      await updateDoc(targetUserRef, { rol: newRole, role: newRole });
      
      const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      Toast.fire({ icon: 'success', title: `Rol actualizado a ${newRole}` });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar la base de datos.', 'error');
    }
  };

  const handleDeleteUser = async (targetUserId) => {
    // PROTECCIÓN: Solo admin puede borrar
    if (myRole !== 'admin') {
      Swal.fire('Acceso Denegado', 'Solo los Administradores pueden eliminar.', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?', 
      text: "Eliminarás a este usuario permanentemente.",
      icon: 'warning',
      showCancelButton: true, 
      confirmButtonColor: '#d33', 
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "usuarios", targetUserId));
          Swal.fire('Eliminado', 'El usuario ha sido borrado.', 'success');
        } catch (error) {
          Swal.fire('Error', 'Error al eliminar.', 'error');
        }
      }
    });
  };

  const handleLogout = async () => {
      await signOut(auth);
      navigate('/');
  };

  // --- RENDERIZADO ---

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader className="animate-spin text-purple-500" size={40}/></div>;

  // Si por alguna razón el useEffect de redirección tarda ms, mostramos esto o null
  if (myRole !== 'admin' && myRole !== 'editor') return null; 

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
            {/* Header del Panel */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg gap-4">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${myRole === 'admin' ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                        <Shield className={myRole === 'admin' ? 'text-purple-400' : 'text-blue-400'} size={32}/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Panel de Control (Intranet)</h1>
                        <p className="text-sm text-slate-400 flex items-center gap-2">
                            Tu rol: 
                            <span className={`font-bold uppercase px-2 py-0.5 rounded text-xs ${myRole==='admin'?'bg-purple-600 text-white':'bg-blue-600 text-white'}`}>
                                {myRole}
                            </span>
                        </p>
                    </div>
                </div>
                
                {/* Aviso para editores */}
                {myRole === 'editor' && (
                    <div className="bg-blue-900/30 border border-blue-800 px-4 py-2 rounded-lg flex items-center gap-2 text-blue-200 text-sm">
                        <Eye size={16}/> Modo Lectura: Puedes ver, pero no tocar.
                    </div>
                )}

                <button onClick={handleLogout} className="bg-red-500/10 text-red-400 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition flex items-center gap-2 border border-red-500/20">
                    <LogOut size={16}/> Salir
                </button>
            </div>
            
            {/* Tabla de Usuarios */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs font-semibold tracking-wider">
                            <tr>
                                <th className="p-4 pl-6">Usuario</th>
                                <th className="p-4 hidden md:table-cell">Email</th>
                                <th className="p-4">Rol / Permisos</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {usersList.map(u => {
                                const userRole = u.rol || 'usuario'; // Aseguramos usar 'rol'
                                
                                return (
                                    <tr key={u.id} className="hover:bg-slate-800/40 transition group">
                                        <td className="p-4 pl-6 flex items-center gap-3">
                                            <img 
                                                src={u.avatar || u.foto || `https://ui-avatars.com/api/?name=${u.nombre || 'U'}&background=random`} 
                                                className="w-10 h-10 rounded-full bg-slate-700 object-cover border border-slate-600"
                                                alt="avatar"
                                            />
                                            <div>
                                                <p className="font-medium text-slate-200">{u.nombre || 'Sin nombre'}</p>
                                                <p className="text-xs text-slate-500 md:hidden">{u.email}</p>
                                            </div>
                                        </td>
                                        
                                        <td className="p-4 text-slate-400 hidden md:table-cell font-mono text-xs">
                                            {u.email}
                                        </td>

                                        <td className="p-4">
                                            {/* Si soy Admin, muestro el Select. Si soy Editor, muestro texto plano */}
                                            {myRole === 'admin' ? (
                                                <div className="relative inline-block">
                                                    <select 
                                                        value={userRole} 
                                                        onChange={(e)=>handleRoleChange(u.id, e.target.value)}
                                                        className="appearance-none cursor-pointer bg-slate-800 border border-slate-700 text-white font-bold py-1.5 px-3 pr-8 rounded-lg hover:bg-slate-700 focus:outline-none focus:border-purple-500 transition"
                                                    >
                                                        <option value="admin">Admin</option>
                                                        <option value="editor">Editor</option>
                                                        <option value="usuario">Usuario</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                                                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className={`px-3 py-1 rounded text-xs font-bold uppercase
                                                    ${userRole === 'admin' ? 'bg-purple-900 text-purple-300' : 
                                                      userRole === 'editor' ? 'bg-blue-900 text-blue-300' : 
                                                      'bg-slate-800 text-slate-400'}`}>
                                                    {userRole}
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-4 text-center">
                                            {myRole === 'admin' ? (
                                                <button 
                                                    onClick={()=>handleDeleteUser(u.id)} 
                                                    className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition tooltip"
                                                    title="Eliminar Usuario"
                                                >
                                                    <X size={18}/>
                                                </button>
                                            ) : (
                                                <span title="Solo lectura" className="text-slate-600 cursor-not-allowed">
                                                    <Lock size={16} />
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Intranet;