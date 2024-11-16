const { Account } = require("../schema/schema");
const mongoose = require("mongoose")
const transferFunds = async (fromAccountId, toAccountId, amount) => {
    try {
       
        const fromAccount = await Account.findOne({userId:fromAccountId});
        const toAccount = await Account.findOne({userId:toAccountId});

        if (!fromAccount || !toAccount) {
            throw new Error("One or both accounts do not exist.");
        }

        
        if (fromAccount.balance < amount) {
            throw new Error("Insufficient funds.");
        }

     
        await Account.findOneAndUpdate({userId:fromAccountId}, { $inc: { balance: -amount } });
        await Account.findOneAndUpdate({userId:toAccountId}, { $inc: { balance: amount } });

        console.log("Funds transferred successfully.");
    } catch (error) {
        console.error("Error during funds transfer:", error);
    }
};

// Example call

module.exports = transferFunds