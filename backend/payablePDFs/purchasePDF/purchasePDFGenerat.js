const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs = require('fs-extra');
const path = require('path');

const compile = async function (fileName, data) {
    try {
        const filePath = path.join(process.cwd(), 'backend/payablePDFs/purchasePDF/', `${fileName}.hbs`);
        const html = await fs.readFile(filePath, 'utf8');
        // Compile template with data
        return hbs.compile(html)(data);
    } catch (error) {
        console.error(`Error compiling template: ${error.message}`);
        throw new Error(`Template file ${fileName}.hbs could not be found or read.`);
    }
};

async function generatePDF(doc) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const plainDoc = JSON.parse(doc);
        console.log("Data passed to template:", plainDoc); // Verify doc data here

        const content = await compile("index", plainDoc);
        console.log(plainDoc.purchaseOrder);

        await page.setContent(content);
        // Change the directory path here to save PDFs to the new location
        const pdfDirectory = '../purchasePDF/PDFs/';
        const pdfPath = path.join(__dirname, pdfDirectory, `${plainDoc.purchaseOrder}.pdf`);
        // Ensure that the directory exists
        console.log(pdfPath);

        await fs.ensureDir(path.dirname(pdfPath));
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true
        });

        await browser.close();
        console.log(`PDF generated successfully: ${plainDoc.purchaseOrder}.pdf`);
        
         // Return the relative URL for storage
         const relativePath = path.join(__dirname,pdfDirectory, `${plainDoc.purchaseOrder}.pdf`);
         return relativePath.replace(/\\/g, '/'); 
         // Ensure consistent forward slashes for URLs

    } catch (error) {
        console.error(`Error generating PDF: ${error.message}`);
        throw new Error('PDF generation failed.');

    }
}

module.exports = generatePDF;
