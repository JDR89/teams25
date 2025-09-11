import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

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

