import type { NextApiRequest, NextApiResponse } from 'next'
import teamMembersJson from './teammembers.json'

export type TeamMember = {
  name: string
  linkedin: string,
  github: string,
  gravatar: string,
}

type TeamMemberLinkKeys = Exclude<keyof TeamMember, 'name'>;
export const TEAM_MEMBER_LINKS: TeamMemberLinkKeys[] = ['github', 'linkedin'];

export interface Payload {
  data: TeamMember[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>
) {
  const data = teamMembersJson.sort((a, b) => a.name.localeCompare(b.name))
  const retData: Payload = { data }

  res.status(200).json(retData)
}