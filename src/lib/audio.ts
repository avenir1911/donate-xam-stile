// Web Audio API Synthesizer - Giả lập âm thanh Gõ Mõ và Chuông Khấn Tâm Linh
class SpiritualAudio {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Tiếng gõ mõ mộc (Mokugyo - Cốc!)
  playWoodenFish() {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Bộ lọc mô phỏng khoang gỗ rỗng
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.Q.setValueAtTime(5, this.ctx.currentTime);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      console.warn('Audio not allowed yet:', e);
    }
  }

  // Tiếng chuông đồng ngân vang (Singing Bowl / Chime)
  playBell() {
    try {
      this.init();
      if (!this.ctx) return;

      const frequencies = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6 hòa âm thanh tịnh
      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const initialVol = 0.3 / (idx + 1);
        gain.gain.setValueAtTime(initialVol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 2.5);
      });
    } catch (e) {
      console.warn('Audio not allowed yet:', e);
    }
  }
}

export const spiritualAudio = new SpiritualAudio();
