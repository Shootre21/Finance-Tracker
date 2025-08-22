import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Category, ParsedReceipt } from '../types';
import UploadIcon from './icons/UploadIcon';
import CameraIcon from './icons/CameraIcon';
import XIcon from './icons/XIcon';

interface ReceiptScannerModalProps {
  onClose: () => void;
  onParse: (data: ParsedReceipt) => void;
}

const toBase64 = (file: File): Promise<{ base64: string; mimeType: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve({ base64: result.split(',')[1], mimeType: result.split(';')[0].split(':')[1] });
    };
    reader.onerror = (error) => reject(error);
  });

const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({ onClose, onParse }) => {
  const [image, setImage] = useState<{ src: string; base64: string; mimeType: string } | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      const { base64, mimeType } = await toBase64(file);
      setImage({ src: URL.createObjectURL(file), base64, mimeType });
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("Camera access was denied. Please enable it in your browser settings.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };
  
  useEffect(() => {
    return () => stopCamera(); // Cleanup on unmount
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        setImage({ src: dataUrl, base64, mimeType: 'image/jpeg' });
        stopCamera();
      }
    }
  };
  
  const clearImage = () => {
    setImage(null);
    setError(null);
  };

  const parseReceipt = async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const allCategories = Object.values(Category);
      
      const prompt = `Analyze this receipt. Extract the merchant name for the description, the final total amount, and the transaction date (in YYYY-MM-DD format). Classify it into one of the following categories: ${allCategories.join(', ')}. If a suitable category isn't found, use 'Other'. Return a single JSON object.`;
      
      const responseSchema = {
          type: Type.OBJECT,
          properties: {
              description: { type: Type.STRING, description: 'The name of the merchant or store.' },
              amount: { type: Type.NUMBER, description: 'The final total amount of the transaction.' },
              date: { type: Type.STRING, description: 'The date in YYYY-MM-DD format. Optional.' },
              category: { type: Type.STRING, description: 'One of the provided categories.', enum: allCategories },
          },
          required: ['description', 'amount', 'category'],
      };

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ inlineData: { data: image.base64, mimeType: image.mimeType } }, { text: prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema,
        },
      });
      
      const resultText = response.text.trim();
      const parsedData: ParsedReceipt = JSON.parse(resultText);

      if (parsedData && typeof parsedData.description === 'string' && typeof parsedData.amount === 'number' && typeof parsedData.category === 'string') {
        onParse(parsedData);
        onClose();
      } else {
        throw new Error('Received invalid data structure from AI.');
      }

    } catch (e) {
      console.error("Error parsing receipt:", e);
      setError("Sorry, we couldn't read that receipt. Please try a clearer image.");
    } finally {
      setIsLoading(false);
    }
  };

   const handleEsc = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [handleEsc]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md m-4 p-6 relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800" aria-label="Close">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Scan Receipt</h2>
        
        <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 overflow-hidden">
          {!image && !isCameraOn && (
            <div className="text-center space-y-4">
              <p className="text-subtle">Upload or take a photo of your receipt.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  <UploadIcon className="w-5 h-5 mr-2"/> Upload Image
                </button>
                <button onClick={startCamera} className="flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  <CameraIcon className="w-5 h-5 mr-2"/> Use Camera
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          )}
          
          {isCameraOn && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-auto max-h-[50vh] rounded-md bg-gray-900"></video>
              <canvas ref={canvasRef} className="hidden"></canvas>
              <button onClick={capturePhoto} className="mt-4 px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700">Take Photo</button>
            </div>
          )}

          {image && (
             <div className="w-full h-full flex flex-col items-center justify-center relative">
              {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center rounded-md z-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      <p className="mt-4 text-primary font-medium">Scanning receipt...</p>
                  </div>
              )}
              <img src={image.src} alt="Receipt preview" className="max-w-full max-h-[50vh] object-contain rounded-md" />
              <div className="flex gap-4 mt-4">
                <button onClick={clearImage} disabled={isLoading} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Choose Different</button>
                <button onClick={parseReceipt} disabled={isLoading} className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-secondary hover:bg-green-700 disabled:opacity-50">Parse Receipt</button>
              </div>
            </div>
          )}
        </div>
        {error && <p className="text-danger text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default ReceiptScannerModal;