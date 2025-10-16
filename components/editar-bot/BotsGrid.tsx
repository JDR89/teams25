import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

type BotRow = {
  id: number;
  name: string;
  pos1: string;
  pos2: string;
  level: number;
};

const BotsGrid = ({ bots }: { bots: BotRow[] }) => {
  return (
    <div className="p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Posición 1</TableHead>
            <TableHead>Posición 2</TableHead>
            <TableHead>Nivel</TableHead>
            <TableHead>Editar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bots.map((bot, index) => (
            <TableRow
              key={bot.id}
              className={index % 2 === 0 ? "border-b-2 border-blue-500" : "border-b-2 border-red-500"}
            >
              <TableCell>{bot.name}</TableCell>
              <TableCell>{bot.pos1}</TableCell>
              <TableCell>{bot.pos2}</TableCell>
              <TableCell>{bot.level}</TableCell>
              <TableCell>
                <Button asChild variant="outline" size="icon" aria-label={`Editar ${bot.name}`} title="Editar">
                  <Link href={`/admin/editar-bot/${bot.id}`}>
                    <Pencil />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default BotsGrid