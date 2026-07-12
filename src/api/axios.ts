import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";
import type { ErrorApi, ErrorValidacion } from "@/types/api.types";

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_API,
	timeout: 15000,
});

axiosClient.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;
	if (token) {
		config.headers.set("Authorization", `Bearer ${token}`);
	}
	return config;
});

axiosClient.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		// El 401 de /auth/login son credenciales inválidas, no una sesión vencida:
		// se deja pasar para que el formulario muestre el error sin recargar la página.
		const esIntentoDeLogin = error.config?.url?.includes("/auth/login");
		if (error.response?.status === 401 && !esIntentoDeLogin) {
			useAuthStore.getState().cerrarSesion();
			window.location.assign("/login");
		}
		return Promise.reject(error);
	},
);

// El backend devuelve el DTO directo en el body (sin sobre { data, message }),
// por eso cada método ya desempaqueta `response.data` y regresa el tipo T.
export const api = {
	get: <T>(url: string, config?: AxiosRequestConfig) =>
		axiosClient.get<T>(url, config).then((response) => response.data),
	post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
		axiosClient.post<T>(url, data, config).then((response) => response.data),
	put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
		axiosClient.put<T>(url, data, config).then((response) => response.data),
	patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
		axiosClient.patch<T>(url, data, config).then((response) => response.data),
	delete: <T>(url: string, config?: AxiosRequestConfig) =>
		axiosClient.delete<T>(url, config).then((response) => response.data),
};

export function extraerMensajeError(error: unknown): string {
	if (axios.isAxiosError<ErrorApi | ErrorValidacion>(error)) {
		const datos = error.response?.data;
		if (datos && "mensaje" in datos) {
			return datos.mensaje;
		}
		if (datos && "campos" in datos) {
			return Object.values(datos.campos).join(" ");
		}
		return error.message;
	}
	return error instanceof Error ? error.message : "Ocurrió un error inesperado";
}
