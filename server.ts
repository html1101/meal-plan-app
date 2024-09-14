import express from 'express';
import ViteExpress from 'vite-express';
import path from 'path';
import http from 'http';

const app = express();

const PORT = Number(process.env.PORT) || 5173;
const HTTPS_PORT = Number(process.env.HTTPS_PORT) || 8443;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// If in production mode, specify
if (process.env.PRODUCTION) {
  // Tells ViteExpress to serve files statically from /dist.
  ViteExpress.config({ mode: 'production' });
  console.log('Set production flag.');
}

// Forward over bootstrap icon font to frontend
// Note: may get rid of this moving forward.
app.get('/fonts/bootstrap-icons.woff2', (_, res) => {
  res.sendFile(path.join(__dirname, 'fonts', 'bootstrap-icons.woff2'));
});

// Pass app object in
app.get("/", (req, _res, next) => {
    // Do stuff!
    console.log("Got request: ", req.url);
    next();
})

const httpServer = http.createServer(app);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Meal Plan Web UI Initialized.\n\tHost: ${'0.0.0.0'}\n\tPort: ${PORT}.`);
});

ViteExpress.bind(app, httpServer);