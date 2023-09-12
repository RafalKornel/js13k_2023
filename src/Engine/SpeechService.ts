const synth = window.speechSynthesis;

const MASTER_VOLUME = 0.7;

type Voice = { i: number; rate?: number; volume?: number; pitch?: number };

const VOICES = {
  player: { i: 0, rate: 0.9 },
  doctor: { i: 43, rate: 0.85, volume: 0.8, pitch: 1.2 },
  womanSick: { i: 42, rate: 0.9, volume: 0.2, pitch: 0.7 },
  usFemale: { i: 41, rate: 0.9, pitch: 0.9 },
  witch: { i: 41, rate: 0.9, pitch: 0.7 },
  maleDeep: { i: 26, rate: 0.9, pitch: 1.1 },
  narrator: { i: 43, pitch: 0.8 },
  ukMale: { i: 43 },
};

export type VoiceKey = keyof typeof VOICES;

export const startSpeach = (text: string, voiceKey: VoiceKey) => {
  const utterance = new SpeechSynthesisUtterance(
    text.replace("<", "").replace(">", "")
  );

  const synthVoices = synth
    .getVoices()
    .filter(({ lang }) => lang.startsWith("en"));

  console.log(synthVoices);

  const voice: Voice = VOICES[voiceKey];

  console.log(utterance);

  utterance.volume = MASTER_VOLUME * (voice.volume || 1);
  utterance.rate = voice.rate || 1;
  utterance.pitch = voice.pitch || 1;

  utterance.voice = synthVoices[voice.i];

  synth.speak(utterance);
};

export const speakWithNarrator = (text: string, npcVoice?: VoiceKey) => {
  const chunks = text.split(/<|>/);

  for (const chunk of chunks) {
    const chunkIndex = text.indexOf(chunk);

    if (text[chunkIndex - 1] === "<") {
      startSpeach(chunk, "narrator");
    } else {
      startSpeach(chunk, npcVoice || "player");
    }
  }
};

export const stopSpeach = () => {
  synth.cancel();
};
