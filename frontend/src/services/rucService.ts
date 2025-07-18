import api from '@/services/authService'

export async function obtenerNombreProveedor(ruc: string): Promise <string | null> {
    try{
        const response = await api.get(`/ruc/${ruc}`)
        return response.data.nombre
    } catch (error) {
        console.error('Error al consultar RUC', error)
        return null
    }
}