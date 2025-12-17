const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend API Server',
    endpoints: {
      employees: '/api/employees',
      leaves: '/api/leaves',
      salaries: '/api/salaries',
      transactions: '/api/transactions'
    }
  });
});

app.use('/api', apiRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
