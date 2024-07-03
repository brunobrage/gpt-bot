import { NextApiRequest, NextApiResponse } from 'next';
import { G4F } from 'g4f';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const g4f = new G4F();
    const messages = req.body.messages;
    const result = await g4f.chatCompletion(messages);
    res.status(200).json({ response: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
