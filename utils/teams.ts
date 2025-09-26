export type Player = {
  id: number;
  name: string;
  pos1: "del" | "med" | "def";
  pos2: "del" | "med" | "def";
  level: number;
  isBot: boolean;
};

export type Team = {
  players: Player[];
  totalLevel: number;
};

// --- Auxiliar ---
function adjustFormation(team: Player[]): Player[] {
  const formation = { def: 3, med: 3, del: 1 };
  const final: Player[] = [];
  const counts = { def: 0, med: 0, del: 0 };

  // Intento llenar según pos1
  for (const p of team) {
    const role = p.pos1;
    if (counts[role] < formation[role]) {
      final.push(p);
      counts[role]++;
    }
  }

  // Si aún faltan cupos, uso pos2
  for (const p of team) {
    if (final.includes(p)) continue;
    const role = p.pos2;
    if (counts[role] < formation[role]) {
      final.push(p);
      counts[role]++;
    }
  }

  // Si todavía faltan jugadores para llegar a 8, relleno con los que queden
  for (const p of team) {
    if (final.length >= 8) break;
    if (!final.includes(p)) {
      final.push(p);
    }
  }

  return final.slice(0, 8);
}

// --- Principal ---
export function balanceTeams(players: Player[]): { teamA: Team; teamB: Team } {
  if (players.length < 16) {
    throw new Error("Necesitas al menos 16 jugadores para formar dos equipos de 8.");
  }

  // Ordeno por nivel para repartir equitativo
  const sorted = [...players].sort((a, b) => b.level - a.level);

  const teamA: Player[] = [];
  const teamB: Player[] = [];

  // Reparto alternado
  sorted.forEach((player, idx) => {
    if (idx % 2 === 0) {
      teamA.push(player);
    } else {
      teamB.push(player);
    }
  });

  const finalA = adjustFormation(teamA);
  const finalB = adjustFormation(teamB);

  return {
    teamA: {
      players: finalA,
      totalLevel: finalA.reduce((acc, p) => acc + p.level, 0),
    },
    teamB: {
      players: finalB,
      totalLevel: finalB.reduce((acc, p) => acc + p.level, 0),
    },
  };
}
