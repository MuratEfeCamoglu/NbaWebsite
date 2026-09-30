/**
 * Single source of truth for team data. Team names, abbreviations and colors
 * must not be written by hand anywhere else.
 */
export type Conference = "East" | "West";

export type Division =
  | "Atlantic"
  | "Central"
  | "Southeast"
  | "Northwest"
  | "Pacific"
  | "Southwest";

export interface Team {
  id: string;
  city: string;
  name: string;
  conference: Conference;
  division: Division;
  colors: { primary: string; secondary: string };
}

export const TEAMS = [
  // East — Atlantic
  { id: "BOS", city: "Boston", name: "Celtics", conference: "East", division: "Atlantic", colors: { primary: "#007A33", secondary: "#BA9653" } },
  { id: "BKN", city: "Brooklyn", name: "Nets", conference: "East", division: "Atlantic", colors: { primary: "#000000", secondary: "#FFFFFF" } },
  { id: "NYK", city: "New York", name: "Knicks", conference: "East", division: "Atlantic", colors: { primary: "#006BB6", secondary: "#F58426" } },
  { id: "PHI", city: "Philadelphia", name: "76ers", conference: "East", division: "Atlantic", colors: { primary: "#006BB6", secondary: "#ED174C" } },
  { id: "TOR", city: "Toronto", name: "Raptors", conference: "East", division: "Atlantic", colors: { primary: "#CE1141", secondary: "#A1A1A4" } },
  // East — Central
  { id: "CHI", city: "Chicago", name: "Bulls", conference: "East", division: "Central", colors: { primary: "#CE1141", secondary: "#000000" } },
  { id: "CLE", city: "Cleveland", name: "Cavaliers", conference: "East", division: "Central", colors: { primary: "#860038", secondary: "#FDBB30" } },
  { id: "DET", city: "Detroit", name: "Pistons", conference: "East", division: "Central", colors: { primary: "#C8102E", secondary: "#1D42BA" } },
  { id: "IND", city: "Indiana", name: "Pacers", conference: "East", division: "Central", colors: { primary: "#002D62", secondary: "#FDBB30" } },
  { id: "MIL", city: "Milwaukee", name: "Bucks", conference: "East", division: "Central", colors: { primary: "#00471B", secondary: "#EEE1C6" } },
  // East — Southeast
  { id: "ATL", city: "Atlanta", name: "Hawks", conference: "East", division: "Southeast", colors: { primary: "#E03A3E", secondary: "#C1D32F" } },
  { id: "CHA", city: "Charlotte", name: "Hornets", conference: "East", division: "Southeast", colors: { primary: "#1D1160", secondary: "#00788C" } },
  { id: "MIA", city: "Miami", name: "Heat", conference: "East", division: "Southeast", colors: { primary: "#98002E", secondary: "#F9A01B" } },
  { id: "ORL", city: "Orlando", name: "Magic", conference: "East", division: "Southeast", colors: { primary: "#0077C0", secondary: "#C4CED4" } },
  { id: "WAS", city: "Washington", name: "Wizards", conference: "East", division: "Southeast", colors: { primary: "#002B5C", secondary: "#E31837" } },
  // West — Northwest
  { id: "DEN", city: "Denver", name: "Nuggets", conference: "West", division: "Northwest", colors: { primary: "#0E2240", secondary: "#FEC524" } },
  { id: "MIN", city: "Minnesota", name: "Timberwolves", conference: "West", division: "Northwest", colors: { primary: "#0C2340", secondary: "#78BE20" } },
  { id: "OKC", city: "Oklahoma City", name: "Thunder", conference: "West", division: "Northwest", colors: { primary: "#007AC1", secondary: "#EF3B24" } },
  { id: "POR", city: "Portland", name: "Trail Blazers", conference: "West", division: "Northwest", colors: { primary: "#E03A3E", secondary: "#000000" } },
  { id: "UTA", city: "Utah", name: "Jazz", conference: "West", division: "Northwest", colors: { primary: "#002B5C", secondary: "#F9A01B" } },
  // West — Pacific
  { id: "GSW", city: "Golden State", name: "Warriors", conference: "West", division: "Pacific", colors: { primary: "#1D428A", secondary: "#FFC72C" } },
  { id: "LAC", city: "LA", name: "Clippers", conference: "West", division: "Pacific", colors: { primary: "#C8102E", secondary: "#1D428A" } },
  { id: "LAL", city: "Los Angeles", name: "Lakers", conference: "West", division: "Pacific", colors: { primary: "#552583", secondary: "#FDB927" } },
  { id: "PHX", city: "Phoenix", name: "Suns", conference: "West", division: "Pacific", colors: { primary: "#1D1160", secondary: "#E56020" } },
  { id: "SAC", city: "Sacramento", name: "Kings", conference: "West", division: "Pacific", colors: { primary: "#5A2D81", secondary: "#63727A" } },
  // West — Southwest
  { id: "DAL", city: "Dallas", name: "Mavericks", conference: "West", division: "Southwest", colors: { primary: "#00538C", secondary: "#B8C4CA" } },
  { id: "HOU", city: "Houston", name: "Rockets", conference: "West", division: "Southwest", colors: { primary: "#CE1141", secondary: "#C4CED4" } },
  { id: "MEM", city: "Memphis", name: "Grizzlies", conference: "West", division: "Southwest", colors: { primary: "#5D76A9", secondary: "#12173F" } },
  { id: "NOP", city: "New Orleans", name: "Pelicans", conference: "West", division: "Southwest", colors: { primary: "#0C2340", secondary: "#C8102E" } },
  { id: "SAS", city: "San Antonio", name: "Spurs", conference: "West", division: "Southwest", colors: { primary: "#000000", secondary: "#C4CED4" } },
] as const satisfies readonly Team[];

export type TeamId = (typeof TEAMS)[number]["id"];

export const TEAM_IDS: readonly TeamId[] = TEAMS.map((team) => team.id);

const TEAMS_BY_ID = new Map<string, Team>(TEAMS.map((team) => [team.id, team]));

export function isTeamId(value: string): value is TeamId {
  return TEAMS_BY_ID.has(value);
}

export function getTeam(id: TeamId): Team {
  return TEAMS_BY_ID.get(id) as Team;
}

export const CONFERENCES: readonly Conference[] = ["West", "East"];

export function teamsInConference(conference: Conference) {
  return TEAMS.filter((team) => team.conference === conference);
}

/** Divisions ("gruplar") of each conference, in display order. */
export const DIVISIONS: Record<Conference, readonly Division[]> = {
  West: ["Northwest", "Pacific", "Southwest"],
  East: ["Atlantic", "Central", "Southeast"],
};
