import {
  ExtractElementType,
  ExtractPDFJob,
  ExtractPDFParams,
  ExtractPDFResult,
  MimeType,
  PDFServices,
  SDKError,
  ServiceApiError,
  ServicePrincipalCredentials,
  ServiceUsageError,
  ExtractRenditionsElementType,
  TableStructureType,
} from '@adobe/pdfservices-node-sdk';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const uploadFiles = formData.get('file') as File;
  if (!uploadFiles) return NextResponse.json({}, { status: 400, statusText: 'INVALID FILE' });

  const { PDF_SERVICES_CLIENT_ID, PDF_SERVICES_CLIENT_SECRET } = process.env;
  if (!PDF_SERVICES_CLIENT_ID || !PDF_SERVICES_CLIENT_SECRET) {
    return NextResponse.json({}, { status: 400, statusText: 'PDF_SERVICE INVALID' });
  }

  let readStream;
  const buff = Buffer.from(await uploadFiles.arrayBuffer());
  fs.writeFileSync(`public/tmp/basic.pdf`, buff);
  try {
    // Initial setup, create credentials instance
    const credentials = new ServicePrincipalCredentials({
      clientId: PDF_SERVICES_CLIENT_ID,
      clientSecret: PDF_SERVICES_CLIENT_SECRET,
    });

    // Creates a PDF Services instance
    const pdfServices = new PDFServices({ credentials });

    // Creates an asset(s) from source file(s) and upload
    readStream = fs.createReadStream(`public/tmp/basic.pdf`);
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF,
    });

    // Create parameters for the job
    const params = new ExtractPDFParams({
      elementsToExtract: [ExtractElementType.TEXT],
    });

    // Creates a new job instance
    const job = new ExtractPDFJob({ inputAsset, params });

    // Submit the job and get the job result
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: ExtractPDFResult,
    });

    // Get content from the resulting asset(s)
    if (!pdfServicesResponse.result) throw new Error('Empty response');
    const resultAsset = pdfServicesResponse.result.resource;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });

    // Creates a write stream and copy stream asset's content to it
    const outputFilePath = `public/tmp/output.zip`;
    const writeStream = fs.createWriteStream(outputFilePath);
    const doStream = streamAsset.readStream.pipe(writeStream);
    const text = await new Promise((resolve, reject) => {
      doStream
        .on('finish', () => {
          console.log(`Saving asset at ${outputFilePath}`);
          let zip = new AdmZip(outputFilePath);
          let jsondata = zip.readAsText('structuredData.json');
          let data = JSON.parse(jsondata);
          let outputText = '';
          data.elements.forEach((el: any) => {
            if (el.Text) {
              outputText += `${el.Text}\n`;
            }
          });
          resolve(outputText);
        })
        .on('error', (err) => {
          reject(err);
        });
    });

    return NextResponse.json({ text });
  } catch (err) {
    if (err instanceof SDKError || err instanceof ServiceUsageError || err instanceof ServiceApiError) {
      console.error('Exception encountered while executing operation', err);
    } else {
      console.error('Other Error:', err);
    }
  } finally {
    readStream?.destroy();
  }
};
