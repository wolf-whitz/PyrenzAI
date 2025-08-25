self.onmessage = async function (e) {
  const { challenge, difficulty, maxAttempts } = e.data;

  async function sha256(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    return Array.from(hashArray)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  let nonce = 0;
  while (nonce < maxAttempts) {
    const hashHex = await sha256(`${challenge}:${nonce}`);
    if (hashHex.startsWith('0'.repeat(difficulty))) {
      self.postMessage({ nonce, success: true });
      return;
    }
    nonce++;
    if (nonce % 1000 === 0) {
      self.postMessage({ nonce, progress: true });
    }
  }

  self.postMessage({ success: false });
};
