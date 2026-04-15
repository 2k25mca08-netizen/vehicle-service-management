import express from "express";
import { createServer as createViteServer } from "vite";

const app = express();
app.use(express.json());

// -------------------------------------------------------
// In-memory database (seeded from the original db.json)
// On Vercel, file-system access is unreliable, so we keep
// everything in memory. Reads always work; writes persist
// only for the lifetime of the current serverless invocation.
// -------------------------------------------------------
let db: any = {
  users: [
    {
      id: "admin-1",
      email: "admin@autoserve.com",
      password: "123",
      role: "admin",
      name: "System Admin"
    },
    {
      id: "sa-1",
      email: "advisor1@autoserve.com",
      password: "123",
      role: "service_advisor",
      name: "John Advisor"
    },
    {
      id: "cust-1",
      email: "customer@gmail.com",
      password: "123",
      role: "customer",
      name: "Ganesh FB"
    },
    {
      id: "u-1775884435329",
      email: "L@gmail.com",
      password: "123",
      role: "customer",
      name: "L"
    },
    {
      id: "u-1775888362716",
      email: "H@gmail.com",
      password: "123",
      role: "customer",
      name: "H@"
    },
    {
      id: "u-1775898185752",
      email: "test@test.com",
      password: "123",
      role: "customer",
      name: "Test User"
    }
  ],
  vehicles: [
    {
      id: "v-1",
      customerId: "cust-1",
      model: "Toyota Camry",
      regNo: "KA-01-HH-1234",
      year: 2022
    },
    {
      id: "v-1775888452119",
      model: "Fortuner",
      regNo: "TN 30 AJ 05",
      year: 2025,
      customerId: "u-1775888362716"
    }
  ],
  workItems: [
    { id: "wi-1", name: "Engine Oil Change", price: 1500 },
    { id: "wi-2", name: "Fuel Filter Replacement", price: 800 },
    { id: "wi-3", name: "Wheel Alignment", price: 600 },
    { id: "wi-4", name: "General Service Charges", price: 1200 }
  ],
  serviceRecords: [
    {
      id: "sr-1",
      vehicleId: "v-1",
      customerId: "cust-1",
      advisorId: "sa-1",
      status: "Ready for Pickup",
      bookingDate: "2026-04-08T10:00:00Z",
      items: [{ itemId: "wi-1", quantity: 1, price: 1500 }],
      totalAmount: 1500,
      feedback: null,
      rating: null
    },
    {
      id: "sr-1775888466707",
      status: "Booked",
      items: [],
      totalAmount: 0,
      vehicleId: "v-1775888452119",
      customerId: "u-1775888362716",
      bookingDate: "2026-04-15T00:00:00.000Z"
    }
  ]
};

// Request logger
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// --- API Routes ---

// Auth Mock
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  console.log(`[AUTH] Login attempt: ${email}`);
  const user = db.users.find((u: any) => u.email === email && u.password === password);
  if (user) {
    const { password: _pw, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token: "mock-jwt-token" });
  } else {
    console.warn(`[AUTH] Failed login for: ${email}`);
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post("/api/auth/signup", (req, res) => {
  const { name, email, password, role = "customer" } = req.body;
  if (db.users.find((u: any) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = { id: `u-${Date.now()}`, name, email, password, role };
  db.users.push(newUser);
  const { password: _pw, ...userWithoutPassword } = newUser;
  res.json({ user: userWithoutPassword, token: "mock-jwt-token" });
});

// Vehicles
app.get("/api/vehicles", (_req, res) => res.json(db.vehicles));

app.post("/api/vehicles", (req, res) => {
  const newVehicle = { id: `v-${Date.now()}`, ...req.body };
  db.vehicles.push(newVehicle);
  res.json(newVehicle);
});

// Work Items
app.get("/api/work-items", (_req, res) => res.json(db.workItems));

app.post("/api/work-items", (req, res) => {
  const newItem = { id: `wi-${Date.now()}`, ...req.body };
  db.workItems.push(newItem);
  res.json(newItem);
});

// Service Records
app.get("/api/service-records", (_req, res) => res.json(db.serviceRecords));

app.post("/api/service-records", (req, res) => {
  const newRecord = {
    id: `sr-${Date.now()}`,
    status: "Booked",
    items: [],
    totalAmount: 0,
    ...req.body
  };
  db.serviceRecords.push(newRecord);
  res.json(newRecord);
});

app.patch("/api/service-records/:id", (req, res) => {
  const { id } = req.params;
  const index = db.serviceRecords.findIndex((r: any) => r.id === id);
  if (index !== -1) {
    db.serviceRecords[index] = { ...db.serviceRecords[index], ...req.body };
    res.json(db.serviceRecords[index]);
  } else {
    res.status(404).json({ message: "Record not found" });
  }
});

// Customers
app.get("/api/customers", (_req, res) =>
  res.json(db.users.filter((u: any) => u.role === "customer"))
);

// Service Advisors
app.get("/api/advisors", (_req, res) =>
  res.json(db.users.filter((u: any) => u.role === "service_advisor"))
);

// --- Export for Vercel ---
export default app;

// --- Local Dev Server ---
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = 3000;
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}
