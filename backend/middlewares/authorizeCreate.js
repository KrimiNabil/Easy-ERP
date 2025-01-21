// Middleware to authorize creation of PR, PO, PQ, Invoice, and Bill
function authorizeCreate() {
    return (req, res, next) => {
      try {
        const user = req.user; // Assuming req.user is set by authentication middleware
  
        if (!user) {
          return res.status(401).json({ message: 'Unauthorized: No user found' });
        }
  
        const { role } = user;
        const path = req.path.toLowerCase(); // Get the current route path
  console.log("here path ", path);
  
        // Define role-based permissions for each type of document
        const permissions = {
          '/create-pr': ['Accounting-Agent', 'Entity-Owner'],
          '/create-po': ['Accounting-Agent', 'Entity-Owner'],
          '/create-pq': ['Accounting-Agent', 'Entity-Owner', 'Client'],
          '/create-invoice': ['Accounting-Agent', 'Entity-Owner', 'Client'],
          '/create-bill': ['Accounting-Agent', 'Entity-Owner', 'Client']
        };
  
        // Check if the user's role is allowed to access the route
        if (!permissions[path] || !permissions[path].includes(role)) {
          return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
  
        next(); // User is authorized, proceed to the route handler
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
    };
  }
  
  module.exports = authorizeCreate;
  