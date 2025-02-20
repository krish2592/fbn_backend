import mongoose from "mongoose";

async function watchChanges() {
  const uri = process.env.CONNECTION_STRING;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('fbn001');
    const collection = database.collection('tickets');

    // Open a Change Stream
    const changeStream = collection.watch();

    console.log("Watching for changes...");

    // Listen for changes
    changeStream.on('change', (change) => {
      console.log('Change detected:', change);

      // Check for specific field updates
      if (change.operationType === 'update' && change.updateDescription) {
        if (change.updateDescription.updatedFields['your-field']) {
          console.log("Trigger condition met! Running your logic...");
          // Add your logic here (e.g., run a query or perform an action)
        }
      }
    });

  } catch (error) {
    console.error("Error watching changes:", error);
  }
}

watchChanges();
