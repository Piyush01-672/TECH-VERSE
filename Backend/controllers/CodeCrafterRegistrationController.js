const CodeCrafterRegistration = require('../models/CodeCrafterRegistration');

const registerCodeCrafterTeam = async (req, res) => {
  try {
    const {
      teamName,
      hackathonExperience,
      teamSize,
      contactNumber,
      accommodationRequired,
      accommodationDetails,
      participants
    } = req.body;

    const newRegistration = new CodeCrafterRegistration({
      teamName,
      hackathonExperience,
      teamSize,
      contactNumber,
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
