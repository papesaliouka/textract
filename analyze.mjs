// Import required AWS SDK clients and commands for Node.js
import {AnalyzeDocumentCommand} from "@aws-sdk/client-textract";
import {TextractClient} from "@aws-sdk/client-textract";
import trp from 'amazon-textract-response-parser'

const {TextractDocument} = trp;

// Set the AWS Region.
const REGION = "us-east-2"; //e.g. "us-east-1"
// Create SNS service object.
const textractClient = new TextractClient({region: REGION});

const bucket = 'factures-senelec'
const photo = 'facture1.png'

// Set params
const params = {
    Document: {
        S3Object: {
            Bucket: bucket,
            Name: photo
        },
    },
    FeatureTypes: ['FORMS', 'TABLES'],
}

const displayBlockInfo = async (response) => {
    try {
        response.Blocks.forEach(block => {
            console.log(`ID: ${block.Id}`)
            console.log(`Block Type: ${block.BlockType}`)
            if ("Text" in block && block.Text !== undefined) {
                console.log(`Text: ${block.Text}`);
            }
            else {}
            if ("Confidence" in block && block.Confidence !== undefined) {
                console.log(`Confidence: ${block.Confidence}`)
            }
            else {}
            if (block.BlockType == '') {
                console.log("Cell info:")
                console.log(`   Column Index - ${block.ColumnIndex}`)
                console.log(`   Row - ${block.RowIndex}`)
                console.log(`   Column Span - ${block.ColumnSpan}`)
                console.log(`   Row Span - ${block.RowSpan}`)
            }
            if ("Relationships" in block && block.Relationships !== undefined) {
                console.log("Geometry:")
                console.log(`   Bounding Box - ${JSON.stringify(block.Geometry.BoundingBox)}`)
                console.log(`   Polygon - ${JSON.stringify(block.Geometry.Polygon)}`)
            };
            console.log("-----")
        });
    } catch (err) {
        console.log("Error", err);
    }
}



const analyze_document_text = async () => {
    try {
        const analyzeDoc = new AnalyzeDocumentCommand(params);
        const response = await textractClient.send(analyzeDoc);
        const document = new TextractDocument(response)

        // for (const page of document.iterPages()) {
        //     console.log(page.form.str())
        // }

        let rowsArr = [];

        for (const page of document.iterPages()) {
            for (const table of page.iterTables()) {
                for (const row of table.iterRows()) {
                    console.table(row.str())
                }
            }
        }

        //for (const page of document.iterPages()) {
        //    // (In Textract's output order...)
        //    for (const line of page.iterLines()) {
        //        for (const word of line.iterWords()) {
        //            //console.log(word.text);
        //            //const addr = page.form.getFieldByKey(word.text);
        //            const value = page.form.str()
        //            for (const table of page.iterTables()) {
        //                for (const row of table.iterRows()) {
        //                    console.table(row.str())
        //                }

        //            }
        //            //console.log(addr)
        //            //console.log(value);
        //        }
        //    }
        //}
        //displayBlockInfo(response)
        return response; // For unit tests.
    } catch (err) {
        console.log("Error", err);
    }
}

analyze_document_text()
