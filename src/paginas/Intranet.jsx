import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { Pencil, X, Shield, LogOut, Lock, Loader, UserCheck, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

const Intranet = () => {
  const [user, loading] = useAuthState(auth);
  const [usersList, setUsersList] = useState([]);
  
  // Guardamos el rol del usuario logueado
  const [myRole, setMyRole] = useState(null); 
  const [checkingPermission, setCheckingPermission] = useState(true);

  const navigate = useNavigate();

  // --- 1. VERIFICAR PERMISOS (CONECTADO A FIREBASE) ---
  useEffect(() => {
    if (loading) return;
    
    if (!user) {
        setCheckingPermission(false);
        return;
    }

    const verifyRoleFromDB = async () => {
        try {
            const userDocRef = doc(db, "usuarios", user.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                // Detectamos rol en inglés o español
                const detectedRole = userData.role || userData.rol || 'usuario';
                setMyRole(detectedRole);
            } else {
                setMyRole('sin_registro'); 
            }
        } catch (error) {
            console.error("Error leyendo rol:", error);
            setMyRole('error');
        }
        setCheckingPermission(false);
    };

    verifyRoleFromDB();
  }, [user, loading]);

  // --- 2. LEER LISTA EN TIEMPO REAL (onSnapshot) ---
  useEffect(() => {
    // Solo cargamos la lista si tienes permiso de ver (Admin o Editor)
    const canViewIntranet = myRole === 'admin' || myRole === 'editor';
    
    if (!user || !canViewIntranet) return;

    // Suscripción en tiempo real a la colección
    const unsubscribe = onSnapshot(collection(db, "usuarios"), (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        
        // Ordenar: Admins arriba, luego Editores, luego Usuarios
        setUsersList(usersData.sort((a, b) => {
            const roleA = a.role || a.rol || 'usuario';
            const roleB = b.role || b.rol || 'usuario';
            if (roleA === 'admin') return -1;
            if (roleB === 'admin') return 1;
            if (roleA === 'editor') return -1;
            return 1;
        }));
    });

    return () => unsubscribe();
  }, [myRole, user]);

  // --- 3. ACCIONES (SOLO ADMIN) ---
  
  const handleRoleChange = async (userId, newRole) => {
    // Bloqueo de seguridad extra en código
    if (myRole !== 'admin') {
        Swal.fire('Acceso Denegado', 'Solo los Administradores pueden cambiar roles.', 'error');
        return;
    }

    try {
      const userRef = doc(db, "usuarios", userId);
      // Actualizamos ambas versiones para compatibilidad total
      await updateDoc(userRef, { role: newRole, rol: newRole });
      
      const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      Toast.fire({ icon: 'success', title: `Rol actualizado a ${newRole}` });
    } catch (error) {
      Swal.fire('Error', 'No tienes permisos en Firebase.', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (myRole !== 'admin') {
        Swal.fire('Acceso Denegado', 'Solo los Administradores pueden eliminar.', 'error');
        return;
    }

    Swal.fire({
      title: '¿Eliminar usuario?', 
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true, 
      confirmButtonColor: '#d33', 
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "usuarios", userId));
          Swal.fire('Eliminado', 'El usuario ha sido borrado.', 'success');
        } catch (error) {
          Swal.fire('Error', 'No se pudo borrar (Revisa reglas).', 'error');
        }
      }
    });
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  // --- 4. RENDERIZADO ---

  if (loading || checkingPermission) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader className="animate-spin text-purple-500" size={40}/></div>;

  // A. NO LOGUEADO
  if (!user) return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-white text-2xl mb-4 font-bold">Intranet NovaGlow</h1>
        <p className="text-slate-400 mb-6">Debes iniciar sesión para ver este panel.</p>
        <button onClick={() => navigate('/')} className="bg-purple-600 text-white px-6 py-2 rounded shadow-lg hover:bg-purple-500 transition">Volver al Inicio</button>
      </div>
  );

  // B. ROL USUARIO (ACCESO DENEGADO)
  // Si eres "usuario", no ves nada, solo este mensaje.
  if (myRole !== 'admin' && myRole !== 'editor') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
        <Lock size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white">Acceso Restringido</h1>
        <p className="text-slate-400 mt-2 max-w-md">
            Hola <span className="text-white font-semibold">{user.displayName || user.email}</span>.
            <br/>
            Tu rol actual es <span className="text-yellow-400 font-bold uppercase">{myRole || 'USUARIO'}</span>.
            <br/>
            Esta sección es exclusiva para el Staff de NovaGlow.
        </p>
        <button onClick={handleLogout} className="mt-8 bg-slate-800 border border-slate-700 text-white px-6 py-2 rounded hover:bg-red-900/30 transition flex items-center gap-2 mx-auto">
            <LogOut size={18}/> Cerrar Sesión
        </button>
      </div>
    );
  }

  // C. PANEL PARA ADMIN Y EDITOR
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg gap-4">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${myRole === 'admin' ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                        <Shield className={myRole === 'admin' ? 'text-purple-400' : 'text-blue-400'} size={32}/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Panel de Control</h1>
                        <p className="text-sm text-slate-400 flex items-center gap-2">
                            Rol actual: 
                            <span className={`font-bold uppercase px-2 py-0.5 rounded text-xs ${myRole==='admin'?'bg-purple-600 text-white':'bg-blue-600 text-white'}`}>
                                {myRole}
                            </span>
                        </p>
                    </div>
                </div>
                
                {/* Mensaje informativo para el Editor */}
                {myRole === 'editor' && (
                    <div className="bg-blue-900/30 border border-blue-800 px-4 py-2 rounded-lg flex items-center gap-2 text-blue-200 text-sm">
                        <Eye size={16}/> Modo Lectura: No puedes editar ni borrar.
                    </div>
                )}

                <button onClick={handleLogout} className="bg-red-500/10 text-red-400 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition flex items-center gap-2 border border-red-500/20">
                    <LogOut size={16}/> Salir
                </button>
            </div>
            
            {/* Tabla */}
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
                                // Unificamos el rol (rol o role)
                                const currentRole = u.role || u.rol || 'usuario';
                                
                                return (
                                    <tr key={u.id} className="hover:bg-slate-800/40 transition group">
                                        <td className="p-4 pl-6 flex items-center gap-3">
                                            <div className="relative">
                                                <img 
                                                    src={u.avatar || u.foto || `https://ui-avatars.com/api/?name=${u.nombre || 'U'}&background=random`} 
                                                    className="w-10 h-10 rounded-full bg-slate-700 object-cover border border-slate-600"
                                                    alt="avatar"
                                                />
                                                {/* Indicador visual de admin en el avatar */}
                                                {currentRole === 'admin' && (
                                                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white p-0.5 rounded-full border-2 border-slate-900" title="Administrador">
                                                        <Shield size={8} fill="currentColor"/>
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-200">{u.nombre || u.displayName || 'Sin nombre'}</p>
                                                <p className="text-xs text-slate-500 md:hidden">{u.email}</p>
                                            </div>
                                        </td>
                                        
                                        <td className="p-4 text-slate-400 hidden md:table-cell font-mono text-xs">
                                            {u.email}
                                        </td>

                                        <td className="p-4">
                                            {/* SELECTOR DE ROLES */}
                                            {/* Si soy ADMIN: Puedo usar el select */}
                                            {/* Si soy EDITOR: El select está disabled y se ve más apagado */}
                                            <div className="relative inline-block">
                                                <select 
                                                    value={currentRole} 
                                                    onChange={(e)=>handleRoleChange(u.id, e.target.value)}
                                                    disabled={myRole !== 'admin'} 
                                                    className={`
                                                        appearance-none font-bold outline-none py-1.5 px-3 pr-8 rounded-lg transition border
                                                        ${myRole !== 'admin' ? 'cursor-not-allowed opacity-70 border-transparent' : 'cursor-pointer border-slate-700 hover:bg-slate-800'}
                                                        ${currentRole==='admin' ? 'text-purple-400 bg-purple-500/10' : 
                                                          currentRole==='editor' ? 'text-blue-400 bg-blue-500/10' : 
                                                          'text-slate-400 bg-slate-800'}
                                                    `}
                                                >
                                                    <option value="admin" className="bg-slate-900 text-purple-400">Admin</option>
                                                    <option value="editor" className="bg-slate-900 text-blue-400">Editor</option>
                                                    <option value="usuario" className="bg-slate-900 text-slate-400">Usuario</option>
                                                </select>
                                                {/* Flechita personalizada solo si es admin */}
                                                {myRole === 'admin' && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-4 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                {/* Si soy ADMIN: Veo el botón de eliminar */}
                                                {myRole === 'admin' ? (
                                                    <button 
                                                        onClick={()=>handleDeleteUser(u.id)} 
                                                        className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition tooltip"
                                                        title="Eliminar Usuario"
                                                    >
                                                        <X size={18}/>
                                                    </button>
                                                ) : (
                                                    /* Si soy EDITOR: Veo un candadito o texto "Solo ver" */
                                                    <span className="text-xs text-slate-600 flex items-center gap-1 cursor-help" title="No tienes permisos para eliminar">
                                                        <Lock size={12}/>
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    
                    {usersList.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            No se encontraron usuarios.
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Intranet;