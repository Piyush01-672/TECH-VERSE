const ClubMember = require('../models/ClubMember');
const Enquiry = require('../models/Enquiry');

const getClubMembers = async (req, res) => {
  try {
    const members = await ClubMember.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const submitClubMember = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.regNumber || !data.contact || !data.email || !data.department || !data.batch) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // Default designation and roleAssignee to empty strings so admin can fill in MongoDB
    if (!data.designation) {
      data.designation = '';
    }
    if (!data.roleAssignee) {
      data.roleAssignee = '';
    }
    if (!data.residenceType) {
      data.residenceType = 'Day Scholar';
    }
    if (!data.photo) {
      data.photo = '';
    }
    if (!data.memberId) {
      data.memberId = `TV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    // Save into ClubMember collection
    const newMember = new ClubMember(data);
    await newMember.save();

    // Also mirror to Enquiry collection for complete synchronization
    try {
      const newEnquiry = new Enquiry(data);
      await newEnquiry.save();
    } catch (mirrorErr) {
      console.warn('Mirror to Enquiry collection notice:', mirrorErr.message);
    }

    res.status(201).json({
      message: 'Club member registered successfully!',
      member: newMember,
    });
  } catch (err) {
    console.error('Club Member Registration Error:', err);
    res.status(500).json({ message: 'Server error registering club member' });
  }
};

// Admin route to update role or designation directly
const updateMemberRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { designation, roleAssignee, role, status } = req.body;

    const updatedMember = await ClubMember.findByIdAndUpdate(
      id,
      {
        ...(designation !== undefined && { designation }),
        ...(roleAssignee !== undefined && { roleAssignee }),
        ...(role !== undefined && { role }),
        ...(status !== undefined && { status }),
      },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member updated successfully', member: updatedMember });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getClubMembers,
  submitClubMember,
  updateMemberRole,
};
