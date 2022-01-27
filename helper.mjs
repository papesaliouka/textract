import {TextractDocument} from "amazon-textract-response-parser";
import {TextractClient, AnalyzeDocumentCommand} from "@aws-sdk/client-textract";
const fs = require('fs');
const textract = new TextractClient({});

async function main() {
    const textractResponse = await textract.send(
        new AnalyzeDocumentCommand({
            Document: {Bytes: fs.readFile('../Downloads/facture2.png', (err) => console.log(e))},
        })
    );
    const document = new TextractDocument(textractResponse);
}
