const CodeCrafterRegistration = require('../models/CodeCrafterRegistration');

const registerCodeCrafterTeam = async (req, res) => {
  try {
    const {
      teamName,
      hackathonExperience,
      teamSize,
      contactNumber,
      transactionId,
      accommodationRequired,
      accommodationDetails,
      participants
    } = req.body;

    const serverUrl = `${req.protocol}://${req.get('host')}`;
    const transactionImage = req.file ? `${serverUrl}/${req.file.path.replace(/\\/g, '/')}` : '';

    const newRegistration = new CodeCrafterRegistration({
      teamName,
      hackathonExperience,
      teamSize,
      contactNumber,
      transactionId,
      transactionImage,
      accommodationRequired,
      accommodationDetails,
      participants,
    });

    await newRegistration.save();

    res.status(201).json({
      success: true,
      message: "CodeCrafter Team registered successfully!",
    });
  } catch (error) {
    console.error("CodeCrafter Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the CodeCrafter team.",
    });
  }
};

module.exports = { registerCodeCrafterTeam };
