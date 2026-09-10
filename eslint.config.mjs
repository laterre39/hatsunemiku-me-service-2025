import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    // Existing prop synchronization and client-only initialization patterns.
    // Keep these visible during the UI refactor without blocking stack upgrades.
    files: [
      "src/components/*ManagementClient.tsx",
      "src/components/MikuBirthdayConfetti.tsx",
      "src/components/SongCard.tsx",
      "src/components/SongList.tsx",
    ],
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
