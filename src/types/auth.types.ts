// Definición de tipos compartidos para autenticación y autorización.

export type Rol = 'admin' | 'usuario';

export interface Usuario {
	id: number;
	nombre: string;
	email: string;
	rol: Rol;
}
