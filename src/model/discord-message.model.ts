export class DiscordMessage {
    author?: { name: string; url?: string; icon_url?: string; };
    color?: number;
    description?: string;
    fields?: { name: string; value: string; inline?: boolean; }[];
    footer?: { text?: string; icon_url?: string; };
    image?: { url: string; height?: number; width?: number; };
    thumbnail?: { url: string; height?: number; width?: number; };
    timestamp?: Date;
    title?: string;
    url?: string;
    
    setAuthor(name: string, url?: string, icon_url?: string): this{
        this.author = {name: name, url: url, icon_url: icon_url};
        return this;
    }
    setColor(color: number): this{
        this.color = color;
        return this;
    }
    setDescription(description: string): this{
        this.description = description.substring(0, 320);
        if (description.length > 320) {
            this.description += '...';
        }
        return this;
    }
    setFields(fields: [{name: string, value: string, inline?: boolean}]): this{
        this.fields = fields;
        return this;
    }
    addField(name: string, value: string, inline?: boolean): this{
        this.fields.push({name: name, value: value, inline: inline});
        return this;
    }
    setFooter(text?: string, icon_url?: string): this{
        this.footer = {text: text, icon_url: icon_url};
        return this;
    }
    setImage(url: string, height?: number, width?: number): this{
        this.image = {url: url, height: height, width: width};
        return this;
    }
    setThumbnail(url: string, height?: number, width?: number): this{
        this.thumbnail = {url: url, height: height, width: width};
        return this;
    }
    setTimestamp(timestamp: Date): this{
        this.timestamp = timestamp;
        return this;
    }
    setTitle(title: string): this{
        this.title = title.substring(0, 80);
        if (title.length > 80) {
            this.title += '...';
        }
        return this;
    }
    setUrl(url: string): this{
        this.url = url;
        return this;
    }
}
