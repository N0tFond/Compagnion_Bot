const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Affiche les informations de l\'utilisateur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur dont vous voulez voir l\'activité')
                .setRequired(false)),
    async execute(interaction) {
        try {
            // Différer la réponse pour éviter le timeout
            await interaction.deferReply();

            // Récupérer l'utilisateur spécifié ou utiliser l'auteur de la commande
            const targetUser = interaction.options.getUser('utilisateur') || interaction.user;
            const targetMember = await interaction.guild.members.fetch(targetUser.id);

            const joinDate = moment(targetMember.joinedAt).format('DD MMMM YYYY');
            const activities = targetMember.presence?.activities
                ? targetMember.presence.activities.map((activity, index) => {
                    if (activity.type === 'LISTENING' && (activity.name === 'Spotify' || activity.name === 'Apple Music')) {
                        return `**${index + 1}. Écoute Spotify**\n> Artiste : ${activity.state}\n> Musique : ${activity.details} \n> Album : ${activity.assets?.largeText || 'Inconnu'}`;
                    }
                    let details = `**${index + 1}. ${activity.name}**`;
                    if (activity.details) details += `\n> Détails : ${activity.details}`;
                    if (activity.state) details += `\n> État : ${activity.state}`;
                    return details;
                }).join('\n\n')
                : 'Aucune activité';

            // Récupérer les rôles de l'utilisateur (en excluant @everyone)
            const roles = targetMember.roles.cache
                .filter(role => role.name !== '@everyone')
                .map(role => role)
                .join(', ') || 'Aucun rôle';

            const userEmbed = new EmbedBuilder()
                .setColor('#00e600')
                .setTitle(`Informations de ${targetUser.username}`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Utilisateur', value: `${targetUser}`, inline: true },
                    { name: 'Photo de profil', value: `[Lien vers l'avatar](${targetUser.displayAvatarURL({ dynamic: true })})`, inline: true },
                    { name: 'Rôles', value: roles, inline: false },
                    { name: 'Activités', value: activities, inline: false },
                    { name: 'Date de rejoint', value: joinDate, inline: false },
                    { name: 'Commande supplémentaire', value: 'Utilisez `/activite` pour plus d\'informations sur les activité de l\'utilisateur.', inline: false },
                );

            await interaction.editReply({ embeds: [userEmbed] });
        } catch (error) {
            console.error('Erreur dans la commande user:', error);
            try {
                if (interaction.deferred && !interaction.replied) {
                    await interaction.editReply({
                        content: 'Une erreur est survenue lors de la récupération des informations de l\'utilisateur.'
                    });
                } else if (!interaction.replied) {
                    await interaction.reply({
                        content: 'Une erreur est survenue lors de la récupération des informations de l\'utilisateur.',
                        flags: MessageFlags.Ephemeral
                    });
                }
            } catch (replyError) {
                console.error('Impossible de répondre à l\'interaction:', replyError);
            }
        }
    },
}