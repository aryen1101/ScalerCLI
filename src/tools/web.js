import axios from "axios";

export async function fetchWebpage(url = "") {
  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
      responseType: "text",
    });

    let cleaned = data
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<svg[\s\S]*?<\/svg>/gi, "")
      .replace(/<img[^>]*>/gi, "")
      .replace(/<link[^>]*>/gi, "")
      .replace(/<meta[^>]*>/gi, "");

    const usefulTags = [];
    const navMatches = cleaned.match(/<nav[\s\S]*?<\/nav>/gi) || [];
    navMatches.forEach(n => usefulTags.push("NAV: " + n.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()));

    const headings = cleaned.match(/<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/gi) || [];
    headings.forEach(h => usefulTags.push("HEADING: " + h.replace(/<[^>]+>/g, "").trim()));

    const buttons = cleaned.match(/<button[^>]*>[\s\S]*?<\/button>/gi) || [];
    buttons.slice(0, 10).forEach(b => usefulTags.push("BUTTON: " + b.replace(/<[^>]+>/g, "").trim()));

    const footerMatch = cleaned.match(/<footer[\s\S]*?<\/footer>/gi) || [];
    footerMatch.forEach(f => usefulTags.push("FOOTER: " + f.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 800)));

    const colorMatches = data.match(/color\s*:\s*#[0-9a-fA-F]{3,6}/gi) || [];
    const bgMatches = data.match(/background(?:-color)?\s*:\s*#[0-9a-fA-F]{3,6}/gi) || [];
    const allColors = [...new Set([...colorMatches, ...bgMatches])].slice(0, 20);
    if (allColors.length) usefulTags.push("COLORS FOUND: " + allColors.join(", "));

    const result = usefulTags.join("\n\n");
    return result.length > 100
      ? result.slice(0, 6000)
      : "Page fetched but minimal content extracted. Use your knowledge of this website to build the clone.";

  } catch (err) {
    return `Failed to fetch "${url}": ${err.message}. Use your training knowledge of this website to build the clone.`;
  }
}