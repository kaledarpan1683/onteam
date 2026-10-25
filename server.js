const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and serve static frontend files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple API route to test backend-frontend connection & AI mock insights
app.get('/api/status', (req, andRes) => {
    andRes.json({ 
        status: 'online', 
        message: 'Production & Dispatch ERP Backend is running smoothly!',
        aiInsight: 'All machines operating at 94% efficiency. No critical bottlenecks detected.'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
