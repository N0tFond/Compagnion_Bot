const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('🚓 】Permet aux staff de bannir un utilisateur.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Utilisateur à bannir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Raison du bannissement')
                .setRequired(false)),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
            const staffRole = process.env.STAFF_ROLE;

            // Vérifier les permissions avant de fetch
            if (!interaction.member.roles.cache.has(staffRole)) {
                return await interaction.reply({
                    content: `${process.env.CROSS} ⟩ Vous devez être staff pour utiliser cette commande.`,
                    flags: MessageFlags.Ephemeral
                });
            }

            // Différer la réponse pour éviter le timeout
            await interaction.deferReply();

            const member = await interaction.guild.members.fetch(user.id).catch(() => null);

            if (!member) {
                return await interaction.editReply({
                    content: `${process.env.CROSS} ⟩ Utilisateur introuvable dans le serveur.`
                });
            }

            if (member.roles.cache.has(staffRole)) {
                return await interaction.editReply({
                    content: `${process.env.CROSS} ⟩ Vous ne pouvez pas bannir un membre du staff.`
                });
            }

            // Tentative d'envoi d'un message privé à l'utilisateur
            let dmSent = false;
            try {
                await user.send(`⟩ Vous avez été banni du serveur **${interaction.guild.name}** pour la raison suivante : \`${reason}\``);
                dmSent = true;
            } catch (error) {
                if (error.code === 50007) {
                    console.log(`⚠️ ⟩ Impossible d'envoyer un message privé à ${user.tag} (DM fermés)`);
                } else {
                    console.error('⚠️ ⟩ Erreur lors de l\'envoi du message privé:', error);
                }
            }

            // Bannir l'utilisateur
            try {
                await member.ban({ reason: reason });

                // Message de confirmation avec indication si le DM a été envoyé
                let confirmMessage = `${process.env.CHECK} ⟩ ${user.tag} a été banni avec succès pour la raison : *${reason}* !`;
                if (!dmSent) {
                    confirmMessage += `\n⚠️ ⟩ L'utilisateur n'a pas pu être notifié par message privé.`;
                }

                await interaction.editReply({ content: confirmMessage });
                console.log(`🚓 ⟩ ${user.tag} a été banni du serveur ${interaction.guild.name} par ${interaction.user.username} \n→ raison : ${reason}`);
            } catch (error) {
                console.error('⚠️ ⟩ Erreur lors du bannissement de l\'utilisateur:', error);
                await interaction.editReply({ content: `${process.env.CROSS} ⟩ Une erreur est survenue lors du bannissement de l'utilisateur.` });
            }
        } catch (error) {
            console.error('Erreur dans la commande ban:', error);
            try {
                if (interaction.deferred && !interaction.replied) {
                    await interaction.editReply({
                        content: `${process.env.CROSS} ⟩ Une erreur est survenue.`
                    });
                } else if (!interaction.replied) {
                    await interaction.reply({
                        content: `${process.env.CROSS} ⟩ Une erreur est survenue.`,
                        flags: MessageFlags.Ephemeral
                    });
                }
            } catch (replyError) {
                console.error('Impossible de répondre à l\'interaction:', replyError);
            }
        }
    },
}