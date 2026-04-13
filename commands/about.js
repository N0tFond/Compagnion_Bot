const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { version: botVersion } = require('../package.json');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('ℹ️ ⟩ À propos du bot Companion'),

    async execute(interaction) {
        const client = interaction.client;
        const uptime = client.uptime;
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

        // Créer l'embed principal
        const aboutEmbed = new EmbedBuilder()
            .setColor(`#${process.env.COLOR_INFO}`)
            .setAuthor({
                name: `${client.user.username} - About`,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(
                `**🤖 Companion Bot**\n\n` +
                `Un bot Discord multifonctionnel conçu pour améliorer votre expérience serveur avec des outils utiles et des services innovants.\n\n` +
                `✨ **Fonctionnalités principales:**\n` +
                `• 🎭 Gestion du serveur et des modérations\n` +
                `• 📊 Commandes informationnelles\n` +
                `• 💬 Système de suggestions\n` +
                `• 🔗 Intégrations GitHub\n` +
                `• 📝 Et bien d'autres...\n`
            )
            .addFields(
                {
                    name: '👨‍💻 Développeur',
                    value: process.env.FOOTER_MSG.replace('Développé par ', ''),
                    inline: true
                },
                {
                    name: '📦 Versions',
                    value: `Bot: v${botVersion}\nDiscord.js: v14.x`,
                    inline: true
                },
                {
                    name: '📈 Statistiques',
                    value: `Serveurs: **${client.guilds.cache.size}**\nUtilisateurs: **${client.users.cache.size}**`,
                    inline: true
                },
                {
                    name: '⏱️ Uptime',
                    value: `${days}j ${hours}h ${minutes}m`,
                    inline: true
                },
                {
                    name: '🔌 Latence',
                    value: `${client.ws.ping}ms`,
                    inline: true
                },
                {
                    name: '📍 Statut',
                    value: `🟢 En ligne et opérationnel`,
                    inline: true
                },
                {
                    name: '📚 Commandes disponibles',
                    value: `${client.commands.size} commandes chargées`,
                    inline: true
                },
                {
                    name: '🆔 Bot ID',
                    value: `\`${client.user.id}\``,
                    inline: true
                }
            )
            .setFooter({
                text: process.env.FOOTER_MSG,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        // Créer les boutons avec les liens
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('GitHub')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://github.com/N0tFound')
                    .setEmoji('🐙'),
                new ButtonBuilder()
                    .setLabel('Invite le Bot')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${process.env.APP_ID}&permissions=8&scope=bot%20applications.commands`)
                    .setEmoji('🚀'),
                new ButtonBuilder()
                    .setLabel('Support Discord')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/NBUjbcCCE9')
                    .setEmoji('💬'),
            );

        await interaction.reply({
            embeds: [aboutEmbed],
            components: [buttonRow]
        });
    },
};
