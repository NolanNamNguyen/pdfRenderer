const express = require('express');
const fs = require('fs');
const puppeteer = require('puppeteer');
const ejs = require('ejs');


const app = express();
const port = 3000;

// Serve a simple homepage
app.get('/', (req, res) => {
    res.send('Hello World! Visit /generate-pdf to create a PDF');
});

// Endpoint to generate PDF
app.get('/generate-pdf', async (req, res) => {
    const parties = [
        { role: 'BOOKING REQUESTER', companyName: 'RAMSES LOGISTICS CO., LTD.', address: 'ROOM 505, 5TH FL., A-DONG, GANGSEO HANGANG XI TOWER, 401, YANGCHEON-RO, GANGSEO-GU, SEOUL, KOREA' },
        { role: 'SHIPPER', companyName: 'RAMSES LOGISTICS CO., LTD.', address: 'ROOM 505, 5TH FL., A-DONG, GANGSEO HANGANG XI TOWER, 401, YANGCHEON-RO, GANGSEO-GU, SEOUL, KOREA' },
        { role: 'FREIGHT FORWARDER', companyName: 'RAMSES LOGISTICS CO., LTD.', address: 'ROOM 505, 5TH FL., A-DONG, GANGSEO HANGANG XI TOWER, 401, YANGCHEON-RO, GANGSEO-GU, SEOUL, KOREA' },
        { role: 'CONSIGNEE', companyName: 'C.H. ROBINSON EUROPE B.V.', address: 'Waalhaven Z.z. 19, 3089 JH Rotterdam, The Netherlands' }
    ];

    const reefers = [
        {
            containerType: "REEFER 20FT x 1",
            degree: "20 °C",
            humidity: "5%",
            drain: "N/A",
            sensitiveCargoType: "N/A",
            specialAtmosphere: "N/A",
            ventilation: "20% Open",
            genset: "Yes",
            nature: "Fresh",
            sensitiveCargoGrossWeight: "No Information",
            controlledAtmosphere: "No Information"
        },
        {
            containerType: "REEFER 20FT x 1",
            degree: "30 °C",
            humidity: "5%",
            drain: "N/A",
            sensitiveCargoType: "N/A",
            specialAtmosphere: "N/A",
            ventilation: "20% Open",
            genset: "Yes",
            nature: "Fresh",
            sensitiveCargoGrossWeight: "No Information",
            controlledAtmosphere: "No Information"
        }
    ];

    const templatePath = join(
        __dirname,
        '..',
        'templates/booking-acknowledgement.ejs',
    );

    const template = fs.readFileSync('template.ejs', 'utf8');
    const htmlContent = ejs.renderFile(template, { bookingParties: parties, reefers });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    res.contentType('application/pdf');
    res.send(pdf);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});