const { PresenceUpdateStatus, ActivityType } = require('discord.js');

const ReadyHandler = (client) => {
    client.once('ready', () => {
        // Définir la bio du bot
        client.user.setAbout('🤖 Companion Bot - Utility & Services\n📚 /help pour les commandes\n🔗 Multi-serveurs');

        // Liste des activités en rotation
        const activities = [
            { name: 'Developing new services', type: ActivityType.Playing },
            { name: 'with Discord.js ⚙️', type: ActivityType.Playing },
            { name: 'the servers 👀', type: ActivityType.Watching },
            { name: '/help for commands', type: ActivityType.Playing },
            { name: 'new features 🚀', type: ActivityType.Playing },
        ];

        let activityIndex = 0;

        // Définir la première activité
        client.user.setPresence({
            activities: [activities[activityIndex]],
            status: PresenceUpdateStatus.Online
        });

        // Changer d'activité toutes les 30 secondes
        setInterval(() => {
            activityIndex = (activityIndex + 1) % activities.length;
            client.user.setPresence({
                activities: [activities[activityIndex]],
                status: PresenceUpdateStatus.Online
            });
        }, 30000);

        console.log(`⟩ Connecté en tant que ${client.user.username}`);
        console.log(`⟩ Bio du bot définie avec succès`);
        console.log(`⟩ ${activities.length} activités en rotation chargées`);
    });
};

module.exports = ReadyHandler;