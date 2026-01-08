const axios = require("axios");

const checkMatchExists = async (matchId) => {
  try {
    console.log(`✅ Checking match: ${matchId}`);
    const response = await axios.get(`http://localhost:4000/api/match/${matchId}`);
    console.log("✅ API Response:", response.data);
    return response.data ? true : false;
  } catch (err) {
    console.error("❌ Connection error:", err.message);
    return false;
  }
};

module.exports = checkMatchExists;
