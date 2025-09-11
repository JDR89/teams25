import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { user, password } = await request.json()
    
    // Buscar el usuario en la base de datos
    const admin = await prisma.admin.findUnique({
      where: {
        user: user
      }
    })
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      )
    }
    
    // Comparación directa (sin bcrypt)
    if (password !== admin.password) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }
    
    // Si las credenciales son correctas
    return NextResponse.json({
      success: true,
      message: 'Autenticación exitosa',
      user: {
        id: admin.id,
        username: admin.user
      }
    })
    
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET: listar todos los administradores
export async function GET() {
  try {
    const admins = await prisma.admin.findMany();
    return NextResponse.json(admins);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener admins" }, { status: 500 });
  }
}

