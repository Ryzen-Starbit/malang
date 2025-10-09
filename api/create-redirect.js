export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { longURL, postfix } = req.body;

    const owner = 'multiverseweb';
    const repo = 'redirector';
    const workflow_id = 'create-pr.yml';
    const branch = 'main';
    const token = process.env.PERSONAL_PAT; // from Vercel env vars

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

    if (response.ok) {
      res.status(200).json({ success: true, message: 'Workflow triggered' });
    } else {
      const errText = await response.text();
      res.status(500).json({ success: false, error: errText });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
