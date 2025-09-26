import { Player } from "./teams";

export const copyTeamsToClipboard = async (teamA: Player[], teamB: Player[]): Promise<boolean> => {
  const teamANames = teamA.map(player => player.name).join('\n');
  const teamBNames = teamB.map(player => player.name).join('\n');
  
  const formattedText = `Team 1:
${teamANames}

Team 2:
${teamBNames}`;

  try {
    await navigator.clipboard.writeText(formattedText);
    return true;
  } catch (err) {
    console.error('Error al copiar:', err);
    // Fallback para navegadores que no soportan clipboard API
    try {
      const textArea = document.createElement('textarea');
      textArea.value = formattedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackErr) {
      console.error('Error en fallback:', fallbackErr);
      return false;
    }
  }
};