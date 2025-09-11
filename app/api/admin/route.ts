import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

// GET: listar todos los administradores
export async function GET() {
  try {
    // Debug info
    console.log('Environment:', process.env.NODE_ENV);
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('Prisma client status:', !!prisma);

    const admins = await prisma.admin.findMany();
    
    return NextResponse.json({
      success: true,
      data: admins,
      debug: {
        env: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        hasPrisma: !!prisma
      }
    });

  } catch (error) {
    console.error('Full error:', error);
    
    return NextResponse.json({
      error: "Error al obtener admins",
      message: error.message,
      code: error.code,
      debug: {
        env: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL
      }
    }, { status: 500 });
  }
}
