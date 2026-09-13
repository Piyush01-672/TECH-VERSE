const express = require('express');
const clubMemberController = require('../controllers/ClubMemberController');
const validate = require('../middlewares/validate');
const { EnquiryValidationSchema } = require('../validations/EnquiryValidation');
const router = express.Router();

router.get('/', clubMemberController.getClubMembers);
router.post('/', validate(EnquiryValidationSchema), clubMemberController.submitClubMember);
router.patch('/:id/role', clubMemberController.updateMemberRole);
router.put('/:id/role', clubMemberController.updateMemberRole);
router.put('/:id', clubMemberController.updateMemberRole);
router.patch('/:id', clubMemberController.updateMemberRole);

module.exports = router;
