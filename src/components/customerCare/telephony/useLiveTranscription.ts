import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '../../../hooks/useToast';
import type { TranscriptSegment } from '../../../types/customerCare';

export function useLiveTranscription() {
  const { showToast } = useToast();

  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  });

  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [isTranscriptionPaused, setIsTranscriptionPaused] = useState<boolean>(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'Agent' | 'Customer'>('Agent');
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [interimText, setInterimText] = useState<string>('');
  const [transcriptionSeconds, setTranscriptionSeconds] = useState<number>(0);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);

  type AnyRecognition = {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onstart: (() => void) | null;
    onresult: ((event: { resultIndex: number; results: { length: number; [i: number]: { isFinal: boolean; [j: number]: { transcript: string } } } }) => void) | null;
    onerror: ((event: { error: string }) => void) | null;
    onend: (() => void) | null;
  };

  const recognitionRef = useRef<AnyRecognition | null>(null);
  const transcriptTimerRef = useRef<number | null>(null);
  const isRecordingIntentRef = useRef<boolean>(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const activeSpeakerRef = useRef(activeSpeaker);

  useEffect(() => {
    activeSpeakerRef.current = activeSpeaker;
  }, [activeSpeaker]);

  // Live transcription timer
  useEffect(() => {
    if (isTranscribing && !isTranscriptionPaused) {
      transcriptTimerRef.current = window.setInterval(() => {
        setTranscriptionSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current);
    }
    return () => {
      if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current);
    };
  }, [isTranscribing, isTranscriptionPaused]);

  // Auto-scroll transcript feed
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptSegments, interimText]);

  const getFormattedTranscriptText = useCallback((): string => {
    return transcriptSegments
      .map((seg) => `[${seg.timestamp}] ${seg.speaker}: ${seg.text}`)
      .join('\n');
  }, [transcriptSegments]);

  const handleStartTranscription = useCallback(async () => {
    setMicPermissionError(null);
    const win = window as unknown as {
      SpeechRecognition?: new () => AnyRecognition;
      webkitSpeechRecognition?: new () => AnyRecognition;
    };
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicPermissionError(
        'Microphone access was denied or not found. Please ensure microphone permissions are granted in browser settings.'
      );
      showToast('Microphone access denied. Please grant permission in browser.', 'error');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsTranscribing(true);
        setIsTranscriptionPaused(false);
        isRecordingIntentRef.current = true;
        showToast('Voice transcription listening...', 'info');
      };

      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          if (result.isFinal) {
            const trimmed = transcript.trim();
            if (trimmed) {
              const newSegment: TranscriptSegment = {
                id: `seg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                speaker: activeSpeakerRef.current,
                text: trimmed,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              };
              setTranscriptSegments((prev) => [...prev, newSegment]);
            }
          } else {
            interim += transcript;
          }
        }
        setInterimText(interim);
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          setMicPermissionError('Microphone permission was blocked by the browser.');
        } else if (event.error !== 'no-speech') {
          console.warn('Speech recognition notice:', event.error);
        }
      };

      recognition.onend = () => {
        if (isRecordingIntentRef.current && !isTranscriptionPaused) {
          try {
            recognition.start();
          } catch {
            // Already restarted
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unable to start speech recognition';
      setMicPermissionError(errorMsg);
    }
  }, [isSpeechSupported, isTranscriptionPaused, showToast]);

  const handlePauseTranscription = useCallback(() => {
    setIsTranscriptionPaused(true);
    isRecordingIntentRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    showToast('Voice transcription paused', 'info');
  }, [showToast]);

  const handleResumeTranscription = useCallback(() => {
    setIsTranscriptionPaused(false);
    isRecordingIntentRef.current = true;
    handleStartTranscription();
  }, [handleStartTranscription]);

  const handleStopTranscription = useCallback(() => {
    isRecordingIntentRef.current = false;
    setIsTranscribing(false);
    setIsTranscriptionPaused(false);
    setInterimText('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    showToast('Voice transcription stopped', 'info');
  }, [showToast]);

  const handleClearTranscript = useCallback(() => {
    if (window.confirm('Clear all lines in the live transcription log?')) {
      setTranscriptSegments([]);
      setInterimText('');
      setTranscriptionSeconds(0);
      showToast('Transcript cleared', 'info');
    }
  }, [showToast]);

  const handleCopyTranscript = useCallback(() => {
    const formatted = getFormattedTranscriptText();
    if (!formatted.trim()) {
      showToast('Transcript is currently empty.', 'warning');
      return;
    }
    navigator.clipboard.writeText(formatted);
    showToast('Full call transcript copied to clipboard!', 'success');
  }, [getFormattedTranscriptText, showToast]);

  const handleDownloadTranscript = useCallback((customerName = 'Customer') => {
    const formatted = getFormattedTranscriptText();
    if (!formatted.trim()) {
      showToast('Transcript is currently empty.', 'warning');
      return;
    }
    const safeCustomer = customerName.replace(/\s+/g, '_');
    const blob = new Blob([formatted], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Call_Transcript_${safeCustomer}_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Transcript download started', 'success');
  }, [getFormattedTranscriptText, showToast]);

  return {
    isSpeechSupported,
    isTranscribing,
    isTranscriptionPaused,
    activeSpeaker,
    setActiveSpeaker,
    transcriptSegments,
    setTranscriptSegments,
    interimText,
    transcriptionSeconds,
    micPermissionError,
    transcriptEndRef,
    handleStartTranscription,
    handlePauseTranscription,
    handleResumeTranscription,
    handleStopTranscription,
    handleClearTranscript,
    handleCopyTranscript,
    handleDownloadTranscript,
    getFormattedTranscriptText,
  };
}
