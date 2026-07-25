import { XeroClient } from "xero-node";

async function test() {
    const xero = new XeroClient({
        clientId: process.env.XERO_CLIENT_ID || '',
        clientSecret: process.env.XERO_CLIENT_SECRET || '',
    });
    console.log(Object.keys(xero.accountingApi));
}

test();
