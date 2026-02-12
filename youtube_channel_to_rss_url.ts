import { DOMParser } from "jsr:@b-fuze/deno-dom";

const INITIAL_DELAY = 100;
const DELAY_INCREASE = 1.5;

// https://youtube.com/@channelone
// https://youtube.com/@channeltwo
// ...
const INPUT = "./youtube-input.txt";
const OUTPUT = "./youtube-output.json";

let delay = INITIAL_DELAY;
const channels = (await Deno.readTextFile(INPUT)).split("\n").filter(Boolean);
const rssUrls = [];

for (let i = 0; i < channels.length; i++) {
  const channelUrl = channels[i];
  const response = await fetch(channelUrl);

  if (response.status !== 200) {
    console.error("Bad response");
    console.error(channelUrl);
    console.error(response.status);
    console.error(response);
    delay *= DELAY_INCREASE;
    i--;
    const realDelay = Math.floor(delay + Math.random() * delay * 0.1);
    console.log(`[${i + 1}/${channels.length}]`, ", waiting", realDelay, "ms");
    await new Promise((resolve) => setTimeout(resolve, realDelay));
    continue;
  }

  const responseText = await response.text();

  try {
    const parser = new DOMParser();
    const responseDocument = parser.parseFromString(responseText, "text/html");

    const rssUrl = Array.from(responseDocument.querySelectorAll("link"))
      .find((l) => l.getAttribute("type") === "application/rss+xml")
      .getAttribute("href")
      .trim();

    const title = Array.from(responseDocument.querySelectorAll("meta"))
      .find((m) => m.getAttribute("property") === "og:title")
      .getAttribute("content")
      .trim();

    const description = Array.from(responseDocument.querySelectorAll("meta"))
      .find((m) => m.getAttribute("name") === "description")
      .getAttribute("content")
      .trim();

    const tags = Array.from(responseDocument.querySelectorAll("meta"))
      .filter((m) => m.getAttribute("property") === "og:video:tag")
      .map((m) => m.getAttribute("content").trim())
      .join("||");

    console.log(
      JSON.stringify({ title, description, tags, channelUrl, rssUrl }, null, 2),
    );
    rssUrls.push({ title, description, tags, channelUrl, rssUrl });

    await Deno.writeTextFile(OUTPUT, JSON.stringify({ rssUrls }, null, 2));

    delay = INITIAL_DELAY;
  } catch (error) {
    console.error(channelUrl);
    console.error(error);
    delay *= DELAY_INCREASE;
    i--;
  }

  const realDelay = Math.floor(delay + Math.random() * delay * 0.1);
  console.log(`[${i + 1}/${channels.length}]`, ", waiting", realDelay, "ms");
  await new Promise((resolve) => setTimeout(resolve, realDelay));
}
