
// Import required AWS SDK clients and commands for Node.js
import {AnalyzeExpenseCommand} from "@aws-sdk/client-textract";
import {TextractClient} from "@aws-sdk/client-textract";

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
}

const process_text_detection = async () => {
    try {
        const aExpense = new AnalyzeExpenseCommand(params);
        const response = await textractClient.send(aExpense);
        //console.log(response)
        response.ExpenseDocuments.forEach(doc => {
            doc.LineItemGroups.forEach(items => {
                items.LineItems.forEach(fields => {
                    fields.LineItemExpenseFields.forEach(expenseFields => {
                        console.log(expenseFields)
                    })
                }
                )
            }
            )
        }
        )
        return response; // For unit tests.
    } catch (err) {
        console.log("Error", err);
    }
}

process_text_detection()

