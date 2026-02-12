# youtube-channel-rss

Extract RSS feed URLs from YouTube channel pages.

## Usage

1. Create a `youtube-input.txt` file with one channel URL per line:

```
https://youtube.com/@channelone
https://youtube.com/@channeltwo
```

2. Run the script:

```sh
deno run --allow-net --allow-read --allow-write youtube_channel_to_rss_url.ts
```

3. Results are written to `youtube-output.json` with the following structure:

```json
{
  "rssUrls": [
    {
      "title": "Channel Name",
      "description": "Channel description",
      "tags": "tag1||tag2||tag3",
      "channelUrl": "https://youtube.com/@channel",
      "rssUrl": "https://www.youtube.com/feeds/videos.xml?channel_id=..."
    }
  ]
}
```

## Requirements

- [Deno](https://deno.land/)
