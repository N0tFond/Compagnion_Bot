# 🤖 Bot Discord Utilitaire

Un bot Discord polyvalent offrant diverses fonctionnalités de modération et d'utilité pour votre serveur.

## ✨ Fonctionnalités

- 🛡️ **Modération**
  - `/ban`: Bannir des utilisateurs
  - `/clear`: Nettoyer les messages d'un salon
- 👥 **Gestion des utilisateurs**
  - `/verify`: Système de vérification des membres
  - `/user`: Afficher les informations d'un utilisateur
  - `/activite`: Voir l'activité en cours d'un utilisateur
- 📢 **Communication**
  - `/annonce`: Créer des annonces
  - `/suggestion`: Système de suggestions
- ℹ️ **Utilitaires**
  - `/ping`: Vérifier la latence du bot
  - `/info`: Voir les informations du bot
  - `/about`: Afficher à propos du bot avec liens utiles _(Nouveau)_
- 🎭 **Profil du Bot**
  - 🎬 **Présence dynamique** - Activités en rotation toutes les 30 secondes
  - 📝 **Bio personnalisée** - Description affichée sur le profil Discord
  - 🔗 **Boutons interactifs** - Accès direct à GitHub, support, documentation, etc.

## 🚀 Installation

1. Clonez le repository

```bash
git clone https://github.com/N0tFond/Bot_Server.git
cd Bot_Server
```

2. Installez les dépendances

```bash
npm install
```

3. Configurez le fichier `.env`

```env
TOKEN=votre_token_discord
APP_ID=votre_app_id
PUBLIC_KEY=votre_public_key
GIPHY_API_KEY=votre_giphy_api_key
SUGGEST_CHANNEL_ID=id_canal_suggestions
STAFF_ROLE=id_role_staff

# Personnalisation
FOOTER_MSG="Développé par VotreNom"
COLOR_WARN=FFBF18
COLOR_SUCCESS=90955C
COLOR_ERROR=D12128
COLOR_INFO=5E7381
```

4. Démarrez le bot

```bash
npm run start
```

## 🎯 Utilisation de la Commande `/about`

La commande `/about` affiche les informations complètes du bot avec un embed interactif et des boutons:

```
/about
```

L'embed contient:

- 📝 Description du bot et de ses fonctionnalités
- 👨‍💻 Nom du développeur
- 📦 Versions du bot et de Discord.js
- 📊 Statistiques (serveurs, utilisateurs, etc.)
- ⏱️ Uptime du bot
- 🔌 Latence de la connexion
- 🔗 Boutons pour accéder aux ressources externes

> **💡 Tip**: Personnalisez les URLs des boutons dans `/commands/about.js` (lignes 56, 64, 72)

## 📋 Prérequis

- Node.js v16.x ou supérieur
- npm v7.x ou supérieur
- Un compte Discord développeur
- Un serveur Discord pour tester le bot

## 🆕 Améliorations Récentes (v1.1.0)

### Profil du Bot Amélioré

- ✅ **Commande `/about`** - Affiche un embed stylisé avec:
  - Description complète du bot
  - Statistiques en direct (serveurs, utilisateurs, uptime)
  - Boutons interactifs:
    - 🐙 GitHub
    - 🚀 Invite le Bot
    - 💬 Support Discord
    - 📖 Documentation
- ✅ **Présence Dynamique** - Le bot affiche maintenant 5 activités différentes qui tournent toutes les 30 secondes
  - "Developing new services"
  - "with Discord.js ⚙️"
  - "the servers 👀"
  - "/help for commands"
  - "new features 🚀"

- ✅ **Bio du Bot** - Une description personnalisée affichée sur le profil Discord du bot

### Mises à Jour Techniques

- ⬆️ Discord.js v13 → v14.15.3 (compatibilité améliorée et nouvelles fonctionnalités)
- 🐛 Corrections de bugs et améliorations de stabilité

## 🛠️ Technologies utilisées

- [Discord.js](https://discord.js.org/) v14.15.3
- dotenv v16.5.0
- moment v2.30.1
- express v4.22.1
- octokit v4.1.3

## 📄 Licence

Ce projet est sous licence propriétaire. Voir le fichier [LICENCE](./LICENCE) pour plus de détails.

## 👥 Contribution

Ce projet est privé et ne prend pas de contributions externes pour le moment.

## 🔗 Liens utiles

- [Documentation Discord.js](https://discord.js.org/)
- [Portail Développeur Discord](https://discord.com/developers/applications)
