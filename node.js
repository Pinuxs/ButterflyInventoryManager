const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const GITHUB_REPO = 'Pinuxs/ButterflyInventoryManager'; // Replace with your repo details
const GITHUB_BRANCH = 'main'; // Replace with your branch name
const GITHUB_TOKEN = 'GITHUBTOKEN'; // Replace with your GitHub token

// Endpoint to update products.json
app.post('/update-products', async (req, res) => {
    const products = req.body;

    try {
        // Get the current products.json file from GitHub
        const { data: fileData } = await axios.get(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/products.json`,
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                },
            }
        );

        const sha = fileData.sha; // File SHA needed for updates
        const content = Buffer.from(JSON.stringify(products, null, 2)).toString('base64');

        // Update the file on GitHub
        await axios.put(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/products.json`,
            {
                message: 'Update products.json via API',
                content: content,
                sha: sha,
                branch: GITHUB_BRANCH,
            },
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                },
            }
        );

        res.status(200).send({ message: 'Products updated successfully!' });
    } catch (error) {
        console.error('Error updating products:', error);
        res.status(500).send({ error: 'Failed to update products.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
