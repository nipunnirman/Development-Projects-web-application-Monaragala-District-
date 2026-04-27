import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

(async function() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('sl_dev_projects');
  
  const byObjWithScope = await db.collection('projects').find({ 
    dsDivisionId: new ObjectId("69ec8a60137d2e7fb5e63030"),
    scope: "specific"
  }).toArray();
  
  console.log('byObjWithScope count:', byObjWithScope.length);
  
  await client.close();
})();
