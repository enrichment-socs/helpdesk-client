import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../shared/libs/session';

export default withSessionRoute(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method.toUpperCase() === 'POST') {
    const { semester } = req.body;
    req.session.activeSemester = semester;
    await req.session.save();
    return res.send(semester);
  } else {
    return res.json({
      message: `${req.method} method not supported`,
    });
  }
}
