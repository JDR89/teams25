export type Player = {
  id: number;
  name: string;
  pos1: "del" | "med" | "def";
  pos2: "del" | "med" | "def";
  level: number;
  isBot: boolean;
  assignedRole?: "del" | "med" | "def";
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

  // Si todavía faltan jugadores para llegar al tamaño del equipo, relleno respetando cupos si hay alternativas
  for (const p of team) {
    if (final.length >= teamSize) break;
    if (final.includes(p)) continue;

    const r1 = p.pos1;
    const r2 = p.pos2;

    if (counts[r1] < formation[r1]) {
      final.push(p);
      counts[r1]++;
    } else if (counts[r2] < formation[r2]) {
      final.push(p);
      counts[r2]++;
    } else {
      // Solo si no hay nadie más que respete cupos, agrego para completar el tamaño
      final.push(p);
    }
  }

  return final.slice(0, teamSize);
}

// --- Principal ---
export function balanceTeams(players: Player[], opts?: { captainAId?: number; captainBId?: number }): { teamA: Team; teamB: Team } {
  if (players.length < 10) {
    throw new Error("Necesitas al menos 10 jugadores para formar dos equipos.");
  }
  if (players.length > 22) {
    throw new Error("Máximo 22 jugadores permitidos.");
  }

  const teamSize = Math.floor(players.length / 2);
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

  const sorted = [...players].sort((a, b) => b.level - a.level);

  const teamA: Player[] = [];
  const teamB: Player[] = [];
  const countsA = { def: 0, med: 0, del: 0 };
  const countsB = { def: 0, med: 0, del: 0 };
  let levelA = 0;
  let levelB = 0;

  const { captainAId, captainBId } = opts ?? {};
  const capA = captainAId ? sorted.find(p => p.id === captainAId) : undefined;
  const capB = captainBId ? sorted.find(p => p.id === captainBId) : undefined;
  const assignedIds = new Set<number>();

  const addToTeam = (team: "A" | "B", p: Player, roleForCount: "def" | "med" | "del") => {
    const enriched = { ...p, assignedRole: roleForCount };
    if (team === "A") {
      teamA.push(enriched);
      countsA[roleForCount] += 1;
      levelA += p.level;
    } else {
      teamB.push(enriched);
      countsB[roleForCount] += 1;
      levelB += p.level;
    }
    assignedIds.add(p.id);
  };

  if (capA) addToTeam("A", capA, capA.pos1);
  if (capB) addToTeam("B", capB, capB.pos1);

  const canAssign = (team: "A" | "B", role: "def" | "med" | "del") => {
    const counts = team === "A" ? countsA : countsB;
    const size = team === "A" ? teamA.length : teamB.length;
    return size < teamSize && counts[role] < formation[role];
  };

  for (const p of sorted) {
    if (assignedIds.has(p.id)) continue;

    const tryPos = (role: "def" | "med" | "del") => {
      const aOk = canAssign("A", role);
      const bOk = canAssign("B", role);

      if (aOk && bOk) {
        const target =
          countsA[role] !== countsB[role]
            ? (countsA[role] < countsB[role] ? "A" : "B")
            : (levelA <= levelB ? "A" : "B");
        addToTeam(target, p, role);
        return true;
      } else if (aOk) {
        addToTeam("A", p, role);
        return true;
      } else if (bOk) {
        addToTeam("B", p, role);
        return true;
      }
      return false;
    };

    if (tryPos(p.pos1)) continue;
    if (tryPos(p.pos2)) continue;

    // Overflow: ambos cupos de rol completos, balancear por nivel y espacio
    const spaceA = teamA.length < teamSize;
    const spaceB = teamB.length < teamSize;
    if (spaceA && spaceB) {
      const target = levelA <= levelB ? "A" : "B";
      addToTeam(target, p, p.pos1);
    } else if (spaceA) {
      addToTeam("A", p, p.pos1);
    } else if (spaceB) {
      addToTeam("B", p, p.pos1);
    }
  }

  const finalA = teamA.slice(0, teamSize);
  const finalB = teamB.slice(0, teamSize);

  return {
    teamA: {
      players: finalA,
      totalLevel: finalA.reduce((acc, x) => acc + x.level, 0),
    },
    teamB: {
      players: finalB,
      totalLevel: finalB.reduce((acc, x) => acc + x.level, 0),
    },
  };
}
