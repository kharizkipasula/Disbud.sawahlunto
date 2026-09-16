import React, { useState } from 'react';
import { X, MessageCircle, ExternalLink } from 'lucide-react';

const HalloSawahlunto: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // WhatsApp Config
  const phoneNumber = '62811694200';
  const waUrl = `https://wa.me/${phoneNumber}?text=Halo%20Sawahlunto,%20saya%20ingin%20menyampaikan%20laporan.`;
  
  // Note: In a real scenario, place the image file in your public folder (e.g., /public/images/hallo-sawahlunto.jpg)
  // For this demo, I will use the placeholder or a direct base64 if provided, but here I'll use a placeholder structure
  // that implies the image provided in the prompt.
  const imageUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_sQ2zQhF-JzXQ2zQhF-JzXQ2zQhF-JzXQ2zQhF-JzXQ2zQhF-JzX/s16000/hallo-sawahlunto.jpg"; // Using a generic placeholder logic, replace src with local file path

  // Custom WhatsApp Icon SVG for authenticity
  const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="w-6 h-6">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );

  // Since we cannot upload the actual image file to the environment in this turn,
  // I will render the specific visual content using HTML/CSS to match the provided image description
  // IF the image fails to load (fallback), but primary is the image tag.
  // Ideally, replace the `src` below with your local path: "/assets/hallo-sawahlunto.jpg"
  
  return (
    <>
      {/* Floating Button - WhatsApp Hotline */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all transform hover:scale-110 flex items-center gap-2 group ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Layanan Pengaduan Halo Sawahlunto"
      >
        <WhatsAppIcon />
        <span className="font-bold hidden md:inline pr-2 text-sm whitespace-nowrap">Halo Sawahlunto</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl relative animate-scale-in max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-heritage-dark text-white p-4 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-2">
                  <WhatsAppIcon />
                  <h3 className="font-bold font-sans">Layanan Pengaduan</h3>
               </div>
               <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-4 bg-gray-100 flex flex-col items-center">
               {/* Image Display */}
               <div className="bg-white p-2 rounded-lg shadow-sm w-full mb-4">
                  {/* NOTE TO USER: Replace the src below with the path to the image you provided (e.g., /hallo-sawahlunto.png) */}
                  <img 
                    src="/hallo-sawahlunto.jpg" 
                    alt="Layanan Pengaduan Masyarakat Halo Sawahlunto" 
                    className="w-full h-auto rounded object-contain"
                    onError={(e) => {
                        // Fallback UI if image is missing
                        e.currentTarget.style.display = 'none';
                        const fallback = document.getElementById('fallback-ui');
                        if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  
                  {/* Fallback UI (displayed if image isn't found) replicating the flyer info */}
                  <div id="fallback-ui" className="hidden p-6 text-center border-2 border-dashed border-gray-300 rounded">
                      <h2 className="text-2xl font-bold text-heritage-dark uppercase mb-2">Halo Sawahlunto</h2>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Layanan Pengaduan Masyarakat</p>
                      
                      <div className="bg-red-600 text-white py-4 px-6 rounded-xl mb-6 shadow-lg transform -rotate-1">
                          <p className="text-sm uppercase font-bold mb-1">Melalui No WA:</p>
                          <p className="text-3xl font-black tracking-wider">0811 694 200</p>
                      </div>
                      
                      <div className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                          Dalam rangka meningkatkan pelayanan informasi publik serta memperkuat komunikasi antara Pemerintah Kota Sawahlunto dan Masyarakat.
                      </div>
                  </div>
               </div>

               {/* Action Button */}
               <a 
                 href={waUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl hover:bg-[#128C7E] transition-all shadow-lg flex items-center justify-center gap-2 group"
               >
                 <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
                 <span>Chat via WhatsApp Sekarang</span>
                 <ExternalLink className="w-4 h-4 opacity-70" />
               </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HalloSawahlunto;
