export class SpeechService {
  static COUNT = 0;

  static speak(text: string) {
    return;

    const voices = speechSynthesis
      .getVoices()
      .filter((v) => v.lang === "en-US");

    console.log(voices);

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.voice = voices[SpeechService.COUNT++];

    speechSynthesis.speak(utterance);
  }

  static stop() {
    return;

    speechSynthesis.cancel();
  }
}
