import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, deleteDoc, doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { X, Shield, LogOut, Lock, Loader, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

// --- INICIALIZACIÓN DE FIREBASE ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Intranet = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [usersList, setUsersList] = useState([]);
  const [myRole, setMyRole] = useState(null); 
  const [checkingPermission, setCheckingPermission] = useState(true);

  const navigate = useNavigate();

  // 1. AUTENTICACIÓN
  useEffect(() => {
    const initAuth = async () => {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
        } else {
            await signInAnonymously(auth);
        }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. VERIFICAR PERMISOS (TIEMPO REAL)
  useEffect(() => {
    if (loadingUser) return;
    
    // Si no está logueado, fuera
    if (!user) {
        navigate('/'); 
        return;
    }

    const userRef = doc(db, "usuarios", user.uid);
    
    // onSnapshot: Si alguien cambia tu rol en la DB, te enteras al instante
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const detectedRole = userData.rol || userData.role || 'usuario'; 
            setMyRole(detectedRole);

            // SEGURIDAD: Si no es admin ni editor, bloqueamos la visualización de datos
            if (detectedRole !== 'admin' && detectedRole !== 'editor') {
                // No redirigimos inmediatamente para mostrar el mensaje de "Acceso Denegado"
                setCheckingPermission(false); 
            } else {
                setCheckingPermission(false);
            }
        } else {
            setMyRole('sin_registro');
            setCheckingPermission(false);
        }
    }, (error) => {
        console.error("Error verificando permisos:", error);
        setCheckingPermission(false);
    });

    return () => unsubscribe();
  }, [user, loadingUser, navigate]);

  // 3. LEER LISTA DE USUARIOS (SOLO ADMIN/EDITOR)
  useEffect(() => {
    const canViewIntranet = myRole === 'admin' || myRole === 'editor';
    
    if (!user || !canViewIntranet) return;

    // Escuchar toda la colección de usuarios
    const unsubscribe = onSnapshot(collection(db, "usuarios"), (snapshot) => {
        const usersData = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        
        // Ordenar: Admins primero, luego Editores
        setUsersList(usersData.sort((a, b) => {
            const roleA = a.rol || a.role || 'usuario';
            const roleB = b.rol || b.role || 'usuario';
            if (roleA === 'admin') return -1;
            if (roleB === 'admin') return 1;
            if (roleA === 'editor') return -1;
            return 1;
        }));
    });

    return () => unsubscribe();
  }, [myRole, user]);

  // 4. ACCIONES (SOLO ADMIN)
  const handleRoleChange = async (userId, newRole) => {
    if (myRole !== 'admin') {
        Swal.fire('Acceso Denegado', 'Solo los Administradores pueden editar roles.', 'error');
        return;
    }

    try {
      const userRef = doc(db, "usuarios", userId);
      // Actualizamos ambos campos para consistencia
      await updateDoc(userRef, { rol: newRole, role: newRole });
      
      const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      Toast.fire({ icon: 'success', title: `Rol actualizado a ${newRole}` });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar.', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (myRole !== 'admin') return;

    Swal.fire({
      title: '¿Eliminar usuario?', 
      text: "Esta acción borrará al usuario permanentemente.",
      icon: 'warning',
      showCancelButton: true, 
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6', 
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "usuarios", userId));
          Swal.fire('Eliminado', 'El usuario ha sido borrado.', 'success');
        } catch (error) {
          Swal.fire('Error', 'No se pudo borrar.', 'error');
        }
      }
    });
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  // --- RENDERIZADO ---

  if (loadingUser || checkingPermission) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader className="animate-spin text-purple-500" size={40}/>
    </div>
  );

  // A. VISTA DE BLOQUEO (PARA USUARIOS NORMALES)
  if (myRole !== 'admin' && myRole !== 'editor') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
        <Lock size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white">Acceso Restringido</h1>
        <p className="text-slate-400 mt-2 max-w-md">
            Tu rol actual es <span className="text-yellow-400 font-bold uppercase">{myRole || 'INVITADO'}</span>.
            <br/> Esta zona es exclusiva para el staff.
        </p>
        <button onClick={() => navigate('/')} className="mt-8 bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-700 transition flex items-center gap-2 mx-auto">
            Volver al Inicio
        </button>
      </div>
    );
  }

  // B. VISTA DE INTRANET (ADMIN Y EDITOR)
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
                            Hola, {user.displayName || user.email?.split('@')[0] || 'Admin'}
                            <span className={`font-bold uppercase px-2 py-0.5 rounded text-[10px] tracking-wider border ${myRole==='admin'?'bg-purple-600/20 border-purple-500 text-purple-200':'bg-blue-600/20 border-blue-500 text-blue-200'}`}>
                                {myRole}
                            </span>
                        </p>
                    </div>
                </div>
                
                {/* Aviso para el Editor */}
                {myRole === 'editor' && (
                    <div className="bg-blue-900/20 border border-blue-500/30 px-4 py-2 rounded-lg flex items-center gap-2 text-blue-300 text-sm animate-pulse">
                        <Eye size={16}/> Modo Lectura: No puedes editar datos
                    </div>
                )}

                <button onClick={handleLogout} className="bg-red-500/10 text-red-400 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition flex items-center gap-2 border border-red-500/20">
                    <LogOut size={16}/> Salir
                </button>
            </div>
            
            {/* Tabla */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs font-semibold tracking-wider">
                            <tr>
                                <th className="p-4 pl-6">Usuario</th>
                                <th className="p-4 hidden md:table-cell">Email</th>
                                <th className="p-4">Rol</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {usersList.map(u => {
                                const currentRole = u.rol || u.role || 'usuario';
                                
                                return (
                                    <tr key={u.id} className="hover:bg-slate-800/40 transition group">
                                        <td className="p-4 pl-6 flex items-center gap-3">
                                            <div className="relative">
                                                <img 
                                                    src={u.foto || `https://ui-avatars.com/api/?name=${u.nombre || 'U'}&background=random&color=fff`} 
                                                    className="w-10 h-10 rounded-full bg-slate-700 object-cover border border-slate-600"
                                                    alt="avatar"
                                                />
                                                {currentRole === 'admin' && (
                                                    <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-0.5 border-2 border-slate-900">
                                                        <Shield size={8} className="text-white"/>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-200">{u.nombre || 'Sin nombre'}</p>
                                                <p className="text-xs text-slate-500 md:hidden">{u.email}</p>
                                            </div>
                                        </td>
                                        
                                        <td className="p-4 text-slate-400 hidden md:table-cell font-mono text-xs">
                                            {u.email}
                                        </td>

                                        <td className="p-4">
                                            <div className="relative inline-block w-32">
                                                <select 
                                                    value={currentRole} 
                                                    onChange={(e)=>handleRoleChange(u.id, e.target.value)}
                                                    disabled={myRole !== 'admin'} 
                                                    className={`
                                                        w-full appearance-none font-bold outline-none py-1.5 px-3 pr-8 rounded-lg transition border text-xs uppercase tracking-wide
                                                        ${myRole !== 'admin' 
                                                            ? 'cursor-not-allowed opacity-60 border-transparent bg-slate-800/50 text-slate-400' 
                                                            : 'cursor-pointer border-slate-700 bg-slate-800 hover:border-purple-500 text-white shadow-sm'
                                                        }
                                                        ${currentRole === 'admin' && myRole === 'admin' ? 'text-purple-300' : ''}
                                                    `}
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="editor">Editor</option>
                                                    <option value="usuario">Usuario</option>
                                                </select>
                                                
                                                {myRole === 'admin' && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-4 text-center">
                                            {myRole === 'admin' ? (
                                                <button 
                                                    onClick={()=>handleDeleteUser(u.id)} 
                                                    className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition tooltip group-hover:scale-110"
                                                    title="Eliminar Usuario"
                                                >
                                                    <X size={18}/>
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-slate-600 uppercase border border-slate-800 px-2 py-1 rounded">
                                                    Solo lectura
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    
                    {usersList.length === 0 && (
                        <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                            <Loader className="animate-spin mb-2 opacity-50" size={20}/>
                            <p>Cargando usuarios...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Intranet;