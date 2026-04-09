import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const DB_PATH = path.join(process.cwd(), "db.json");

  app.use(express.json());

  // Helper to read DB
  const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  // Helper to write DB
  const writeDB = (data: any) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

  // --- API Routes ---

  // Auth Mock
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token: "mock-jwt-token" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  // Master Data: Vehicles
  app.get("/api/vehicles", (req, res) => {
    const db = readDB();
    res.json(db.vehicles);
  });

  app.post("/api/vehicles", (req, res) => {
    const db = readDB();
    const newVehicle = { id: `v-${Date.now()}`, ...req.body };
    db.vehicles.push(newVehicle);
    writeDB(db);
    res.json(newVehicle);
  });

  // Master Data: Work Items
  app.get("/api/work-items", (req, res) => {
    const db = readDB();
    res.json(db.workItems);
  });

  // Service Records
  app.get("/api/service-records", (req, res) => {
    const db = readDB();
    res.json(db.serviceRecords);
  });

  app.post("/api/service-records", (req, res) => {
    const db = readDB();
    const newRecord = { 
      id: `sr-${Date.now()}`, 
      status: "Booked",
      items: [],
      totalAmount: 0,
      ...req.body 
    };
    db.serviceRecords.push(newRecord);
    writeDB(db);
    res.json(newRecord);
  });

  app.patch("/api/service-records/:id", (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.serviceRecords.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      db.serviceRecords[index] = { ...db.serviceRecords[index], ...req.body };
      writeDB(db);
      res.json(db.serviceRecords[index]);
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  });

  // Customers
  app.get("/api/customers", (req, res) => {
    const db = readDB();
    res.json(db.users.filter((u: any) => u.role === "customer"));
  });

  // Service Advisors
  app.get("/api/advisors", (req, res) => {
    const db = readDB();
    res.json(db.users.filter((u: any) => u.role === "service_advisor"));
  });

  // --- Vite Setup ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
