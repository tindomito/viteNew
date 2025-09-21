/**
 * Servicios de autenticación usando Supabase Auth
 * Maneja registro, login, logout y gestión del estado del usuario
 */
import { supabase } from './supabase.js';

/**
 * Registra un nuevo usuario en la aplicación
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} displayName - Nombre para mostrar del usuario
 * @returns {Promise<{user: Object|null, error: Object|null}>}
 */
export async function register(email, password, displayName) {
    try {
        // Registrar usuario en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                }
            }
        });

        if (error) {
            return { user: null, error };
        }

        return { user: data.user, error: null };
    } catch (error) {
        return { user: null, error: { message: 'Error inesperado durante el registro' } };
    }
}

/**
 * Inicia sesión con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<{user: Object|null, error: Object|null}>}
 */
export async function login(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return { user: null, error };
        }

        return { user: data.user, error: null };
    } catch (error) {
        return { user: null, error: { message: 'Error inesperado durante el login' } };
    }
}

/**
 * Cierra la sesión del usuario actual
 * @returns {Promise<{error: Object|null}>}
 */
export async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        return { error };
    } catch (error) {
        return { error: { message: 'Error inesperado durante el logout' } };
    }
}

/**
 * Obtiene el usuario autenticado actual
 * @returns {Promise<{user: Object|null, error: Object|null}>}
 */
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    } catch (error) {
        return { user: null, error: { message: 'Error al obtener usuario actual' } };
    }
}

/**
 * Actualiza el perfil del usuario actual
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<{user: Object|null, error: Object|null}>}
 */
export async function updateProfile(updates) {
    try {
        const { data, error } = await supabase.auth.updateUser({
            data: updates
        });

        if (error) {
            return { user: null, error };
        }

        return { user: data.user, error: null };
    } catch (error) {
        return { user: null, error: { message: 'Error al actualizar perfil' } };
    }
}

/**
 * Suscribe a cambios en el estado de autenticación
 * @param {Function} callback - Función que se ejecuta cuando cambia el estado
 * @returns {Object} Subscription object
 */
export function subscribeToAuthChanges(callback) {
    return supabase.auth.onAuthStateChange(callback);
}