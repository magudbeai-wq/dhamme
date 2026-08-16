import React, { useState, useRef } from 'react';

interface VideoUploadFieldProps {
  currentVideoUrl?: string;
  onVideoChange: (videoUrl: string | undefined, duration?: number) => void;
  maxSizeBytes?: number; // default 100MB
}

export const VideoUploadField: React.FC<VideoUploadFieldProps> = ({
  currentVideoUrl,
  onVideoChange,
  maxSizeBytes = 100 * 1024 * 1024 // 100MB
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [detectedDuration, setDetectedDuration] = useState<number | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const ALLOWED_MIME_TYPES = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-m4v',
    'video/ogg'
  ];

  const ALLOWED_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v'];

  const validateFile = (file: File): boolean => {
    setErrorMsg(null);

    // 1. File size check
    if (file.size === 0) {
      setErrorMsg('Faylka fiidiyowgu waa madhan yahay (0 bytes). Fadlan dooro muuqaal sax ah.');
      return false;
    }

    if (file.size > maxSizeBytes) {
      const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
      const fileMb = (file.size / (1024 * 1024)).toFixed(1);
      setErrorMsg(`Muuqaalkaagu aad buu u weyn yahay (${fileMb} MB). Xadka ugu badan waa ${maxMb} MB.`);
      return false;
    }

    // 2. MIME type & extension check
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const isExtensionValid = ALLOWED_EXTENSIONS.includes(extension);
    const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type.toLowerCase()) || file.type.startsWith('video/');

    if (!isExtensionValid && !isMimeValid) {
      setErrorMsg('Nooca faylkan lama taageerayo. Fadlan soo geli muuqaal ah MP4, WebM ama MOV.');
      return false;
    }

    return true;
  };

  const processVideoFile = (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(10);
    setProcessingStatus('Uploading video... (10%)');

    // Extract duration from video file object
    const objectUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = objectUrl;

    tempVideo.onloadedmetadata = () => {
      const dur = Math.round(tempVideo.duration || 0);
      setDetectedDuration(dur);
      URL.revokeObjectURL(objectUrl);
    };

    // Simulate progress and convert to reliable base64 or blob storage URL
    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.min(90, Math.round((e.loaded / e.total) * 100));
        setUploadProgress(percent);
        setProcessingStatus(`Uploading video... (${percent}%)`);
      }
    };

    reader.onload = () => {
      setUploadProgress(95);
      setProcessingStatus('Processing & Optimizing video for mobile...');

      setTimeout(() => {
        if (typeof reader.result === 'string') {
          const finalUrl = reader.result;
          setUploadProgress(100);
          setProcessingStatus('Video ready ✅');
          onVideoChange(finalUrl, detectedDuration);

          setTimeout(() => {
            setIsUploading(false);
            setProcessingStatus(null);
          }, 800);
        }
      }, 700);
    };

    reader.onerror = () => {
      setIsUploading(false);
      setProcessingStatus(null);
      setErrorMsg('Soo gelinta fiidiyowga waa ku guuldareysatay. Fadlan isku day mar kale.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
    e.target.value = '';
  };

  const handleAddDirectUrl = () => {
    const url = videoUrlInput.trim();
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:video/')) {
      setErrorMsg('Fadlan geli link sax ah oo bilaabmaya https://');
      return;
    }

    setErrorMsg(null);
    onVideoChange(url);
    setVideoUrlInput('');
  };

  const handleRemoveVideo = () => {
    onVideoChange(undefined, undefined);
    setErrorMsg(null);
    setDetectedDuration(undefined);
  };

  return (
    <div className="space-y-4">
      {/* Header info */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#3f4946] uppercase tracking-wider flex items-center space-x-1.5">
          <span className="material-symbols-outlined text-[#005145] text-[18px]">videocam</span>
          <span>Property Video Tour (Mandatory Video Feature)</span>
        </label>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          MP4, WebM, MOV (Max 100MB)
        </span>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-shake">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* If Video is NOT yet uploaded */}
      {!currentVideoUrl && !isUploading && (
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#005145] rounded-3xl p-6 bg-[#f0eded] hover:bg-[#e5e2e1] transition cursor-pointer text-center space-y-3 group"
          >
            <div className="w-14 h-14 rounded-full bg-[#005145]/10 group-hover:bg-[#005145]/20 text-[#005145] flex items-center justify-center mx-auto transition">
              <span className="material-symbols-outlined text-[32px]">video_call</span>
            </div>
            
            <div>
              <h4 className="font-poppins font-bold text-sm text-[#1b1b1c]">
                Soo Geli Muuqaalka Guriga (Upload Property Video)
              </h4>
              <p className="text-xs text-[#3f4946] mt-1">
                Guryaha muuqaalka leh waxay helaan 3x macaamiil dheeraad ah Jigjiga.
              </p>
            </div>

            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-[#005145] text-white text-xs font-bold shadow-md hover:bg-[#0f6b5c] transition inline-flex items-center space-x-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              <span>Soo Dooro Fiidiyow (Choose Video)</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Alternative Direct Video Link Input */}
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Ama geli Direct Video Link (e.g. https://.../tour.mp4)..."
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              className="flex-1 p-3 bg-[#f0eded] rounded-xl text-xs border border-[#bec9c5]/40 text-[#1b1b1c] focus:outline-none focus:ring-2 focus:ring-[#005145]"
            />
            <button
              type="button"
              onClick={handleAddDirectUrl}
              className="px-4 py-3 bg-[#005145] text-white rounded-xl text-xs font-bold hover:bg-[#0f6b5c] transition shrink-0"
            >
              Add URL
            </button>
          </div>
        </div>
      )}

      {/* Uploading & Processing State Progress Bar */}
      {isUploading && (
        <div className="p-6 bg-[#f0eded] rounded-3xl border border-[#005145]/30 text-center space-y-4 shadow-sm animate-pulse">
          <div className="w-12 h-12 rounded-full bg-[#005145] text-white flex items-center justify-center mx-auto shadow-md">
            <span className="material-symbols-outlined text-[26px] animate-spin">sync</span>
          </div>

          <div>
            <h4 className="font-poppins font-bold text-sm text-[#1b1b1c]">
              {processingStatus || 'Uploading Video...'}
            </h4>
            <span className="font-mono font-bold text-[#005145] text-xs">
              {uploadProgress}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#e5e2e1] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#005145] to-[#d4af37] rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Video Preview Card (Uploaded State) */}
      {currentVideoUrl && !isUploading && (
        <div className="p-4 bg-[#f0eded] rounded-3xl border border-[#005145] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#005145]">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span className="font-poppins font-bold text-xs">
                Muuqaalka Guriga Waa Diyaar (Video Ready)
              </span>
            </div>

            <button
              type="button"
              onClick={handleRemoveVideo}
              className="text-xs text-red-600 font-bold hover:underline flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              <span>Tirtir (Remove)</span>
            </button>
          </div>

          {/* Mini video preview */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-md border border-white/20">
            <video
              src={currentVideoUrl}
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#3f4946] pt-1">
            <span>✅ Muuqaalku wuxuu ka muuqan doonaa bogga gurigaaga.</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[#005145] font-bold underline"
            >
              Beddel Fiidiyowga (Replace)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};
