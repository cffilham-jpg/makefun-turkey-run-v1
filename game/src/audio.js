export class FarmSynth {
  constructor() { this.context = null; this.enabled = true; this.beat = 0; this.clock = 0; }
  unlock() {
    if (!this.context) this.context = new (window.AudioContext || window.webkitAudioContext)();
    if (this.context.state === 'suspended') this.context.resume();
  }
  tone(frequency, length = .12, type = 'triangle', volume = .05, delay = 0, slide = 1) {
    if (!this.context || !this.enabled) return;
    const t = this.context.currentTime + delay;
    const osc = this.context.createOscillator();
    const amp = this.context.createGain();
    osc.type = type; osc.frequency.setValueAtTime(frequency, t); osc.frequency.exponentialRampToValueAtTime(frequency * slide, t + length);
    amp.gain.setValueAtTime(.001, t); amp.gain.exponentialRampToValueAtTime(volume, t + .008); amp.gain.exponentialRampToValueAtTime(.001, t + length);
    osc.connect(amp); amp.connect(this.context.destination); osc.start(t); osc.stop(t + length + .02);
  }
  play(event) {
    if (event === 'jump') { this.tone(250,.17,'sine',.08,0,2); this.tone(180,.08,'triangle',.04,.1,1.8); }
    if (event === 'corn') { this.tone(660,.12,'triangle',.08); this.tone(990,.2,'sine',.06,.08); }
    if (event === 'hit') { this.tone(100,.3,'sawtooth',.09,0,.25); this.tone(65,.2,'triangle',.12); }
    if (event === 'gobble') for(let i=0;i<4;i++) this.tone(230+i%2*80,.09,'triangle',.07,i*.085,.6);
    if (event === 'shout') { this.tone(130,.22,'sawtooth',.025,0,1.25); this.tone(170,.16,'triangle',.04,.18,.8); }
    if (event === 'win') [330,440,550,660,880].forEach((f,i)=>this.tone(f,.35,'triangle',.08,i*.12));
    if (event === 'lose') [330,280,220,110].forEach((f,i)=>this.tone(f,.3,'triangle',.08,i*.16));
  }
  update(dt, playing) {
    if (!playing || !this.context) return;
    this.clock -= dt;
    if (this.clock > 0) return;
    this.clock += .22;
    const notes = [196,294,392,294,247,330,440,330,220,330,440,330,196,294,370,294];
    this.tone(notes[this.beat % notes.length],.16,'triangle',.024);
    if (this.beat % 4 === 0) this.tone(notes[this.beat % notes.length]/2,.2,'sine',.04);
    this.beat++;
  }
}
