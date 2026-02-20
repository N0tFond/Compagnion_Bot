const express = require('express');
const app = express();

// Port du serveur (utilise le port de l'environnement ou 3000 par défaut)
const PORT = process.env.PORT || 3000;

// Middleware pour logger les requêtes
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString('fr-FR')}] ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
});

// Route principale - Page d'accueil
app.get('/', (req, res) => {
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bot Discord - Keep Alive</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    text-align: center;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                }
                h1 { margin: 0 0 10px 0; font-size: 2.5em; }
                .status { 
                    color: #00ff88; 
                    font-size: 1.2em; 
                    font-weight: bold;
                    margin: 20px 0;
                }
                .info {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 10px;
                    margin-top: 20px;
                }
                .uptime { font-size: 0.9em; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🤖 Bot Discord</h1>
                <div class="status">✅ Serveur Actif</div>
                <div class="info">
                    <p>⏰ Heure du serveur: ${new Date().toLocaleString('fr-FR')}</p>
                    <p class="uptime">⏱️ Uptime: ${formatUptime(process.uptime())}</p>
                    <p>🔗 Utilisez <code>/ping</code> pour le health check</p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Route de ping pour les services externes (UptimeRobot, etc.)
app.get('/ping', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Bot is alive!',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Route de health check
app.get('/health', (req, res) => {
    const healthCheck = {
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: Date.now(),
        memory: {
            used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
            total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`
        },
        platform: process.platform,
        nodeVersion: process.version
    };

    res.status(200).json(healthCheck);
});

// Route de statut détaillé
app.get('/status', (req, res) => {
    res.status(200).json({
        status: 'running',
        uptime: formatUptime(process.uptime()),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        platform: {
            os: process.platform,
            arch: process.arch,
            nodeVersion: process.version
        }
    });
});

// Gestion des routes inexistantes
app.use((req, res) => {
    res.status(404).json({
        error: 'Route non trouvée',
        availableRoutes: [
            'GET /',
            'GET /ping',
            'GET /health',
            'GET /status'
        ]
    });
});

// Fonction utilitaire pour formater l'uptime
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}j`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
}

// Démarrage du serveur
function startServer() {
    const server = app.listen(PORT, () => {
        console.log(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`);
        console.log(`┃  🚀 Serveur Keep-Alive démarré !       ┃`);
        console.log(`┃                                         ┃`);
        console.log(`┃  📡 Port: ${PORT.toString().padEnd(30)} ┃`);
        console.log(`┃  🌐 URL: http://localhost:${PORT.toString().padEnd(17)} ┃`);
        console.log(`┃                                         ┃`);
        console.log(`┃  Routes disponibles:                    ┃`);
        console.log(`┃  • GET /        - Page d'accueil        ┃`);
        console.log(`┃  • GET /ping    - Ping rapide           ┃`);
        console.log(`┃  • GET /health  - Health check          ┃`);
        console.log(`┃  • GET /status  - Statut détaillé       ┃`);
        console.log(`┃                                         ┃`);
        console.log(`┃  💡 Configurez UptimeRobot pour :      ┃`);
        console.log(`┃     - URL: votre-url/ping               ┃`);
        console.log(`┃     - Intervalle: 5 minutes             ┃`);
        console.log(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`);
    });

    // Gestion des erreurs du serveur
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`❌ Le port ${PORT} est déjà utilisé !`);
            process.exit(1);
        } else {
            console.error('❌ Erreur du serveur:', error);
        }
    });

    return server;
}

// Gestion de l'arrêt propre
process.on('SIGTERM', () => {
    console.log('\n🛑 Signal SIGTERM reçu, arrêt du serveur...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Signal SIGINT reçu, arrêt du serveur...');
    process.exit(0);
});

// Exporter la fonction de démarrage
module.exports = { startServer, app };

// Si le fichier est exécuté directement
if (require.main === module) {
    startServer();
}
