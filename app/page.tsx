import { FormAuthAdmin } from "@/components/home/Form_auth_admin"

export default function HomePage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <h1 className="flex items-center gap-2 font-medium">
           
            SJD
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <FormAuthAdmin />
          </div>
        </div>
      </div>
      <div className="bg-white relative hidden lg:block">
        {/* Fondo blanco con dos columnas verticales */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-46 bg-blue-600"></div>
          <div className="w-46 bg-red-600"></div>
        </div>
      </div>
    </div>
  )
}
