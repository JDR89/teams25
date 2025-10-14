import { Player } from "@/utils/teams"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

const PlayersGrid = ({ players }: { players: Player[] }) => {
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
          {players.map((player, index) => (
            <TableRow
              key={player.id}
              className={index % 2 === 0 ? "border-b-2 border-blue-500" : "border-b-2 border-red-500"}
            >
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.pos1}</TableCell>
              <TableCell>{player.pos2}</TableCell>
              <TableCell>{player.level}</TableCell>
              <TableCell>
                <Button asChild variant="outline" size="icon" aria-label={`Editar ${player.name}`} title="Editar">
                  <Link href={`/admin/editar-jugador/${player.id}`}>
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

export default PlayersGrid
