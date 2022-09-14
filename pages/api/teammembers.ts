import type { NextApiRequest, NextApiResponse } from "next";
import teamMembersJson from "./teammembers.json";

export type TeamMemberLinkName = "linkedin" | "github" | "gravatar";

export interface TeamMemberLink {
  name: TeamMemberLinkName;
  displayName: string;
  url: string;
}

export interface TeamMember {
  name: string;
  links: TeamMemberLink[];
}

export interface Payload {
  data: TeamMember[];
}

const exampleTeamMember: TeamMember = {
  name: "Andrew Keith",
  links: [
    { name: "github", displayName: "", url: "" },
    { name: "linkedin", displayName: "", url: "" },
  ],
};

const examplePayload: Payload = {
  data: [exampleTeamMember],
};

export const TEAM_MEMBER_LINKS: TeamMemberLinkName[] = ["github", "linkedin"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>
) {
  const teamMembers = teamMembersJson as TeamMember[];
  const data = teamMembers.sort((a, b) => a.name.localeCompare(b.name));
  res.status(200).json({ data });
}
