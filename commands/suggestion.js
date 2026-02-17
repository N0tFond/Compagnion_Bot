const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestion')
        .setDescription('📝 Soumettre une suggestion pour le serveur'),

    async execute(interaction) {
        try {
            // Création du modal
            const modal = new ModalBuilder()
                .setCustomId('suggestionModal')
                .setTitle('Nouvelle Suggestion');

            // Création du champ pour le titre de la suggestion
            const titleInput = new TextInputBuilder()
                .setCustomId('titleInput')
                .setLabel('Titre de votre suggestion')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Entrez un titre bref et descriptif')
                .setMaxLength(100)
                .setMinLength(1)
                .setRequired(true);

            // Création du champ pour la description de la suggestion
            const descriptionInput = new TextInputBuilder()
                .setCustomId('descriptionInput')
                .setLabel('Description détaillée')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Décrivez votre suggestion en détail...')
                .setMaxLength(1000)
                .setMinLength(10)
                .setRequired(true);

            // Création des rangées d'action pour chaque champ
            const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
            const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);

            // Ajout des composants au modal
            modal.addComponents(firstActionRow, secondActionRow);

            // Affichage du modal
            await interaction.showModal(modal);
        } catch (error) {
            console.error('Erreur lors de la création du modal:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ Une erreur est survenue lors de la création du formulaire de suggestion.',
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    },
};