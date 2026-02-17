const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    // Définition de la commande slash
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Permet de se vérifier et obtenir un rôle sur le serveur'),

    // Exécution de la commande
    async execute(interaction) {
        try {
            // Vérifier les permissions du bot
            if (!interaction.guild.members.me.permissions.has('ManageRoles')) {
                return await interaction.reply({
                    content: "❌ Le bot n'a pas la permission de gérer les rôles. Veuillez vérifier les permissions.",
                    flags: MessageFlags.Ephemeral
                });
            }

            // ID du rôle à attribuer
            const roleId = '1367978096166178897';
            // ID du rôle non vérifié à supprimer
            const unverifiedRoleId = '1367978118685659267';

            // Récupérer les rôles
            const role = interaction.guild.roles.cache.get(roleId);
            const unverifiedRole = interaction.guild.roles.cache.get(unverifiedRoleId);

            // Vérifier si les rôles existent
            if (!role) {
                return await interaction.reply({
                    content: "⚠️ Le rôle de vérification n'a pas été trouvé. Veuillez contacter un administrateur.",
                    flags: MessageFlags.Ephemeral
                });
            }
            if (!unverifiedRole) {
                console.log(`Rôle non vérifié avec l'ID ${unverifiedRoleId} introuvable.`);
                return await interaction.reply({
                    content: "⚠️ Le rôle non vérifié n'a pas été trouvé. Veuillez contacter un administrateur.",
                    flags: MessageFlags.Ephemeral
                });
            }

            // Vérifier la hiérarchie des rôles
            if (unverifiedRole.position > interaction.guild.members.me.roles.highest.position) {
                return await interaction.reply({
                    content: "❌ Le bot ne peut pas supprimer le rôle non vérifié car il est plus haut dans la hiérarchie.",
                    flags: MessageFlags.Ephemeral
                });
            }

            // Vérifier si l'utilisateur a déjà le rôle vérifié
            if (interaction.member.roles.cache.has(roleId)) {
                return await interaction.reply({
                    content: "✅ Vous êtes déjà vérifié(e) sur ce serveur!",
                    flags: MessageFlags.Ephemeral
                });
            }

            // Attribuer le rôle vérifié
            await interaction.member.roles.add(role);

            // Supprimer le rôle non vérifié si l'utilisateur l'a
            const member = await interaction.guild.members.fetch(interaction.user.id); // Rafraîchir les données du membre
            if (member.roles.cache.has(unverifiedRoleId)) {
                try {
                    await member.roles.remove(unverifiedRole);
                    console.log(`Rôle non vérifié supprimé pour ${interaction.user.tag}`);
                } catch (error) {
                    console.error('Erreur lors de la suppression du rôle non vérifié:', error);
                    await interaction.reply({
                        content: "❌ Une erreur s'est produite lors de la suppression du rôle non vérifié.",
                        flags: MessageFlags.Ephemeral
                    });
                }
            } else {
                console.log(`L'utilisateur ${interaction.user.tag} n'avait pas le rôle non vérifié.`);
            }

            // Répondre à l'utilisateur
            await interaction.reply({
                content: `✅ Félicitations! Vous avez été vérifié(e) et avez reçu le rôle **${role.name}**!`,
                flags: MessageFlags.Ephemeral
            });

            // Log dans un canal de logs
            const logChannelId = '1367978187438424125';
            const logChannel = interaction.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                logChannel.send(`📝 L'utilisateur **${interaction.user.tag}** s'est vérifié et a reçu le rôle **${role.name}**.`);
            }

        } catch (error) {
            console.error('Erreur lors de la vérification:', error);
            await interaction.reply({
                content: "❌ Une erreur s'est produite lors de la vérification. Veuillez réessayer plus tard ou contacter un administrateur.",
                flags: MessageFlags.Ephemeral
            });
        }
    },
};