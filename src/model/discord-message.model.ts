import { RichEmbed } from 'discord.js';

export class DiscordMessage extends RichEmbed {
    // Overwrite to avoid non-required
    public url: string;
    public title: string;
}
