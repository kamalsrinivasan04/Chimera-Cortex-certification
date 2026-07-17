import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

/**
 * Generates a high-quality certificate PDF.
 * @param {Object} certificate - Certificate database object.
 * @param {stream.Writable} writeStream - Writable stream to pipe the PDF content to (e.g. res).
 */
export const generateCertificatePDF = async (certificate, writeStream) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a landscape A4 document
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 40, bottom: 40, left: 40, right: 40 },
      });

      doc.pipe(writeStream);

      const width = doc.page.width; // 842
      const height = doc.page.height; // 595

      // ==========================================
      // BACKGROUND & BORDERS
      // ==========================================
      
      // Draw Navy Blue Background Frame
      doc.rect(20, 20, width - 40, height - 40)
         .lineWidth(5)
         .stroke('#1e3a8a'); // deep navy

      // Draw Inner Gold Border Frame
      doc.rect(28, 28, width - 56, height - 56)
         .lineWidth(1.5)
         .stroke('#d97706'); // amber/gold

      // Draw subtle corner decorations
      const corners = [
        { x: 32, y: 32 },
        { x: width - 32, y: 32 },
        { x: width - 32, y: height - 32 },
        { x: 32, y: height - 32 },
      ];
      
      // Top left corner decoration
      doc.moveTo(30, 50).lineTo(30, 30).lineTo(50, 30).lineWidth(3).stroke('#d97706');
      // Top right
      doc.moveTo(width - 30, 50).lineTo(width - 30, 30).lineTo(width - 50, 30).lineWidth(3).stroke('#d97706');
      // Bottom left
      doc.moveTo(30, height - 50).lineTo(30, height - 30).lineTo(50, height - 30).lineWidth(3).stroke('#d97706');
      // Bottom right
      doc.moveTo(width - 30, height - 50).lineTo(width - 30, height - 30).lineTo(width - 50, height - 30).lineWidth(3).stroke('#d97706');

      // ==========================================
      // VECTOR EMBLEM / LOGO PLACEHOLDER
      // ==========================================
      const centerX = width / 2;
      
      // Draw a gold seal emblem at the top center
      doc.save();
      doc.translate(centerX, 90);
      
      // Star points or outer spikes
      doc.circle(0, 0, 35).fill('#d97706');
      doc.circle(0, 0, 31).fill('#1e3a8a');
      doc.circle(0, 0, 28).fill('#eff6ff'); // soft blue/white interior
      
      // Draw dynamic inner star
      doc.moveTo(0, -18)
         .lineTo(5, -5)
         .lineTo(18, -3)
         .lineTo(8, 6)
         .lineTo(11, 18)
         .lineTo(0, 11)
         .lineTo(-11, 18)
         .lineTo(-8, 6)
         .lineTo(-18, -3)
         .lineTo(-5, -5)
         .closePath()
         .fill('#d97706');
         
      doc.restore();

      // ==========================================
      // CERTIFICATE TYPOGRAPHY
      // ==========================================
      
      // Platform Title
      doc.fillColor('#1e293b') // slate-800
         .font('Helvetica-Bold')
         .fontSize(14)
         .text('AI ADAPTIVE CERTIFICATION PLATFORM', 40, 150, { align: 'center', width: width - 80 });

      // Certificate of Achievement header
      doc.fillColor('#d97706') // gold
         .font('Helvetica-Bold')
         .fontSize(28)
         .text('CERTIFICATE OF EXCELLENCE', 40, 175, { align: 'center', width: width - 80 });

      doc.fillColor('#64748b') // slate-500
         .font('Helvetica-Oblique')
         .fontSize(12)
         .text('This is proudly presented to', 40, 215, { align: 'center', width: width - 80 });

      // Recipient Name
      doc.fillColor('#0f172a') // slate-900
         .font('Helvetica-Bold')
         .fontSize(32)
         .text(certificate.name, 40, 240, { align: 'center', width: width - 80 });

      // Divider line
      doc.moveTo(centerX - 120, 285)
         .lineTo(centerX + 120, 285)
         .lineWidth(1)
         .stroke('#cbd5e1');

      // Certification metadata
      doc.fillColor('#475569') // slate-600
         .font('Helvetica')
         .fontSize(13)
         .text('for successfully demonstrating proficiency and achieving the requirements of', 40, 295, { align: 'center', width: width - 80 });

      // Certification Name & Level
      doc.fillColor('#1e3a8a') // deep navy
         .font('Helvetica-Bold')
         .fontSize(22)
         .text(`${certificate.certificationName} — ${certificate.level} Level`, 40, 320, { align: 'center', width: width - 80 });

      // Score info
      doc.fillColor('#475569')
         .font('Helvetica')
         .fontSize(12)
         .text(`With an overall evaluated assessment score of `, 40, 360, { align: 'center', width: width - 80, continued: true })
         .font('Helvetica-Bold')
         .fillColor('#15803d') // green
         .text(`${certificate.score}%`);

      // ==========================================
      // FOOTER SECTION: SIGNATURE, QR CODE, DETAILS
      // ==========================================
      
      // Bottom left: Certificate Details
      const dateString = new Date(certificate.issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      doc.fillColor('#64748b')
         .font('Helvetica-Bold')
         .fontSize(9)
         .text('CERTIFICATE ID:', 60, 430)
         .font('Helvetica')
         .text(certificate.certificateId, 60, 442)
         .font('Helvetica-Bold')
         .text('DATE OF ISSUANCE:', 60, 465)
         .font('Helvetica')
         .text(dateString, 60, 477);

      // Bottom center: Generate and embed verification QR Code
      try {
        const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${certificate.verificationHash}`;
        const qrBuffer = await QRCode.toBuffer(verifyUrl, {
          width: 80,
          margin: 1,
          color: {
            dark: '#1e3a8a',
            light: '#ffffff'
          }
        });
        
        doc.image(qrBuffer, centerX - 40, 420);
        doc.fillColor('#64748b')
           .font('Helvetica')
           .fontSize(7)
           .text('Scan to Verify Authenticity', centerX - 60, 505, { align: 'center', width: 120 });
      } catch (qrErr) {
        console.error('Failed to embed QR Code in Certificate PDF:', qrErr);
        // Draw placeholder text box if QR code fails
        doc.rect(centerX - 40, 420, 80, 80).stroke('#cbd5e1');
        doc.fillColor('#94a3b8').fontSize(8).text('[QR Verification]', centerX - 40, 455, { align: 'center', width: 80 });
      }

      // Bottom right: Signature
      doc.moveTo(width - 240, 470)
         .lineTo(width - 60, 470)
         .lineWidth(0.75)
         .stroke('#94a3b8');
         
      // Beautiful italic digital signature text
      doc.fillColor('#0f172a')
         .font('Helvetica-Oblique')
         .fontSize(14)
         .text('AI Assessor Agent v1.0', width - 240, 450, { align: 'center', width: 180 });
         
      doc.fillColor('#64748b')
         .font('Helvetica-Bold')
         .fontSize(9)
         .text('AUTHORIZED SIGNATURE', width - 240, 478, { align: 'center', width: 180 });
         
      doc.font('Helvetica')
         .fontSize(7)
         .text('AI Certification Verification Board', width - 240, 490, { align: 'center', width: 180 });

      // End document
      doc.end();
      
      writeStream.on('finish', () => {
        resolve();
      });
      
      writeStream.on('error', (err) => {
        reject(err);
      });
      
    } catch (error) {
      reject(error);
    }
  });
};
