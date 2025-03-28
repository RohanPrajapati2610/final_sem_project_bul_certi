const mongoose = require('mongoose')
const certificate = require('../models/certificateModles')
const nodemailer = require('nodemailer');
const xlsx = require('xlsx');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Template = require('../models/templateModel');
const Event = require('../models/eventModel');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
            file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files are allowed!'), false);
        }
    }
}).single('file');

const createCertificate = (req, res) => {
    const certificate1 = new certificate({
        eventId:req.body.eventId,
        candidateName: req.body.candidateName,
        description: req.body.description,
        email: req.body.email,
        isDeleted:req.body.isDeleted
    })
    console.log('certificate', certificate1)
    certificate1.save()
        .then(() => {
            (
                res.send({
                    msg: "certificate added successfully",
                    issucess: true
                })
            )
        }
        )
        .catch((error) => {
            console.log(error)
            res.send({
                msg: "error",
                issucess: false
            })
        })

}

// Function to generate bulk certificates from Excel
const generateBulkCertificates = async (req, res) => {
    try {
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync('uploads/')) {
            fs.mkdirSync('uploads/');
        }

        upload(req, res, async function (err) {
            if (err) {
                return res.send({
                    msg: err.message,
                    issucess: false
                });
            }

            if (!req.file) {
                return res.send({
                    msg: "Please upload an Excel file",
                    issucess: false
                });
            }

            const eventId = req.body.eventId;
            if (!eventId) {
                return res.send({
                    msg: "Event ID is required",
                    issucess: false
                });
            }

            const workbook = xlsx.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

            if (data.length === 0) {
                return res.send({
                    msg: "Excel file is empty",
                    issucess: false
                });
            }

            // Validate required fields in Excel
            for (let i = 0; i < data.length; i++) {
                if (!data[i].name || !data[i].email) {
                    return res.send({
                        msg: `Row ${i + 1} is missing required fields (name or email)`,
                        issucess: false
                    });
                }
            }

            // Create certificates for each entry
            const certificates = [];
            for (const row of data) {
                const newCertificate = new certificate({
                    eventId: eventId,
                    candidateName: row.name,
                    email: row.email,
                    description: row.description || ''
                });
                await newCertificate.save();
                certificates.push(newCertificate);
            }

            // Delete the uploaded file
            fs.unlinkSync(req.file.path);

            res.send({
                msg: `Successfully generated ${certificates.length} certificates`,
                issucess: true,
                data: certificates
            });
        });
    } catch (error) {
        console.log("Error:", error);
        res.send({
            msg: "Error generating certificates",
            issucess: false,
            error: error.message
        });
    }
};

// Function to send certificates in bulk
const sendBulkCertificates = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const certificates = await certificate.find({ eventId: eventId, isDeleted: false })
            .populate('eventId', 'eventName certificateType');
        
        if (certificates.length === 0) {
            return res.send({ 
                msg: "No certificates found for this event",
                issucess: false
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rikutank44@gmail.com',
                pass: 'gidq hkqi jkdm vblm'
            }
        });

        let successCount = 0;
        let errorCount = 0;

        for (const cert of certificates) {
            const mailOptions = {
                from: 'rikutank44@gmail.com',
                to: cert.email,
                subject: `Your ${cert.eventId.certificateType} Certificate`,
                text: `Dear ${cert.candidateName},\n\nPlease find your certificate attached.\n\nVerification Link: http://localhost:7000/certificate/verify/${cert._id}\n\nThank you!`,
                html: `<h2>Dear ${cert.candidateName},</h2>
                       <p>Please find your certificate attached.</p>
                       <p>You can verify your certificate using <a href="http://localhost:7000/certificate/verify/${cert._id}">this link</a>.</p>
                       <p>Thank you!</p>`
            };

            try {
                await new Promise((resolve, reject) => {
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(info);
                        }
                    });
                });
                successCount++;
            } catch (error) {
                console.log(`Error sending email to ${cert.email}:`, error);
                errorCount++;
            }
        }

        res.send({
            msg: `Email sending completed. ${successCount} emails sent successfully, ${errorCount} failed.`,
            issucess: true,
            totalSent: successCount,
            totalFailed: errorCount
        });
    } catch (error) {
        console.log("Error:", error);
        res.send({
            msg: "Error sending certificates",
            issucess: false,
            error: error.message
        });
    }
};

