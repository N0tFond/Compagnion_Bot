const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('annonce')
        .setDescription('📢 】Permet d\'envoyer une annonce dans un salon spécifique')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le salon où envoyer l\'annonce')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('titre')
                .setDescription('Le titre de l\'annonce')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Le contenu de l\'annonce')
                .setRequired(true)),

    async execute(interaction) {
        const staffRole = process.env.STAFF_ROLE;

        // Vérification des permissions
        if (!interaction.member.roles.cache.has(staffRole)) {
            return interaction.reply({
                content: `${process.env.CROSS} ⟩ Vous n'avez pas la permission d'utiliser cette commande.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const channel = interaction.options.getChannel('salon');
        const title = interaction.options.getString('titre');
        const message = interaction.options.getString('message');

        // Vérification que le salon est un salon textuel
        if (!channel.isTextBased()) {
            return interaction.reply({
                content: `${process.env.CROSS} ⟩ Le salon sélectionné doit être un salon textuel.`,
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            const annonceEmbed = new EmbedBuilder()
                .setColor('#ff8c00')
                .setTitle(`📢 ${title}`)
                .setDescription(message)
                .setFooter({
                    text: `Annonce par ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            await channel.send({ content: '@everyone', embeds: [annonceEmbed] });

            await interaction.reply({
                content: `${process.env.CHECK} ⟩ L'annonce a été envoyée avec succès dans ${channel}.`,
                flags: MessageFlags.Ephemeral
            });
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'annonce:', error);
            await interaction.reply({
                content: `${process.env.CROSS} ⟩ Une erreur est survenue lors de l'envoi de l'annonce.`,
                flags: MessageFlags.Ephemeral
            });
        }
    },
};