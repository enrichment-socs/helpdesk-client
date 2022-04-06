// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === 'POST') {
    const { key } = req.query;

    if (key === process.env.NEXT_PUBLIC_SEED_KEY) {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/semesters`, {
        startYear: 2021,
        endYear: 2022,
        type: 'Odd',
        isActive: false,
      });

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/semesters`, {
        startYear: 2021,
        endYear: 2022,
        type: 'Even',
        isActive: true,
      });

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/roles`, {
        roleName: 'Super Admin',
      });

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/roles`, {
        roleName: 'Admin',
      });

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/roles`, {
        roleName: 'User',
      });

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/status`, {
        statusName: 'Pending',
      });

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/status`, {
        statusName: 'Awaiting Approval',
      });

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/status`, {
        statusName: 'Awaiting Updates',
      });

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/status`, {
        statusName: 'Finished',
      });

      return res.json('Seed Success');
    } else {
      return res.json('Unauthorized');
    }
  }
}
