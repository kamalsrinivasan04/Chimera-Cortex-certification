import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import Report from '../models/Report.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const emblemPath = path.join(__dirname, '../assets/emblem.png');

/**
 * Generates a high-quality certificate PDF combined with the detailed report.
 * @param {Object} certificate - Certificate database object.
 * @param {stream.Writable} writeStream - Writable stream to pipe the PDF content to (e.g. res).
 */
export const generateCertificatePDF = async (certificate, writeStream) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a landscape A4 document (for the Certificate page) with bufferPages enabled
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        bufferPages: true,
        margins: { top: 40, bottom: 40, left: 40, right: 40 },
      });

      doc.pipe(writeStream);

      const width = doc.page.width; // 842
      const height = doc.page.height; // 595

      // ==========================================
      // CORNER RIBBON DECORATIONS (Template Match)
      // ==========================================
      // Top-Left red/orange ribbons
      doc.polygon([0, 0], [160, 0], [0, 160]).fill('#ff4a03');
      doc.polygon([0, 0], [120, 0], [0, 120]).fill('#ff6a1f');

      // Bottom-Right red/orange ribbons
      doc.polygon([width, height], [width - 160, height], [width, height - 160]).fill('#ff4a03');
      doc.polygon([width, height], [width - 120, height], [width, height - 120]).fill('#ff6a1f');

      // Gold Seal Rosette decoration in top-left
      doc.save();
      doc.translate(85, 85);
      doc.polygon([-10, 20], [0, 45], [10, 20]).fill('#d97706');
      doc.polygon([-20, 15], [-12, 40], [-4, 18]).fill('#d97706');
      doc.polygon([4, 18], [12, 40], [20, 15]).fill('#d97706');
      doc.circle(0, 0, 30).fill('#fbbf24'); // gold circle
      doc.circle(0, 0, 26).fill('#d97706'); // dark gold border
      doc.circle(0, 0, 24).fill('#fbbf24'); // gold center
      doc.restore();

      // ==========================================
      // CHIMERA LOGO / EMBLEM GROUP (Top Center)
      // ==========================================
      const centerX = width / 2;
      
      // Load emblem image
      try {
        doc.image(emblemPath, centerX - 110, 42, { width: 45, height: 45 });
      } catch (err) {
        console.error('Failed to load emblem image in PDF:', err);
      }

      // Draw CHIMERA brand title & subtitle
      doc.fillColor('#1e293b')
         .font('Helvetica-Bold')
         .fontSize(18)
         .text('CHIMERA', centerX - 55, 48, { align: 'left' });
         
      doc.fillColor('#475569')
         .font('Helvetica')
         .fontSize(8)
         .text('Built on Trust, Building Tech', centerX - 55, 68, { align: 'left' });

      // ==========================================
      // CERTIFICATE TYPOGRAPHY
      // ==========================================
      
      // Certificate Title
      doc.fillColor('#334155')
         .font('Helvetica-Bold')
         .fontSize(28)
         .text('C E R T I F I C A T E', 40, 125, { align: 'center', width: width - 80, characterSpacing: 4 });

      doc.fillColor('#475569')
         .font('Times-Italic')
         .fontSize(18)
         .text('of Completion', 40, 155, { align: 'center', width: width - 80 });

      doc.fillColor('#64748b')
         .font('Helvetica-Bold')
         .fontSize(9)
         .text('THIS CERTIFICATE IS PRESENTED TO', 40, 195, { align: 'center', width: width - 80, characterSpacing: 1 });

      // Name
      doc.fillColor('#1e293b')
         .font('Times-Roman')
         .fontSize(32)
         .text(certificate.name, 40, 220, { align: 'center', width: width - 80 });

      // Description
      doc.fillColor('#475569')
         .font('Helvetica')
         .fontSize(11)
         .text('for successfully completing the adaptive assessment and demonstrating excellence in', 40, 270, { align: 'center', width: width - 80 });

      doc.fillColor('#0f172a')
         .font('Helvetica-Bold')
         .fontSize(16)
         .text(`"Cortex Training: ${certificate.level}"`, 40, 290, { align: 'center', width: width - 80 });

      doc.fillColor('#475569')
         .font('Helvetica')
         .fontSize(11)
         .text(`as a certified ${certificate.certificationName}.`, 40, 310, { align: 'center', width: width - 80 });

      // ==========================================
      // FOOTER SECTION: SIGNATURE, QR CODE, DETAILS
      // ==========================================
      const dateString = new Date(certificate.issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const expiryDate = new Date(certificate.issueDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      const expiryString = expiryDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Left signature
      doc.moveTo(150, 385)
         .lineTo(330, 385)
         .lineWidth(0.75)
         .stroke('#94a3b8');
      doc.fillColor('#1e293b')
         .font('Helvetica')
         .fontSize(10)
         .text('Karthick Purushothaman', 150, 393, { align: 'center', width: 180 });
      doc.fillColor('#64748b')
         .font('Helvetica-Bold')
         .fontSize(8)
         .text('CTO - Founder', 150, 407, { align: 'center', width: 180 });

      // Right signature
      doc.moveTo(width - 330, 385)
         .lineTo(width - 150, 385)
         .lineWidth(0.75)
         .stroke('#94a3b8');
      doc.fillColor('#1e293b')
         .font('Helvetica')
         .fontSize(10)
         .text(dateString, width - 330, 393, { align: 'center', width: 180 });
      doc.fillColor('#64748b')
         .font('Helvetica-Bold')
         .fontSize(8)
         .text('Date', width - 330, 407, { align: 'center', width: 180 });

      // QR Code
      try {
        const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${certificate.verificationHash}`;
        const qrBuffer = await QRCode.toBuffer(verifyUrl, {
          width: 70,
          margin: 1,
          color: {
            dark: '#1e293b',
            light: '#ffffff'
          }
        });
        doc.image(qrBuffer, centerX - 35, 430);
        
        doc.fillColor('#64748b')
           .font('Helvetica-Bold')
           .fontSize(8)
           .text('CERTIFICATE ID:', 60, 430)
           .font('Helvetica')
           .text(certificate.certificateId, 60, 442)
           .font('Helvetica-Bold')
           .text('DATE OF ISSUANCE:', 60, 465)
           .font('Helvetica')
           .text(dateString, 60, 477)
           .font('Helvetica-Bold')
           .text('VALIDITY PERIOD:', 60, 500)
           .font('Helvetica')
           .text(`1 Year (Expires ${expiryString})`, 60, 512);
      } catch (qrErr) {
        console.error('Failed to embed QR Code in Certificate PDF:', qrErr);
      }

      // ==========================================
      // APPEND DETAILED REPORT (Page 2+)
      // ==========================================
      let report = null;
      try {
        report = await Report.findOne({ assessmentId: certificate.assessmentId });
      } catch (dbErr) {
        console.error('Failed to query report for combined PDF:', dbErr);
      }

      if (report) {
        // Set document default options for report pages so auto-breaks inherit A4 Portrait
        doc.options.layout = 'portrait';
        doc.options.margins = { top: 50, bottom: 50, left: 50, right: 50 };

        // Add A4 Portrait Page for Report
        doc.addPage({
          size: 'A4',
          layout: 'portrait',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const pWidth = doc.page.width; // 595
        const pHeight = doc.page.height; // 842

        // Header Banner with dark background
        doc.rect(50, 40, pWidth - 100, 40).fill('#1e3a8a');
        doc.fillColor('#ffffff')
           .font('Helvetica-Bold')
           .fontSize(12)
           .text('C³AB CERTIFY — ASSESSMENT REPORT', 65, 54, { characterSpacing: 1 });

        // Candidate Profile Table Mockup
        doc.y = 100;
        doc.fillColor('#334155')
           .font('Helvetica-Bold')
           .fontSize(10)
           .text('I. CANDIDATE PROFILE INFO', 50, 100);

        // Draw profile box grid
        doc.rect(50, 115, pWidth - 100, 60).fill('#f8fafc');
        doc.rect(50, 115, pWidth - 100, 60).lineWidth(1).stroke('#e2e8f0');

        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(8.5);
        doc.text('Name:', 65, 125).font('Helvetica').text(certificate.name, 130, 125);
        doc.font('Helvetica-Bold').text('Job Role:', 65, 142).font('Helvetica').text(report.jobRole || 'N/A', 130, 142);
        doc.font('Helvetica-Bold').text('Department:', 65, 159).font('Helvetica').text(report.department || 'N/A', 130, 159);

        doc.font('Helvetica-Bold').text('Experience:', pWidth / 2 + 10, 125).font('Helvetica').text(`${report.experience || 0} Years`, pWidth / 2 + 90, 125);
        doc.font('Helvetica-Bold').text('Target Level:', pWidth / 2 + 10, 142).font('Helvetica').text(certificate.level, pWidth / 2 + 90, 142);
        doc.font('Helvetica-Bold').text('Status:', pWidth / 2 + 10, 159).font('Helvetica-Bold').fillColor(report.passFail === 'Pass' ? '#16a34a' : '#dc2626').text(report.passFail === 'Pass' ? 'CERTIFIED (PASS)' : 'REMEDIATION (FAIL)', pWidth / 2 + 90, 159);

        // Overall Score Highlight
        const scoreBoxY = 190;
        doc.rect(50, scoreBoxY, pWidth - 100, 55).fill('#eff6ff');
        doc.rect(50, scoreBoxY, pWidth - 100, 55).lineWidth(1.5).stroke('#bfdbfe');

        doc.fillColor('#1e3a8a')
           .font('Helvetica-Bold')
           .fontSize(11)
           .text('Overall Assessment Score:', 70, scoreBoxY + 22);

        doc.fillColor(report.passFail === 'Pass' ? '#16a34a' : '#dc2626')
           .font('Helvetica-Bold')
           .fontSize(22)
           .text(`${report.overallScore}%`, pWidth - 160, scoreBoxY + 16, { align: 'right', width: 90 });

        doc.fillColor('#475569')
           .font('Helvetica-Oblique')
           .fontSize(8.5)
           .text(`Passing Criteria: 70%  |  Validity period: 1 Year (Expires ${expiryString})`, 70, scoreBoxY + 38);

        // Topic Wise Competency Details with Progress Bars
        doc.y = 265;
        doc.fillColor('#334155')
           .font('Helvetica-Bold')
           .fontSize(10)
           .text('II. TOPIC COMPETENCY DETAILS & SCORES', 50, doc.y);

        doc.y += 15;
        if (report.topicWiseScore && report.topicWiseScore.length > 0) {
          report.topicWiseScore.forEach((item) => {
            if (doc.y > pHeight - 80) {
              doc.addPage({ size: 'A4', layout: 'portrait', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
              doc.y = 50;
            }
            const currentY = doc.y;
            // Draw topic name
            doc.fillColor('#0f172a')
               .font('Helvetica-Bold')
               .fontSize(8.5)
               .text(item.topic, 50, currentY, { width: 140, ellipsis: true });

            // Draw progress bar track
            const barX = 200;
            const barW = pWidth - 300; // ~245
            doc.rect(barX, currentY + 1, barW, 8).fill('#f1f5f9');
            
            // Draw progress bar value filled
            const fillW = Math.max(0, Math.min(barW, barW * (item.score / 100)));
            const fillCol = item.score >= 70 ? '#10b981' : (item.score >= 40 ? '#f59e0b' : '#ef4444');
            doc.rect(barX, currentY + 1, fillW, 8).fill(fillCol);

            // Draw score percentage text
            doc.fillColor('#475569')
               .font('Helvetica-Bold')
               .fontSize(8.5)
               .text(`${item.score}%`, pWidth - 90, currentY, { align: 'right', width: 40 });

            doc.y += 18;
          });
        }

        // AI Feedback Summary (In a premium left-border card)
        doc.y += 10;
        if (doc.y > pHeight - 120) {
          doc.addPage({ size: 'A4', layout: 'portrait', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
          doc.y = 50;
        }

        doc.fillColor('#334155')
           .font('Helvetica-Bold')
           .fontSize(10)
           .text('III. EVALUATOR AI COMPREHENSIVE FEEDBACK', 50, doc.y);

        doc.y += 12;
        const feedbackY = doc.y;
        const feedbackText = report.performanceSummary || '';
        const textH = doc.heightOfString(feedbackText, { width: pWidth - 130, lineGap: 3 });

        if (feedbackY + textH + 20 > pHeight - 60) {
          doc.addPage({ size: 'A4', layout: 'portrait', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
          doc.y = 50;
          const fY = doc.y;
          doc.rect(50, fY, pWidth - 100, textH + 16).fill('#f8fafc');
          doc.rect(50, fY, 4, textH + 16).fill('#ff6a1f');
          doc.fillColor('#334155')
             .font('Helvetica')
             .fontSize(8.5)
             .text(feedbackText, 65, fY + 8, { align: 'justify', width: pWidth - 130, lineGap: 3 });
          doc.y = fY + textH + 30;
        } else {
          doc.rect(50, feedbackY, pWidth - 100, textH + 16).fill('#f8fafc');
          doc.rect(50, feedbackY, 4, textH + 16).fill('#ff6a1f');
          doc.fillColor('#334155')
             .font('Helvetica')
             .fontSize(8.5)
             .text(feedbackText, 65, feedbackY + 8, { align: 'justify', width: pWidth - 130, lineGap: 3 });
          doc.y = feedbackY + textH + 30;
        }

        // Strengths & Weaknesses
        const cardW = (pWidth - 120) / 2; // ~217
        let strH = 25;
        if (report.strengths && report.strengths.length > 0) {
          report.strengths.forEach((str) => {
            strH += doc.heightOfString(`• ${str}`, { width: cardW - 24 }) + 4;
          });
        }
        let weakH = 25;
        if (report.weaknesses && report.weaknesses.length > 0) {
          report.weaknesses.forEach((weak) => {
            weakH += doc.heightOfString(`• ${weak}`, { width: cardW - 24 }) + 4;
          });
        }
        const calculatedBoxH = Math.max(120, Math.max(strH, weakH) + 15);

        if (doc.y + calculatedBoxH + 35 > pHeight - 50) {
          doc.addPage({ size: 'A4', layout: 'portrait', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
          doc.y = 50;
        }

        const strengthsY = doc.y;
        doc.fillColor('#334155')
           .font('Helvetica-Bold')
           .fontSize(10)
           .text('IV. DETAILED CAPABILITY METRICS', 50, strengthsY);

        doc.y += 15;
        const cardY = doc.y;

        // Draw backgrounds
        doc.rect(50, cardY, cardW, calculatedBoxH).fill('#f0fdf4');
        doc.rect(50, cardY, cardW, calculatedBoxH).lineWidth(1).stroke('#bbf7d0');

        doc.rect(pWidth / 2 + 10, cardY, cardW, calculatedBoxH).fill('#fef2f2');
        doc.rect(pWidth / 2 + 10, cardY, cardW, calculatedBoxH).lineWidth(1).stroke('#fecaca');

        // Draw texts
        let strContentY = cardY + 10;
        doc.fillColor('#15803d').font('Helvetica-Bold').fontSize(8.5).text('CORE STRENGTHS', 62, strContentY);
        strContentY += 14;
        doc.fillColor('#1e293b').font('Helvetica').fontSize(8);
        if (report.strengths && report.strengths.length > 0) {
          report.strengths.forEach((str) => {
            doc.text(`• ${str}`, 62, strContentY, { width: cardW - 24 });
            strContentY += doc.heightOfString(`• ${str}`, { width: cardW - 24 }) + 4;
          });
        }

        let weakContentY = cardY + 10;
        doc.fillColor('#b91c1c').font('Helvetica-Bold').fontSize(8.5).text('AREAS FOR IMPROVEMENT', pWidth / 2 + 22, weakContentY);
        weakContentY += 14;
        doc.fillColor('#1e293b').font('Helvetica').fontSize(8);
        if (report.weaknesses && report.weaknesses.length > 0) {
          report.weaknesses.forEach((weak) => {
            doc.text(`• ${weak}`, pWidth / 2 + 22, weakContentY, { width: cardW - 24 });
            weakContentY += doc.heightOfString(`• ${weak}`, { width: cardW - 24 }) + 4;
          });
        }

        doc.y = cardY + calculatedBoxH + 25;

        // Recommendations
        let recTotalH = 30;
        if (report.recommendations && report.recommendations.length > 0) {
          report.recommendations.forEach((rec) => {
            recTotalH += doc.heightOfString(`• ${rec}`, { width: pWidth - 100 }) + 5;
          });
        }

        if (doc.y + recTotalH > pHeight - 50) {
          doc.addPage({ size: 'A4', layout: 'portrait', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
          doc.y = 50;
        }

        doc.fillColor('#334155')
           .font('Helvetica-Bold')
           .fontSize(10)
           .text('V. RECOMMENDED REMEDIATION ACTIONS', 50, doc.y);

        doc.y += 15;
        doc.fillColor('#1e293b').font('Helvetica').fontSize(8.5);
        if (report.recommendations && report.recommendations.length > 0) {
          report.recommendations.forEach((rec) => {
            if (doc.y > pHeight - 60) {
              doc.addPage({ size: 'A4', layout: 'portrait', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
              doc.y = 50;
            }
            doc.text(`• ${rec}`, 50, doc.y, { width: pWidth - 100 });
            doc.y += doc.heightOfString(`• ${rec}`, { width: pWidth - 100 }) + 5;
          });
        }

        // Add running headers & page footers to all report pages (Pages 2+)
        const range = doc.bufferedPageRange();
        for (let i = 1; i < range.count; i++) {
          doc.switchToPage(i);

          const oldMargin = doc.page.margins.bottom;
          doc.page.margins.bottom = 0;

          // Footer divider line
          doc.moveTo(50, doc.page.height - 40)
             .lineTo(doc.page.width - 50, doc.page.height - 40)
             .lineWidth(0.5)
             .stroke('#cbd5e1');

          // Left footer
          doc.fillColor('#64748b')
             .font('Helvetica')
             .fontSize(8)
             .text(
               `C³AB CERTIFY — Official Report  |  Certificate ID: ${certificate.certificateId}`,
               50,
               doc.page.height - 30,
               { lineBreak: false }
             );

          // Right footer (Page X of Y)
          doc.fillColor('#64748b')
             .font('Helvetica-Bold')
             .fontSize(8)
             .text(
               `Page ${i} of ${range.count - 1}`,
               doc.page.width - 150,
               doc.page.height - 30,
               { align: 'right', width: 100, lineBreak: false }
             );

          doc.page.margins.bottom = oldMargin;
        }
      }

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
