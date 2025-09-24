import { FormAuthAdmin } from "@/components/home/Form_auth_admin"


export default function HomePage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 relative">
      {/* Barras que ocupan todo el ancho en pantallas medianas y pequeñas */}
      <div className="absolute inset-0 flex lg:hidden">
        <div className="w-1/2 bg-blue-600"></div>
        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white transform -translate-x-1/2"></div>
        <div className="w-1/2 bg-red-600"></div>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10 relative z-10">

        <div className="flex flex-1 items-center justify-center">

          <div className="w-full max-w-sm">


            <FormAuthAdmin />

          </div>
        </div>
      </div>
      <div className="bg-white relative hidden lg:block">
        {/* Fondo blanco con dos columnas verticales para pantallas grandes */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-46 bg-blue-600"></div>
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white transform -translate-y"></div>

          <div className="w-46 bg-red-600"></div>
        </div>
      </div>
    </div>
  )
}
