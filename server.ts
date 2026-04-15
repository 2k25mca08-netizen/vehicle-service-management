import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Consistent way to find db.json in both local and Vercel environments
const DB_PATH = path.resolve(__dirname, "db.json");

app.use(express.json());

// Helper to read DB
const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      console.warn("[DB] db.json not found at " + DB_PATH + ". Using fallback empty state.");
      return { users: [], vehicles: [], workItems: [], serviceRecords: [] };
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("[DB] Error reading database:", err);
    return { users: [], vehicles: [], workItems: [], serviceRecords: [] };
  }
};

// Helper to write DB
const writeDB = (data: any) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[DB] Error writing to database:", err);
  }
};

// Request logger for Vercel logs
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// --- API Routes ---

// Auth Mock
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  console.log(`[AUTH] Login attempt for: ${email}`);
  
  const db = readDB();
  const user = db.users.find((u: any) => u.email === email && u.password === password);
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    console.log(`[AUTH] Login successful for: ${email}`);
    res.json({ user: userWithoutPassword, token: "mock-jwt-token" });
  } else {
    console.warn(`[AUTH] Login failed for: ${email}`);
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post("/api/auth/signup", (req, res) => {
  const { name, email, password, role = "customer" } = req.body;
  const db = readDB();
  
  if (db.users.find((u: any) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: `u-${Date.now()}`,
    name,
    email,
    password,
    role
  };

  db.users.push(newUser);
  writeDB(db);

  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ user: userWithoutPassword, token: "mock-jwt-token" });
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

app.post("/api/work-items", (req, res) => {
  const db = readDB();
  const newItem = { id: `wi-${Date.now()}`, ...req.body };
  db.workItems.push(newItem);
  writeDB(db);
  res.json(newItem);
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

// --- Exports ---
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

