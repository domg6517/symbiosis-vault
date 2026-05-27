// Discord webhook helper for Symbiosis Vault
// Set DISCORD_WEBHOOK_URL in Vercel project settings (Settings → Environment Variables)

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

/**
 * Post an embed to the Discord activity channel.
 * Silently swallows errors so Discord never breaks the main flow.
 */
export async function notifyDiscord(embed) {
  if (!WEBHOOK_URL) return;
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
    console.log("[DISCORD_HTTP] status=" + res.status + " ok=" + res.ok);
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.log("[DISCORD_HTTP] error body=" + txt.substring(0, 200));
    }
  } catch (err) { console.log("[DISCORD_HTTP] fetch threw: " + err.message); }
}

// ─── Rarity helpers ────────────────────────────────────────────

function getRarityConfig(rarity) {
  switch (rarity) {
    case "ultra_rare":
    case "super_rare":
      return { color: 0xC8A030, label: "Ultra Rare", icon: "✦" };
    case "rare":
      return { color: 0xE4BC4A, label: "Rare", icon: "⭐" };
    default:
      return { color: 0x6B6B6B, label: "Common", icon: "🃏" };
  }
}

// ─── Embed builders ────────────────────────────────────────────

export function cardLinkedEmbed({ username, chipId, perspective, rarity, songTitle, imageUrl = null }) {
  const { color, label, icon } = getRarityConfig(rarity);
  const isUltra = rarity === "ultra_rare" || rarity === "super_rare";

  const embed = {
    color,
    author: { name: "Symbiosis Vault", url: "https://vault.jackandjack.store" },
    title: isUltra ? `${icon} 1 OF 1 CLAIMED` : `${icon} ${label} Card Claimed`,
    description: isUltra
      ? `**${username}** just found the ultra rare 1/1.\n\n*Only one person in the world can own this card.*`
      : `**${username}** just linked a ${label} card to their Vault.`,
    fields: [
      { name: "Song", value: songTitle, inline: true },
      { name: "Perspective", value: perspective, inline: true },
      { name: "Chip", value: `\`${chipId}\``, inline: true },
    ],
    footer: { text: "vault.jackandjack.store" },
    timestamp: new Date().toISOString(),
  };
  if (imageUrl) embed.thumbnail = { url: imageUrl };
  return embed;
}

export function ultraRareClaimedEmbed({ username, chipId, perspective, songTitle, imageUrl = null }) {
  const embed = {
    color: 0xC8A030,
    author: { name: "Symbiosis Vault", url: "https://vault.jackandjack.store" },
    title: "✦ 1 OF 1 CLAIMED",
    description: `**${username}** just found the ultra rare 1/1.\n\n*Only one person in the world can own this card.*`,
    fields: [
      { name: "Song", value: songTitle, inline: true },
      { name: "Perspective", value: perspective, inline: true },
      { name: "Chip", value: `\`${chipId}\``, inline: true },
    ],
    footer: { text: "vault.jackandjack.store" },
    timestamp: new Date().toISOString(),
  };
  if (imageUrl) embed.image = { url: imageUrl };
  return embed;
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
