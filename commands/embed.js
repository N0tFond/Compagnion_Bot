const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('📝 】Permet d\'envoyer un embed personnalisé dans un salon')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le salon où envoyer l\'embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('titre')
                .setDescription('Le titre de l\'embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Le contenu de l\'embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('couleur')
                .setDescription('La couleur de l\'embed (en format hexadécimal, ex: #ff0000)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('L\'URL de l\'image à ajouter dans l\'embed')
                .setRequired(false)),

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
        const description = interaction.options.getString('description');
        const color = interaction.options.getString('couleur') || '#5E7381';
        const imageUrl = interaction.options.getString('image');

        // Vérification que le salon est un salon textuel
        if (!channel.isTextBased()) {
            return interaction.reply({
                content: `${process.env.CROSS} ⟩ Le salon sélectionné doit être un salon textuel.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color);

        if (imageUrl) {
            embed.setImage(imageUrl);
        }

        await channel.send({ embeds: [embed] });
        return interaction.reply({
            content: `${process.env.CHECK} ⟩ L'embed a été envoyé avec succès dans ${channel}`,
            flags: MessageFlags.Ephemeral
        });
    }
};