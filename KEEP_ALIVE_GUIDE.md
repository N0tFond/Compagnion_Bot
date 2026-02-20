# 🚀 Configuration Keep-Alive avec UptimeRobot

Ce guide vous explique comment configurer un service de ping externe pour garder votre bot Discord actif 24/7.

## 📦 Installation

1. **Installer Express** (si ce n'est pas déjà fait) :

   ```bash
   npm install
   ```

2. **Démarrer votre bot** :

   ```bash
   npm start
   ```

   Le serveur keep-alive démarrera automatiquement sur le port 3000 (ou le PORT défini dans `.env`)

## 🌐 Configuration d'UptimeRobot

### Étape 1 : Créer un compte

1. Allez sur [UptimeRobot.com](https://uptimerobot.com/)
2. Créez un compte gratuit (permet de monitorer jusqu'à 50 sites)

### Étape 2 : Ajouter un nouveau monitor

1. Cliquez sur **"Add New Monitor"**
2. Remplissez les informations suivantes :
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `Bot Discord - Keep Alive` (ou le nom de votre choix)
   - **URL (or IP)**: `https://votre-domaine.com/ping`
     _(Remplacez par l'URL publique de votre serveur)_
   - **Monitoring Interval**: `5 minutes`
   - **Monitor Timeout**: `30 seconds`
   - **HTTP Method**: `GET`

3. Cliquez sur **"Create Monitor"**

### Étape 3 : Configuration avancée (optionnel)

Pour recevoir des alertes en cas de problème :

1. Allez dans **"Alert Contacts"**
2. Ajoutez votre email ou un webhook Discord
3. Activez les notifications pour votre monitor

## 🔌 Routes disponibles

Votre serveur expose plusieurs routes :

| Route         | Description                | Usage                           |
| ------------- | -------------------------- | ------------------------------- |
| `GET /`       | Page d'accueil avec statut | Interface web                   |
| `GET /ping`   | Ping rapide                | **Recommandé pour UptimeRobot** |
| `GET /health` | Health check détaillé      | Monitoring avancé               |
| `GET /status` | Statut complet du système  | Debugging                       |

### Exemple de réponse `/ping` :

```json
{
  "status": "ok",
  "message": "Bot is alive!",
  "timestamp": "2026-02-20T10:30:00.000Z",
  "uptime": 3600
}
```

## 🚀 Déploiement

### Sur un service d'hébergement (Replit, Render, etc.)

1. Assurez-vous que le port est correctement configuré :

   ```env
   PORT=3000
   ```

2. Le serveur utilisera automatiquement `process.env.PORT` si défini

3. Votre URL publique sera fournie par votre hébergeur
   - **Replit** : `https://votre-projet.replit.app`
   - **Render** : `https://votre-service.onrender.com`
   - **Heroku** : `https://votre-app.herokuapp.com`

4. Utilisez cette URL + `/ping` dans UptimeRobot

### Configuration du fichier `.env`

Ajoutez cette ligne à votre fichier `.env` (optionnel) :

```env
PORT=3000
```

## ✅ Vérification

Pour tester si tout fonctionne :

1. **En local** :
   - Ouvrez votre navigateur : `http://localhost:3000`
   - Test de l'API : `http://localhost:3000/ping`

2. **En production** :
   - Vérifiez votre URL publique dans un navigateur
   - Testez la route : `https://votre-url.com/ping`

3. **Avec UptimeRobot** :
   - Attendez 5 minutes
   - Vérifiez le dashboard d'UptimeRobot
   - Le statut devrait être "Up" 🟢

## 🎯 Avantages

✅ **Gratuit** : UptimeRobot offre un plan gratuit généreux
✅ **Simple** : Configuration en quelques minutes
✅ **Fiable** : Ping automatique toutes les 5 minutes
✅ **Monitoring** : Dashboard pour suivre l'uptime de votre bot
✅ **Alertes** : Notification en cas de panne
✅ **Logs** : Historique des pings et des temps de réponse

## 📊 Alternatives à UptimeRobot

- **[Uptime Kuma](https://github.com/louislam/uptime-kuma)** - Self-hosted (gratuit)
- **[Better Uptime](https://betteruptime.com/)** - Version gratuite disponible
- **[Pingdom](https://www.pingdom.com/)** - Version d'essai gratuite
- **[StatusCake](https://www.statuscake.com/)** - Plan gratuit limité
- **[Freshping](https://www.freshworks.com/website-monitoring/)** - Gratuit (50 checks)

## 🛠️ Dépannage

### Le serveur ne démarre pas

```bash
❌ Le port 3000 est déjà utilisé !
```

**Solution** : Changez le port dans `.env` ou arrêtez l'autre processus

### UptimeRobot affiche "Down"

- Vérifiez que votre bot est bien en ligne
- Testez l'URL manuellement dans un navigateur
- Vérifiez les logs de votre serveur
- Assurez-vous que le pare-feu autorise les requêtes HTTP

### Le bot se déconnecte quand même

- Certains hébergeurs gratuits ont des limitations
- Vérifiez les logs d'erreur de votre bot
- UptimeRobot maintient le serveur actif, mais ne garantit pas l'uptime du bot Discord

## 📝 Notes importantes

⚠️ **Limitations des hébergeurs gratuits** :

- Certains hébergeurs (Heroku, Render free tier) peuvent mettre en veille après 30 min d'inactivité
- UptimeRobot aide, mais ne contourne pas toutes les limitations
- Pour un uptime 100%, envisagez un hébergement payant

⚠️ **Rate Limits** :

- Discord peut limiter votre bot si vous le relancez trop souvent
- UptimeRobot ne relance PAS le bot, il le garde juste actif

## 💡 Bonnes pratiques

1. **Utilisez la route `/ping`** pour UptimeRobot (réponse la plus rapide)
2. **Intervalle de 5 minutes** recommandé (minimum gratuit UptimeRobot)
3. **Activez les alertes** pour être notifié des pannes
4. **Surveillez les logs** pour détecter les problèmes
5. **Testez régulièrement** votre URL publique

---

🎉 **C'est tout !** Votre bot devrait maintenant rester actif 24/7 grâce aux pings réguliers d'UptimeRobot.
