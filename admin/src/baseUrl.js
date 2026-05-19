// Backend API base URL. Set VITE_API_BASE_URL in `.env` (see `.env.example`).
// Falls back to localhost so a missing env file in dev still works; for
// production, the env var must be set or the bundle will hit the dev port.
const url =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:7171';

export default url;
