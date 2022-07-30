const fonts = {
    Roboto: {
        normal: 'public/fonts/roboto/Roboto-Regular.ttf',
        bold: 'public/fonts/roboto/Roboto-Bold.ttf',
        italics: 'public/fonts/roboto/Roboto-Italic.ttf',
        bolditalics: 'public/fonts/roboto/Roboto-BoldItalic.ttf',
    },
};

const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(fonts);
const fs = require('fs-extra');

const marinerInfoDefinition = {
    content: ['Mariner Information'],
};

function createMarinerPdf(marinerInfoDefinition) {
    const pdfDoc = printer.createPdfKitDocument(marinerInfoDefinition);
    pdfDoc.pipe(fs.createWriteStream('mariner.pdf'));
    pdfDoc.end();
}

exports.marinerInfoDefinition = marinerInfoDefinition;
exports.createMarinerPdf = createMarinerPdf;
