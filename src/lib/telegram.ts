/**
 * Telegram Notification Helper
 * Sends real-time notifications to the MelCraft admin team via Telegram Bot API.
 * Configured via TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.
 */

export async function sendTelegramNotification(message: string): Promise<{ success: boolean; skipped?: boolean }> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  // If credentials are not configured yet, log placeholder cleanly without failing
  if (!token || !chatId) {
    console.log('[Telegram Notification Placeholder]');
    console.log('To enable live Telegram alerts, set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env');
    console.log('Notification Content:\n', message.replace(/<[^>]+>/g, ''));
    return { success: true, skipped: true };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Telegram API error response:', errBody);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return { success: false };
  }
}
