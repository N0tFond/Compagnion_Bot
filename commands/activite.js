const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, MessageFlags, ActivityType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activité')
        .setDescription('Affiche l\'activité d\'un utilisateur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur dont vous voulez voir l\'activité')
                .setRequired(false)),

    async execute(interaction) {
        try {
            // Différer la réponse pour éviter le timeout
            await interaction.deferReply();

            // Récupère l'utilisateur mentionné ou l'utilisateur qui a exécuté la commande
            const user = interaction.options.getUser('utilisateur') || interaction.user;
            console.log(`Recherche d'activité pour l'utilisateur: ${user.username} (${user.id})`);

            const member = await interaction.guild.members.fetch(user.id).catch(error => {
                console.error(`Erreur lors de la récupération du membre: ${error}`);
                return null;
            });

            if (!member) {
                console.log(`Membre non trouvé pour l'utilisateur: ${user.username}`);
                return await interaction.editReply({
                    content: `Je n'ai pas pu trouver ${user.username} sur ce serveur.`
                });
            }

            // Récupère la présence de l'utilisateur
            if (!member.presence) {
                console.log(`Pas de présence détectée pour ${user.username}`);
                return await interaction.editReply({
                    content: `${user.username} n'a aucune activité en cours.`
                });
            }

            const activities = member.presence.activities;

            if (!activities || activities.length === 0) {
                console.log(`Pas d'activités pour ${user.username}`);
                return await interaction.editReply({
                    content: `${user.username} n'a aucune activité en cours.`
                });
            }

            // Couleur de l'embed basée sur le statut
            const statusColors = {
                online: '#43B581',
                idle: '#FAA61A',
                dnd: '#F04747',
                offline: '#747F8D'
            };
            const userStatus = member.presence.status || 'offline';
            const embedColor = process.env.COLOR_GREEN || statusColors[userStatus] || '#5865F2';

            // Créer une description basée sur le nombre d'activités
            const activityCount = activities.length;
            const description = activityCount > 1
                ? `╰┈➤ ${activityCount} activités en cours`
                : `╰┈➤ Activité en cours`;

            // Crée un embed élégant pour afficher les activités
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({
                    name: `Activité de ${user.username}`,
                    iconURL: user.displayAvatarURL({ dynamic: true })
                })
                .setDescription(description)
                .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setTimestamp()
                .setFooter({
                    text: `Demandé par ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            // Parcourt toutes les activités
            for (let i = 0; i < activities.length; i++) {
                const activity = activities[i];
                console.log(`Activité ${i + 1}:`, {
                    name: activity.name,
                    type: activity.type,
                    details: activity.details,
                    state: activity.state
                });

                let activityDetails = '';

                try {
                    // Gestion de Spotify
                    if (activity.name === 'Spotify' && activity.type === ActivityType.Listening) {
                        console.log(`Activité Spotify détectée`);

                        const songName = activity.details || 'Titre inconnu';
                        const artist = activity.state || 'Artiste inconnu';
                        const albumName = activity.assets?.largeText || null;

                        activityDetails = `> 🎵 **Écoute sur Spotify**\n`;
                        activityDetails += `> \n`;
                        activityDetails += `> 🎼 **Titre**\n> \`${this.sanitizeText(songName)}\`\n`;
                        activityDetails += `> \n`;
                        activityDetails += `> 🎤 **Artiste**\n> \`${this.sanitizeText(artist)}\``;

                        if (albumName) {
                            activityDetails += `\n> \n> 💿 **Album**\n> \`${this.sanitizeText(albumName)}\``;
                        }

                        // Ajoute l'image de l'album si disponible
                        if (activity.assets?.largeImage && activity.assets.largeImage.startsWith('spotify:')) {
                            const spotifyImageId = activity.assets.largeImage.split(':')[1];
                            if (spotifyImageId) {
                                embed.setImage(`https://i.scdn.co/image/${spotifyImageId}`);
                            }
                        }
                    }

                    // Gestion d'Apple Music
                    else if (activity.name === 'Apple Music' && activity.type === ActivityType.Listening) {
                        console.log(`Activité Apple Music détectée`);

                        const songName = activity.details || 'Titre inconnu';
                        const artist = activity.state || 'Artiste inconnu';
                        const albumName = activity.assets?.largeText || null;

                        activityDetails = `> 🍎 **Écoute sur Apple Music**\n`;
                        activityDetails += `> \n`;
                        activityDetails += `> 🎼 **Titre**\n> \`${this.sanitizeText(songName)}\`\n`;
                        activityDetails += `> \n`;
                        activityDetails += `> 🎤 **Artiste**\n> \`${this.sanitizeText(artist)}\``;

                        if (albumName) {
                            activityDetails += `\n> \n> 💿 **Album**\n> \`${this.sanitizeText(albumName)}\``;
                        }

                        // Ajoute l'image de l'album si disponible
                        if (activity.assets?.largeImage) {
                            try {
                                // Apple Music peut avoir différents formats d'URL
                                if (activity.assets.largeImage.startsWith('http')) {
                                    embed.setImage(activity.assets.largeImage);
                                } else if (activity.assets.largeImage.startsWith('mp:')) {
                                    const appleMusicId = activity.assets.largeImage.split(':')[1];
                                    if (appleMusicId) {
                                        embed.setImage(`https://is1-ssl.mzstatic.com/image/thumb/${appleMusicId}`);
                                    }
                                }
                            } catch (imgError) {
                                console.error(`Erreur image Apple Music: ${imgError}`);
                            }
                        }
                    }
                    // Autres activités musicales (type LISTENING)
                    else if (activity.type === ActivityType.Listening) {
                        const activityName = activity.name || 'Service musical';
                        const songName = activity.details || '';
                        const artist = activity.state || '';

                        activityDetails = `> 🎧 **Écoute sur ${this.sanitizeText(activityName)}**\n> `;

                        if (songName) {
                            activityDetails += `\n> 🎼 \`${this.sanitizeText(songName)}\``;
                        }
                        if (artist) {
                            activityDetails += `\n> 🎤 \`${this.sanitizeText(artist)}\``;
                        }
                    }
                    // Jeux (type PLAYING)
                    else if (activity.type === ActivityType.Playing) {
                        const gameName = activity.name || 'Jeu inconnu';
                        activityDetails = `> 🎮 **Joue à ${this.sanitizeText(gameName)}**\n> `;

                        if (activity.details) {
                            activityDetails += `\n> 📋 ${this.sanitizeText(activity.details)}`;
                        }
                        if (activity.state) {
                            activityDetails += `\n> 📊 ${this.sanitizeText(activity.state)}`;
                        }
                    }
                    // Streaming (type STREAMING)
                    else if (activity.type === ActivityType.Streaming) {
                        const streamName = activity.name || 'Stream';
                        activityDetails = `> 📺 **En direct**\n> `;
                        activityDetails += `\n> 🎬 \`${this.sanitizeText(streamName)}\``;

                        if (activity.details) {
                            activityDetails += `\n> 📝 ${this.sanitizeText(activity.details)}`;
                        }
                        if (activity.url) {
                            activityDetails += `\n> \n> 🔗 [**Voir le stream**](${activity.url})`;
                        }
                    }
                    // Regarder (type WATCHING)
                    else if (activity.type === ActivityType.Watching) {
                        const watchName = activity.name || 'Contenu';
                        activityDetails = `> 👀 **Regarde**\n> `;
                        activityDetails += `\n> 📺 \`${this.sanitizeText(watchName)}\``;

                        if (activity.details) {
                            activityDetails += `\n> 📝 ${this.sanitizeText(activity.details)}`;
                        }
                        if (activity.state) {
                            activityDetails += `\n> 📊 ${this.sanitizeText(activity.state)}`;
                        }
                    }
                    // Compétition (type COMPETING)
                    else if (activity.type === ActivityType.Competing) {
                        const competitionName = activity.name || 'Compétition';
                        activityDetails = `> 🏆 **En compétition**\n> `;
                        activityDetails += `\n> 🎯 \`${this.sanitizeText(competitionName)}\``;

                        if (activity.details) {
                            activityDetails += `\n> 📝 ${this.sanitizeText(activity.details)}`;
                        }
                    }
                    // Activité custom ou autres
                    else {
                        const activityName = activity.name || 'Activité';
                        activityDetails = `> ✨ **Activité personnalisée**\n> `;
                        activityDetails += `\n> 📌 \`${this.sanitizeText(activityName)}\``;

                        if (activity.state) {
                            activityDetails += `\n> 📝 ${this.sanitizeText(activity.state)}`;
                        }
                    }

                    // Validation finale avant d'ajouter le champ
                    if (activityDetails && activityDetails.trim().length > 0) {
                        // Limite à 1024 caractères (limite Discord)
                        if (activityDetails.length > 1024) {
                            activityDetails = activityDetails.substring(0, 1021) + '...';
                        }

                        // S'assurer que la valeur n'est pas vide après nettoyage
                        const trimmedDetails = activityDetails.trim();
                        if (trimmedDetails.length > 0) {
                            // Utilise des emojis numérotés pour un meilleur design
                            const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
                            const fieldName = activities.length > 1
                                ? `${numberEmojis[i] || `${i + 1}.`} Activité ${i + 1}`
                                : '🎯 Activité actuelle';
                            embed.addFields({
                                name: fieldName,
                                value: trimmedDetails,
                                inline: false
                            });
                        }
                    }
                } catch (activityError) {
                    console.error(`Erreur lors du traitement de l'activité ${i + 1}:`, activityError);
                    // Continue avec l'activité suivante au lieu de crasher
                }
            }

            // Vérifie qu'au moins un champ a été ajouté
            if (embed.data.fields && embed.data.fields.length > 0) {
                console.log(`Réponse envoyée avec ${embed.data.fields.length} activité(s)`);
                return await interaction.editReply({
                    embeds: [embed]
                });
            } else {
                console.log(`Aucune activité valide trouvée pour ${user.username}`);
                return await interaction.editReply({
                    content: `${user.username} n'a aucune activité affichable en ce moment.`
                });
            }

        } catch (error) {
            console.error(`Erreur générale dans la commande activité:`, error);
            console.error(`Stack trace:`, error.stack);

            try {
                const errorMessage = `Une erreur est survenue lors de la récupération des activités.`;

                if (interaction.deferred && !interaction.replied) {
                    return await interaction.editReply({
                        content: errorMessage
                    });
                } else if (!interaction.replied && !interaction.deferred) {
                    return await interaction.reply({
                        content: errorMessage,
                        flags: MessageFlags.Ephemeral
                    });
                }
            } catch (replyError) {
                console.error(`Impossible de répondre à l'interaction:`, replyError);
            }
        }
    },

    // Fonction utilitaire pour nettoyer le texte
    sanitizeText(text) {
        if (!text) return 'Non spécifié';
        // Limite la longueur et échappe les caractères markdown problématiques
        return String(text)
            .substring(0, 200)
            .replace(/`/g, '\'')
            .replace(/\*/g, '')
            .trim() || 'Non spécifié';
    }
}