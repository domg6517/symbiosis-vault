// Discord webhook helper for Symbiosis Vault
// To use an env var instead: add DISCORD_WEBHOOK_URL to Vercel project settings

const WEBHOOK_URL =
  process.env.DISCORD_WEBHOOK_URL ||
  "https://discord.com/api/webhooks/1486126908499427378/u0EqAyQQXYPvK-TlhFU0LG-0Zssl2jzuInz7-7Ey5mxcct3ikDrKb4aMtkbzULoK5Cs8";

/**
 * Post an embed to the Discord activity channel.
 * Silently swallows errors so Discord never breaks the main flow.
 */
export async function notifyDiscord(embed) {
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch (_) {}
}

// ─── Embed builders ────────────────────────────────────────────

export function cardLinkedEmbed({ username, chipId, perspective, rarity, songTitle }) {
  const isRare = rarity === "rare";
  return {
    color: isRare ? 0xE4BC4A : 0x6B6B6B,
    author: { name: "Symbiosis Vault", url: "https://vault.jackandjack.store" },
    title: isRare ? "\u2B50 Rare Card Claimed" : "\uD83C\uDCCF Card Claimed",
    description: `**${username}** just linked a ${isRare ? "Rare" : "Common"} card to their Vault.`,
    fields: [
      { name: "Song", value: songTitle, inline: true },
      { name: "Perspective", value: perspective, inline: true },
      { name: "Chip", value: `\`${chipId}\``, inline: true },
    ],
    footer: { text: "vault.jackandjack.store" },
    timestamp: new Date().toISOString(),
  };
}

export function ultraRareClaimedEmbed({ username, chipId, perspective, songTitle }) {
  return {
    color: 0xC8A030,
    author: { name: "Symbiosis Vault", url: "https://vault.jackandjack.store" },
    title: "\u2726 1 OF 1 CLAIMED",
    description: `**${username}** just found the ultra rare 1/1.\n\n*Only one person in the world can own this card.*`,
    fields: [
      { name: "Song", value: songTitle, inline: true },
      { name: "Perspective", value: perspective, inline: true },
      { name: "Chip", value: `\`${chipId}\``, inline: true },
    ],
    footer: { text: "vault.jackandjack.store" },
    timestamp: new Date().toISOString(),
  };
}

export function badgeEarnedEmbed({ username, badgeIcon, badgeLabel }) {
  return {
    color: 0xFFD700,
    author: { name: "Symbiosis Vault", url: "https://vault.jackandjack.store" },
    title: `${badgeIcon} Badge Unlocked`,
    description: `**${username}** just earned the **${badgeLabel}** badge!`,
    footer: { text: "vault.jackandjack.store" },
    timestamp: new Date().toISOString(),
  };
}
