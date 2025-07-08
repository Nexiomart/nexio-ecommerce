const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:pincode', async (req, res) => {
  const { pincode } = req.params;

  try {
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = response.data[0];

    if (data.Status === 'Success' && data.PostOffice.length > 0) {
      const postOffice = data.PostOffice[0];
      const city = postOffice.District;
      const state = postOffice.State;

      return res.json({ pinCode: pincode, city, state });
    } else {
      return res.status(400).json({ error: 'Invalid PIN code' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
