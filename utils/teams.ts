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
function adjustFormation(team: Player[], teamSize: number): Player[] {
  // Formaciones dinámicas según el tamaño del equipo
  const formations: { [key: number]: { def: number; med: number; del: number } } = {
    5: { def: 2, med: 2, del: 1 },
    6: { def: 2, med: 3, del: 1 },
    7: { def: 3, med: 3, del: 1 },
    8: { def: 3, med: 3, del: 2 },
    9: { def: 3, med: 4, del: 2 },
    10: { def: 4, med: 4, del: 2 },
    11: { def: 4, med: 5, del: 2 }
  };

  const formation = formations[teamSize] || { def: Math.floor(teamSize * 0.4), med: Math.floor(teamSize * 0.4), del: Math.ceil(teamSize * 0.2) };
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

  // Si todavía faltan jugadores para llegar al tamaño del equipo, relleno con los que queden
  for (const p of team) {
    if (final.length >= teamSize) break;
    if (!final.includes(p)) {
      final.push(p);
    }
  }

  return final.slice(0, teamSize);
}

// --- Principal ---
export function balanceTeams(players: Player[]): { teamA: Team; teamB: Team } {
  if (players.length < 10) {
    throw new Error("Necesitas al menos 10 jugadores para formar dos equipos.");
  }

  if (players.length > 22) {
    throw new Error("Máximo 22 jugadores permitidos.");
  }

  // Calculo el tamaño de cada equipo
  const teamSize = Math.floor(players.length / 2);

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

  const finalA = adjustFormation(teamA, teamSize);
  const finalB = adjustFormation(teamB, teamSize);

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
