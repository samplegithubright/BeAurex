import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { 
  Smartphone, 
  Gift
} from 'lucide-react';

export default function StandeePage() {
  const { slug } = useParams();
  const [storeData, setStoreData] = useState({
    name: 'Kafeen Cafe',
    slug: slug || 'kafeen-cafe'
  });
  const [storeLogo, setStoreLogo] = useState(() => {
    try {
      return localStorage.getItem('beaurex_store_logo') || '/beaurex-icon.jpg';
    } catch (_) {
      return '/beaurex-icon.jpg';
    }
  });
  const [qrDataUrl, setQrDataUrl] = useState('');
  const standeeRef = useRef(null);

  const cleanSlug = String(slug || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const scanUrl = `${window.location.origin}/scan/${cleanSlug}`;

  // Fetch store details and logo
  useEffect(() => {
    try {
      const savedLogo = localStorage.getItem('beaurex_store_logo');
      if (savedLogo) setStoreLogo(savedLogo);

      const savedMerchant = localStorage.getItem('loyalqr_merchant') || sessionStorage.getItem('loyalqr_merchant');
      if (savedMerchant) {
        const m = JSON.parse(savedMerchant);
        if (m && (m.qrSlug === cleanSlug || !slug)) {
          setStoreData({
            name: m.businessName || m.name || 'Kafeen Cafe',
            slug: m.qrSlug || cleanSlug
          });
          if (m.storeLogo || m.logoUrl) {
            setStoreLogo(m.storeLogo || m.logoUrl);
          }
        }
      }
    } catch (_) {}

    fetch(`/api/merchant/home?slug=${cleanSlug}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.merchant) {
          setStoreData({
            name: data.merchant.businessName || 'Kafeen Cafe',
            slug: data.merchant.qrSlug || cleanSlug
          });
          if (data.merchant.storeLogo || data.merchant.logoUrl) {
            setStoreLogo(data.merchant.storeLogo || data.merchant.logoUrl);
          }
        }
      })
      .catch(() => {});
  }, [cleanSlug, slug]);

  // Generate QR Code data URL with high resolution
  useEffect(() => {
    QRCode.toDataURL(scanUrl, {
      width: 900,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR:', err));
  }, [scanUrl]);

  // Download high-resolution standee template image matching Image 3 Theme (#8B0000)
  const handleDownloadTemplate = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Canvas helper: robust image preloader
      const loadCanvasImage = (src) => new Promise((resolve) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => {
          const fallback = new Image();
          fallback.onload = () => resolve(fallback);
          fallback.onerror = () => resolve(null);
          fallback.src = src;
        };
        img.src = src;
      });

      // Load all required images concurrently
      const [qrImg, storeLogoImg, beaurexLogoImg] = await Promise.all([
        loadCanvasImage(qrDataUrl),
        loadCanvasImage(storeLogo || '/beaurex-icon.jpg'),
        loadCanvasImage('/beaurex-icon.jpg')
      ]);

      // Rounded rect helper function
      const drawRoundRect = (x, y, w, h, r) => {
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, r);
        } else {
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          ctx.lineTo(x + r, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
        }
      };

      // Vector Icon Drawers - Enlarged, crisp & bold (No emojis)
      const drawPhoneIcon = (cx, cy) => {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const pw = 36;
        const ph = 58;
        drawRoundRect(cx - pw / 2, cy - ph / 2, pw, ph, 7);
        ctx.stroke();

        // Speaker notch line
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy - ph / 2 + 9);
        ctx.lineTo(cx + 6, cy - ph / 2 + 9);
        ctx.stroke();

        // Home button dot
        ctx.beginPath();
        ctx.arc(cx, cy + ph / 2 - 9, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      const drawCoinIcon = (cx, cy, radius, img) => {
        if (img) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, cx - radius, cy - radius, radius * 2, radius * 2);
          ctx.restore();
        } else {
          ctx.save();
          ctx.strokeStyle = '#ffffff';
          ctx.fillStyle = '#ffffff';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(cx, cy, 32, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx, cy, 24, 0, Math.PI * 2);
          ctx.stroke();
          ctx.font = 'bold 30px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('B', cx, cy + 1);
          ctx.restore();
        }
      };

      const drawGiftIcon = (cx, cy) => {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const bw = 54;
        const bh = 34;
        const by = cy - 4;
        drawRoundRect(cx - bw / 2, by, bw, bh, 4);
        ctx.stroke();

        const lw = 62;
        const lh = 10;
        const ly = by - lh;
        drawRoundRect(cx - lw / 2, ly, lw, lh, 3);
        ctx.stroke();

        // Center vertical ribbon
        ctx.beginPath();
        ctx.moveTo(cx, ly);
        ctx.lineTo(cx, by + bh);
        ctx.stroke();

        // Ribbon bow loops
        ctx.beginPath();
        ctx.moveTo(cx, ly);
        ctx.bezierCurveTo(cx - 16, ly - 16, cx - 16, ly - 2, cx, ly);
        ctx.moveTo(cx, ly);
        ctx.bezierCurveTo(cx + 16, ly - 16, cx + 16, ly - 2, cx, ly);
        ctx.stroke();
        ctx.restore();
      };

      // 1. BASE FULL-BLEED ACRYLIC SURFACE (Zero outer white border)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1200, 1800);

      const primaryRed = '#8B0000';
      const darkRed = '#720000';

      // 2. TOP CRIMSON CURVED HEADER (Edge-to-edge, starts at (0,0) - No top white border)
      const headerGradient = ctx.createLinearGradient(0, 0, 0, 300);
      headerGradient.addColorStop(0, primaryRed);
      headerGradient.addColorStop(1, darkRed);
      ctx.fillStyle = headerGradient;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(1200, 0);
      ctx.lineTo(1200, 260);
      ctx.bezierCurveTo(800, 305, 400, 305, 0, 260);
      ctx.closePath();
      ctx.fill();

      // Top Header: Centered [Enlarged Logo Badge] + [Enlarged Store Name]
      const displayName = (storeData.name || 'Adobe').trim();
      const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

      ctx.font = 'bold 76px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const textMetrics = ctx.measureText(formattedName);
      const logoBadgeSize = 110;
      const badgeGap = 28;
      const totalHeaderWidth = logoBadgeSize + badgeGap + textMetrics.width;
      const headerStartX = Math.max(50, 600 - totalHeaderWidth / 2);
      const headerCenterY = 140;
      const badgeY = headerCenterY - logoBadgeSize / 2;

      // Squircle White Badge for Store Logo
      ctx.fillStyle = '#ffffff';
      drawRoundRect(headerStartX, badgeY, logoBadgeSize, logoBadgeSize, 26);
      ctx.fill();

      // Logo inside Badge
      const badgePad = 10;
      const logoForHeader = storeLogoImg || beaurexLogoImg;
      if (logoForHeader) {
        ctx.save();
        drawRoundRect(headerStartX + badgePad, badgeY + badgePad, logoBadgeSize - badgePad * 2, logoBadgeSize - badgePad * 2, 20);
        ctx.clip();
        ctx.drawImage(logoForHeader, headerStartX + badgePad, badgeY + badgePad, logoBadgeSize - badgePad * 2, logoBadgeSize - badgePad * 2);
        ctx.restore();
      } else {
        ctx.fillStyle = primaryRed;
        ctx.font = 'bold 64px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('B', headerStartX + logoBadgeSize / 2, headerCenterY + 2);
      }

      // Store Name Text in Header (Enlarged)
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 76px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(formattedName, headerStartX + logoBadgeSize + badgeGap, headerCenterY);

      // 3. PILL BADGE: SCAN • EARN • REDEEM (Enlarged & Crisp)
      ctx.strokeStyle = primaryRed;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(120, 375);
      ctx.lineTo(270, 375);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(930, 375);
      ctx.lineTo(1080, 375);
      ctx.stroke();

      ctx.fillStyle = primaryRed;
      drawRoundRect(290, 338, 620, 74, 37);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('SCAN  •  EARN  •  REDEEM', 600, 375);

      // 4. CENTRAL QR CODE FRAME (Enlarged QR, optimal margins)
      const qrBoxX = 220;
      const qrBoxY = 460;
      const qrBoxSize = 760;

      ctx.strokeStyle = primaryRed;
      ctx.lineWidth = 6;
      ctx.fillStyle = '#ffffff';
      drawRoundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 46);
      ctx.fill();
      ctx.stroke();

      if (qrImg) {
        const qrPad = 38;
        ctx.drawImage(qrImg, qrBoxX + qrPad, qrBoxY + qrPad, qrBoxSize - qrPad * 2, qrBoxSize - qrPad * 2);
      }

      // Center Squircle Badge on QR Code
      const centerBadgeSize = 160;
      const centerBadgeX = 600 - centerBadgeSize / 2;
      const centerBadgeY = (qrBoxY + qrBoxSize / 2) - centerBadgeSize / 2;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = primaryRed;
      ctx.lineWidth = 5;
      drawRoundRect(centerBadgeX, centerBadgeY, centerBadgeSize, centerBadgeSize, 30);
      ctx.fill();
      ctx.stroke();

      const centerPad = 14;
      const centerInnerSize = centerBadgeSize - centerPad * 2;
      const centerLogoImg = beaurexLogoImg || storeLogoImg;
      if (centerLogoImg) {
        ctx.save();
        drawRoundRect(centerBadgeX + centerPad, centerBadgeY + centerPad, centerInnerSize, centerInnerSize, 20);
        ctx.clip();
        ctx.drawImage(centerLogoImg, centerBadgeX + centerPad, centerBadgeY + centerPad, centerInnerSize, centerInnerSize);
        ctx.restore();
      } else {
        ctx.fillStyle = primaryRed;
        ctx.font = 'bold 74px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('B', 600, centerBadgeY + centerBadgeSize / 2 + 2);
      }

      // 5. 3-STEP INSTRUCTION BOX (Enlarged Icons & Enlarged Crisp Typography)
      const boxX = 70;
      const boxY = 1270;
      const boxWidth = 1060;
      const boxHeight = 330;

      const boxGrad = ctx.createLinearGradient(0, boxY, 0, boxY + boxHeight);
      boxGrad.addColorStop(0, '#fff5f6');
      boxGrad.addColorStop(1, '#ffe4e8');
      ctx.fillStyle = boxGrad;
      drawRoundRect(boxX, boxY, boxWidth, boxHeight, 38);
      ctx.fill();

      ctx.strokeStyle = '#fecdd3';
      ctx.lineWidth = 2.5;
      drawRoundRect(boxX, boxY, boxWidth, boxHeight, 38);
      ctx.stroke();

      const colW = boxWidth / 3;
      ctx.strokeStyle = '#fecdd3';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(boxX + colW, boxY + 25);
      ctx.lineTo(boxX + colW, boxY + boxHeight - 25);
      ctx.moveTo(boxX + colW * 2, boxY + 25);
      ctx.lineTo(boxX + colW * 2, boxY + boxHeight - 25);
      ctx.stroke();

      const steps = [
        { num: '1. SCAN', line1: 'Scan this QR after', line2: 'your purchase' },
        { num: '2. EARN', line1: 'Earn Aurex coin for', line2: 'every visit' },
        { num: '3. REDEEM', line1: 'Redeem Aurex coin', line2: '& unlock rewards' }
      ];

      steps.forEach((st, idx) => {
        const colCenterX = boxX + colW * idx + colW / 2;
        const iconCenterY = boxY + 75;
        const iconRadius = 50; // Enlarged from 38 to 50

        // Crimson icon circular background
        ctx.fillStyle = primaryRed;
        ctx.beginPath();
        ctx.arc(colCenterX, iconCenterY, iconRadius, 0, Math.PI * 2);
        ctx.fill();

        // Enlarged Vector Icons
        if (idx === 0) {
          drawPhoneIcon(colCenterX, iconCenterY);
        } else if (idx === 1) {
          drawCoinIcon(colCenterX, iconCenterY, iconRadius, beaurexLogoImg);
        } else if (idx === 2) {
          drawGiftIcon(colCenterX, iconCenterY);
        }

        // Step Title - Increased to 38px Bold Crimson
        ctx.fillStyle = primaryRed;
        ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(st.num, colCenterX, iconCenterY + 98);

        // Step Descriptions - Increased to 26px Bold Slate
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(st.line1, colCenterX, iconCenterY + 140);
        ctx.fillText(st.line2, colCenterX, iconCenterY + 176);
      });

      // 6. BOTTOM CRIMSON WAVE BANNER (Edge-to-edge full bleed to y=1800 - No bottom white border)
      const bottomGradient = ctx.createLinearGradient(0, 1630, 0, 1800);
      bottomGradient.addColorStop(0, darkRed);
      bottomGradient.addColorStop(1, primaryRed);
      ctx.fillStyle = bottomGradient;

      ctx.beginPath();
      ctx.moveTo(0, 1800);
      ctx.lineTo(1200, 1800);
      ctx.lineTo(1200, 1660);
      ctx.bezierCurveTo(800, 1630, 400, 1630, 0, 1660);
      ctx.closePath();
      ctx.fill();

      // Serif Italic "Thank You!" - Increased to 64px
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.font = 'italic bold 64px Georgia, "Times New Roman", serif';
      ctx.fillText('\\   Thank You!   /', 600, 1718);

      // Uppercase "FOR CHOOSING US" - Increased to 26px
      ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillText('FOR CHOOSING US', 600, 1768);
      ctx.letterSpacing = '0px';

      // Save file (Clean full bleed without outer white border)
      const link = document.createElement('a');
      link.download = `${cleanSlug}-beaurex-standee.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download QR template error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white text-slate-900 font-sans">
      
      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .standee-outer {
            box-shadow: none !important;
            margin: 0 auto !important;
            max-width: 100% !important;
            width: 100% !important;
            page-break-inside: avoid;
          }
          .standee-base {
            display: none !important;
          }
        }
      `}</style>

      {/* 3D ACRYLIC TABLETOP STANDEE CONTAINER (Theme matching Landing Page #8B0000) */}
      <div className="standee-outer flex flex-col items-center w-full max-w-[340px] sm:max-w-[360px] drop-shadow-xl">
        
        {/* Main Upright Acrylic Plaque */}
        <div 
          ref={standeeRef}
          className="w-full bg-white rounded-[28px] sm:rounded-[32px] shadow-xl overflow-hidden relative flex flex-col justify-between border border-slate-100"
        >
          
          {/* 1. TOP CRIMSON CURVED HEADER */}
          <div className="relative bg-gradient-to-b from-[#8B0000] to-[#720000] text-white pt-4 pb-6 px-4 text-center overflow-hidden">
            {/* Smooth bottom curve mask */}
            <div className="absolute -bottom-5 left-0 right-0 h-8 bg-white rounded-t-[100%] pointer-events-none" />
            
            {/* Store Brand Logo & Name */}
            <div className="flex items-center justify-center space-x-2.5 mb-0.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-1 shadow-md flex items-center justify-center shrink-0 border border-white/80">
                <img 
                  src={storeLogo || '/beaurex-icon.jpg'} 
                  alt="Logo" 
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.parentNode) {
                      e.target.parentNode.innerHTML = '<span class="text-[#8B0000] font-black text-sm">B</span>';
                    }
                  }}
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white capitalize">
                {storeData.name || 'Adobe'}
              </h1>
            </div>
          </div>

          {/* 2. PILL BADGE: SCAN • EARN • REDEEM */}
          <div className="px-4 pt-2 pb-1 flex items-center justify-center">
            <div className="flex items-center w-full">
              <div className="flex-1 h-[1.5px] bg-[#8B0000]" />
              <div className="bg-[#8B0000] text-white font-black text-[10px] sm:text-xs px-4 py-1 rounded-full uppercase tracking-wider mx-2 shadow-2xs whitespace-nowrap">
                SCAN • EARN • REDEEM
              </div>
              <div className="flex-1 h-[1.5px] bg-[#8B0000]" />
            </div>
          </div>

          {/* 3. CENTRAL QR CODE SECTION */}
          <div className="px-5 py-1.5 flex justify-center">
            <div className="p-2.5 bg-white rounded-2xl border-2 border-[#8B0000] shadow-2xs relative">
              {qrDataUrl ? (
                <div className="relative">
                  <img 
                    src={qrDataUrl} 
                    alt="BeAurex Standee QR Code" 
                    className="w-40 h-40 sm:w-44 sm:h-44 object-contain block rounded-xl"
                  />
                  {/* Center Small Logo Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white flex items-center justify-center shadow-md border-2 border-[#8B0000] p-1 overflow-hidden">
                      <img 
                        src={'/beaurex-icon.jpg'} 
                        alt="BeAurex Logo" 
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.parentNode) {
                            e.target.parentNode.innerHTML = '<span class="text-[#8B0000] font-black text-sm">B</span>';
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center text-slate-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>
          </div>

          {/* 4. 3-STEP INSTRUCTION BOX (Clean Glassmorphism & Vector Icons) */}
          <div className="px-3.5 py-1.5">
            <div className="bg-white/85 backdrop-blur-md border border-rose-200/80 shadow-md shadow-rose-950/5 rounded-2xl p-2.5 sm:p-3 grid grid-cols-3 gap-1 divide-x divide-rose-200/70 text-center">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center px-0.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#8B0000] text-white flex items-center justify-center shadow-xs mb-1 border border-rose-300/40">
                  <Smartphone className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white stroke-[2.2]" />
                </div>
                <span className="text-[11px] sm:text-xs font-black text-[#8B0000] uppercase tracking-wide">1. SCAN</span>
                <span className="text-[9px] sm:text-[10px] text-slate-700 font-bold leading-tight mt-0.5">
                  Scan this QR after purchase
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center px-0.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#8B0000] text-white flex items-center justify-center shadow-xs mb-1 overflow-hidden p-1 border border-rose-300/40">
                  <img 
                    src="/beaurex-icon.jpg" 
                    alt="Aurex Coin" 
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.parentNode) {
                        e.target.parentNode.innerHTML = '<span class="text-white font-black text-xs">B</span>';
                      }
                    }}
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-black text-[#8B0000] uppercase tracking-wide">2. EARN</span>
                <span className="text-[9px] sm:text-[10px] text-slate-700 font-bold leading-tight mt-0.5">
                  Earn Aurex coin every visit
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center px-0.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#8B0000] text-white flex items-center justify-center shadow-xs mb-1 border border-rose-300/40">
                  <Gift className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white stroke-[2.2]" />
                </div>
                <span className="text-[11px] sm:text-xs font-black text-[#8B0000] uppercase tracking-wide">3. REDEEM</span>
                <span className="text-[9px] sm:text-[10px] text-slate-700 font-bold leading-tight mt-0.5">
                  Redeem coin &amp; unlock rewards
                </span>
              </div>

            </div>
          </div>

          {/* 5. BOTTOM CRIMSON WAVE BANNER: Thank You! FOR CHOOSING US */}
          <div className="relative bg-gradient-to-b from-[#720000] to-[#8B0000] text-white pt-3.5 pb-3 px-4 text-center overflow-hidden mt-0.5">
            <div className="absolute -top-4 left-0 right-0 h-6 bg-white rounded-b-[100%] pointer-events-none" />
            
            <div className="text-white font-serif italic text-lg sm:text-xl font-bold tracking-wide">
              \ &nbsp; Thank You! &nbsp; /
            </div>
            <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-rose-100 mt-0.5">
              FOR CHOOSING US
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
