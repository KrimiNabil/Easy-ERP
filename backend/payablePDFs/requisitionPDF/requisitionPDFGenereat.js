const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs = require('fs-extra');
const path = require('path');

const compile = async function (fileName, data) {
    try {
        const filePath = path.join(process.cwd(), 'backend/payablePDFs/requisitionPDF', `${fileName}.hbs`);
        const html = await fs.readFile(filePath, 'utf8');
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
        console.log("Data passed to template:", plainDoc);

        const content = await compile("index", plainDoc);
            // console.log("Rendered HTML Content:", content);

        await page.setContent(content);

        const pdfDirectory = '../requisitionPDF/PDFs';
        const pdfPath = path.join(__dirname, pdfDirectory, `${plainDoc.requisitionID}.pdf`);

        console.log(`Saving PDF to: ${pdfPath}`);

        // await fs.ensureDir(path.dirname(pdfPath));
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true
        });

        // const dirPath = path.join(__dirname, '../uploads/pdfs');
        // const fileName = `Notice-${data.NoticeId}.pdf`;
        // const filePath = path.join(dirPath, fileName);

        await browser.close();
        console.log(`PDF generated successfully: ${plainDoc.requisitionID}.pdf`);

        const relativePath = path.join(__dirname,pdfDirectory, `${plainDoc.requisitionID}.pdf`);
        return relativePath.replace(/\\/g, '/');
    } catch (error) {
        console.error(`Error generating PDF: ${error.message}`);
        throw new Error('PDF generation failed.');
    }
}

module.exports = generatePDF;