const sendCertificate = async (req, res) => {
    try {
        const cert = await certificate.findOne({ email: req.body.email });
        
        if (!cert) {
            return res.send({
                msg: "certificate not found",
                issucess: false
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rikutank44@gmail.com',
                pass: 'gidq hkqi jkdm vblm'
            }
        });

        const mailOptions = {
            from: 'rikutank44@gmail.com',
            to: cert.email,
            subject: 'Your Certificate',
            text: `Dear ${cert.candidateName},\n\nPlease find your certificate attached.\n\nVerification Link: http://localhost:7000/certificate/verify/${cert._id}\n\nThank you!`,
            html: `<h2>Dear ${cert.candidateName},</h2>
                  <p>Please find your certificate attached.</p>
                  <p>You can verify your certificate using <a href="http://localhost:7000/certificate/verify/${cert._id}">this link</a>.</p>
                  <p>Thank you!</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.send({
                    msg: "Error sending email",
                    issucess: false,
                    error: error.message
                });
            }
            
            console.log('Email sent: ' + info.response);
            res.send({
                msg: "Certificate sent successfully",
                issucess: true
            });
        });
    } catch (error) {
        console.log(error);
        res.send({
            msg: "Error processing request",
            issucess: false,
            error: error.message
        });
    }
};

// Function to get all certificates
const getCertificates = async (req, res) => {
    try {
        const certificates = await certificate.find({ isDeleted: false })
            .populate('eventId', 'eventName certificateType');
        
        if (certificates.length === 0) {
            return res.send({ msg: "No certificates found" });
        }

        res.send({
            msg: "Certificates fetched successfully",
            data: certificates
        });
    } catch (error) {
        console.log("Error:", error);
        res.send({
            msg: "Error fetching certificates",
            error: error.message
        });
    }
};

// Function to get certificates by event
const getCertificatesByEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const certificates = await certificate.find({ eventId: eventId, isDeleted: false })
            .populate('eventId', 'eventName certificateType');
        
        if (certificates.length === 0) {
            return res.send({ msg: "No certificates found for this event" });
        }

        res.send({
            msg: "Certificates fetched successfully",
            data: certificates
        });
    } catch (error) {
        console.log("Error:", error);
        res.send({
            msg: "Error fetching certificates",
            error: error.message
        });
    }
};

// Function to verify a certificate
const verifyCertificate = async (req, res) => {
    try {
        const certificateId = req.params.id;
        const cert = await certificate.findById(certificateId)
            .populate('eventId', 'eventName eventDate signatoryName signatoryDesignation certificateType');
        
        if (!cert) {
            return res.send({ 
                msg: "Certificate not found or is invalid",
                isValid: false
            });
        }

        res.send({
            msg: "Certificate verified successfully",
            isValid: true,
            data: {
                candidateName: cert.candidateName,
                eventName: cert.eventId.eventName,
                eventDate: cert.eventId.eventDate,
                certificateType: cert.eventId.certificateType,
                signatoryName: cert.eventId.signatoryName,
                signatoryDesignation: cert.eventId.signatoryDesignation,
                issueDate: cert.createdAt
            }
        });
    } catch (error) {
        console.log("Error:", error);
        res.send({
            msg: "Error verifying certificate",
            isValid: false,
            error: error.message
        });
    }
};

// Function to generate a unique certificate ID
const generateUniqueCertificateId = () => {
    return crypto.randomBytes(8).toString('hex').toUpperCase();
};

// Function to generate QR code
const generateQRCode = async (certificateId, verificationUrl) => {
    return await QRCode.toDataURL(verificationUrl);
};

// Function to generate certificate PDF
const generateCertificatePdf = async (req, res) => {
    try {
        const { eventId, recipientName, recipientEmail, templateId } = req.body;

        // Get event details
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send({
                msg: "Event not found",
                isSuccess: false
            });
        }

        // Get template details
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send({
                msg: "Template not found",
                isSuccess: false
            });
        }

        // Generate unique certificate ID
        const certificateId = generateUniqueCertificateId();

        // Create verification URL
        const verificationUrl = `http://localhost:7000/certificate/verify/${certificateId}`;

        // Generate QR code
        const qrCodeDataUrl = await generateQRCode(certificateId, verificationUrl);

        // Create a new PDF document
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4'
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificateId}.pdf`);

        // Pipe the PDF to the response
        doc.pipe(res);

        // Add background image if exists
        if (template.backgroundImage) {
            doc.image(template.backgroundImage, 0, 0, {
                width: doc.page.width,
                height: doc.page.height
            });
        }

        // Add certificate content
        doc.font('Helvetica-Bold')
           .fontSize(30)
           .text('CERTIFICATE', { align: 'center' })
           .moveDown();

        doc.fontSize(20)
           .text(`This is to certify that`, { align: 'center' })
           .moveDown();

        doc.fontSize(25)
           .text(recipientName, { align: 'center' })
           .moveDown();

        doc.fontSize(20)
           .text(`has successfully participated in`, { align: 'center' })
           .moveDown();

        doc.fontSize(25)
           .text(event.eventName, { align: 'center' })
           .moveDown();

        doc.fontSize(15)
           .text(`Date: ${new Date(event.eventDate).toLocaleDateString()}`, { align: 'center' })
           .moveDown();

        // Add QR code
        const qrCodeImage = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
        doc.image(qrCodeImage, doc.page.width - 150, doc.page.height - 150, {
            width: 100
        });

        // Add certificate ID
        doc.fontSize(12)
           .text(`Certificate ID: ${certificateId}`, doc.page.width - 200, doc.page.height - 40);

        // Save certificate in database
        const newCertificate = new certificate({
            certificateId: certificateId,
            eventId: eventId,
            candidateName: recipientName,
            email: recipientEmail,
            templateId: templateId,
            description: `Certificate for ${event.eventName}`
        });
        await newCertificate.save();

        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send({
            msg: "Error generating certificate PDF",
            isSuccess: false,
            error: error.message
        });
    }
};

module.exports = {
    createCertificate,
    sendCertificate,
    getCertificates,
    getCertificatesByEvent,
    verifyCertificate,
    generateBulkCertificates,
    sendBulkCertificates,
    generateCertificatePdf
}