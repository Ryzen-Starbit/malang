import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { longURL, postfix } = req.body;

  const owner = 'multiverseweb';
  const repo = 'redirector';
  const workflow_id = 'create-pr.yml';
  const branch = 'main';
  const token = process.env.PERSONAL_PAT; // from Vercel environment variables

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ref: branch, inputs: { longURL, postfix } })
    }
  );

  if (response.ok) res.status(200).send('Workflow triggered');
  else res.status(500).send(await response.text());
}
