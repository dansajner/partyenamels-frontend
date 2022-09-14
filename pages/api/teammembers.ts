import type { NextApiRequest, NextApiResponse } from 'next'

export type TeamMember = {
  name: string
  linkedin: string,
  github: string,
  gravatar: string,
}

type TeamMemberLinkKeys = Exclude<keyof TeamMember, 'name'>;
export const TEAM_MEMBER_LINKS: TeamMemberLinkKeys[] = ['github', 'gravatar', 'linkedin'];

export interface Payload {
  data: TeamMember[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>
) {
  const retData: Payload = {
    data: [{
      name: "Andrew Keith",
      linkedin: "https://www.linkedin.com/in/andrew-keith-0b0b2a1b/",
      github: "github.com/andrewkeith",
      gravatar: "https://www.gravatar.com/avatar/0b0b2a1b"
    },
    ]
  }

  res.status(200).json(retData)
}