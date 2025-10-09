export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { longURL, postfix } = req.body; // <- req.body must exist
        if (!longURL || !postfix) {
            return res.status(400).json({ success: false, error: 'Missing longURL or postfix' });
        }

        const owner = 'multiverseweb';
        const repo = 'redirector';
        const workflow_id = 'create-pr.yml';
        const branch = 'main';
        const token = process.env.PERSONAL_PAT; // securely stored

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
            return res.status(200).json({ success: true, message: 'Workflow triggered' });
        } else {
            const text = await response.text();
            return res.status(500).json({ success: false, error: text });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
