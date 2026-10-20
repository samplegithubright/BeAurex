const mongoose = require('mongoose');
require('dotenv').config();

async function fixMerchants() {
  await mongoose.connect(process.env.MONGO_URI);
  const merchants = await mongoose.connection.collection('merchants').find({}).toArray();
  for (const m of merchants) {
    const hasPayment = m.paymentAmount && m.paymentAmount !== '-' && m.paymentAmount !== '₹0' && m.paymentAmount !== '0';
    if (hasPayment && (m.subscriptionTier === 'TRIAL' || !m.subscriptionTier || m.subscriptionTier === 'Trial Plan')) {
      const num = Number(String(m.paymentAmount).replace(/[^0-9]/g, '')) || 49000;
      const tier = num <= 24000 ? 'STANDARD' : num >= 75000 ? 'LEGACY' : 'PROFESSIONAL';
      console.log('Updating merchant:', m.businessName, 'to', tier);
      await mongoose.connection.collection('merchants').updateOne(
        { _id: m._id },
        { $set: { subscriptionTier: tier } }
      );
    }
  }
  console.log('Finished updating merchants in MongoDB Atlas.');
  process.exit(0);
}

fixMerchants().catch(err => {
  console.error(err);
  process.exit(1);
});
