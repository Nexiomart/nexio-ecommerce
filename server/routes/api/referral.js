const express = require('express');
const router = express.Router();

const Merchant = require('../../models/merchant');
const GrowthPartner = require('../../models/growthpartner');

// Lookup a referral code by uniqueId (GRW-XXXXXX or MER-XXXXXX)
router.get('/lookup/:code', async (req, res) => {
  try {
    const { code } = req.params;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invalid referral code.' });
    }

    let entity = null;
    let type = null;

    if (code.startsWith('GRW-')) {
      entity = await GrowthPartner.findOne({ uniqueId: code });
      type = 'GrowthPartner';
    } else if (code.startsWith('MER-')) {
      entity = await Merchant.findOne({ uniqueId: code });
      type = 'Merchant';
    } else {
      return res.status(404).json({ error: 'Referral code not recognized.' });
    }

    if (!entity) {
      return res.status(404).json({ error: 'Referral code not found.' });
    }

    if (!entity.isActive) {
      return res.status(400).json({ error: `${type} is inactive.` });
    }

    return res.status(200).json({
      exists: true,
      type,
      name: entity.name,
      uniqueId: entity.uniqueId
    });
  } catch (err) {
    return res.status(500).json({ error: 'Could not validate referral code.' });
  }
});

module.exports = router;

