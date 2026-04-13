const { PresenceUpdateStatus, ActivityType } = require('discord.js');

const ReadyHandler = (client) => {
    client.once('ready', () => {
        // Note: La bio du bot doit être définie manuellement dans les paramètres du profil Discord
        // Car Discord.js n'a pas d'API pour modifier la bio de manière programmatique

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
        console.log(`⟩ ${activities.length} activités en rotation chargées`);
        console.log(`⟩ 💡 N'oubliez pas de configurer la bio du bot dans les paramètres Discord`);
    });
};

module.exports = ReadyHandler;