import { describe, expect, it } from "vitest";
import {
  CONFERENCES,
  DIVISIONS,
  TEAMS,
  TEAM_IDS,
  getTeam,
  isTeamId,
  teamsInConference,
} from "@/data/teams";

// Written independently from teams.ts so a wrong division there fails here.
const EXPECTED_DIVISIONS: Record<
  string,
  { conference: string; teams: string[] }
> = {
  Atlantic: { conference: "East", teams: ["BKN", "BOS", "NYK", "PHI", "TOR"] },
  Central: { conference: "East", teams: ["CHI", "CLE", "DET", "IND", "MIL"] },
  Southeast: { conference: "East", teams: ["ATL", "CHA", "MIA", "ORL", "WAS"] },
  Northwest: { conference: "West", teams: ["DEN", "MIN", "OKC", "POR", "UTA"] },
  Pacific: { conference: "West", teams: ["GSW", "LAC", "LAL", "PHX", "SAC"] },
  Southwest: { conference: "West", teams: ["DAL", "HOU", "MEM", "NOP", "SAS"] },
};

describe("teams", () => {
  it("has exactly 30 teams", () => {
    expect(TEAMS).toHaveLength(30);
    expect(TEAM_IDS).toHaveLength(30);
  });

  it("has unique three-letter uppercase ids", () => {
    expect(new Set(TEAM_IDS).size).toBe(30);
    for (const id of TEAM_IDS) expect(id).toMatch(/^[A-Z]{3}$/);
  });

  it("has unique city + name pairs", () => {
    const fullNames = TEAMS.map((team) => `${team.city} ${team.name}`);
    expect(new Set(fullNames).size).toBe(30);
  });

  it("splits into two conferences of 15", () => {
    expect(TEAMS.filter((team) => team.conference === "East")).toHaveLength(15);
    expect(TEAMS.filter((team) => team.conference === "West")).toHaveLength(15);
  });

  it.each(Object.entries(EXPECTED_DIVISIONS))(
    "puts the right teams in the %s division",
    (division, expected) => {
      const members = TEAMS.filter((team) => team.division === division);
      expect(members.map((team) => team.id).sort()).toEqual(expected.teams);
      for (const team of members) {
        expect(team.conference).toBe(expected.conference);
      }
    },
  );

  it("uses #RRGGBB colors", () => {
    for (const team of TEAMS) {
      expect(team.colors.primary).toMatch(/^#[0-9A-F]{6}$/);
      expect(team.colors.secondary).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it("looks teams up by id", () => {
    expect(getTeam("BOS").name).toBe("Celtics");
    expect(isTeamId("LAL")).toBe(true);
    expect(isTeamId("SEA")).toBe(false);
    expect(isTeamId("bos")).toBe(false);
  });

  it("lists three divisions per conference that match the teams", () => {
    for (const conference of CONFERENCES) {
      expect(DIVISIONS[conference]).toHaveLength(3);
      const fromTeams = new Set(
        teamsInConference(conference).map((team) => team.division),
      );
      expect(new Set(DIVISIONS[conference])).toEqual(fromTeams);
    }
  });
});
