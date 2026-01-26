import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ========== BUILD VERIFICATION LOGS ==========
console.log("🚀🚀🚀 BUILD TIMESTAMP:", new Date().toISOString());
console.log("🔧 useTestAccessV2 ACTIVE: TRUE");
console.log("📦 FORCED REBUILD: 2026-01-26T02:30:00Z");
// ============================================

createRoot(document.getElementById("root")!).render(<App />);
