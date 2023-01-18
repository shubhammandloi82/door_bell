const express = require('express')
const router = express.Router();
const controller = require('../controller')
const {verifyTokenFn} = require('../utils/token')

router.post('/signup', controller.userController.signup);
router.post('/verifyOtp', verifyTokenFn,controller.userController.verify_otp);
router.post('/resendOtp', verifyTokenFn,controller.userController.resend_otp);
router.post('/submitProfile', verifyTokenFn,controller.userController.submit_profile);
router.post('/updateProfile', verifyTokenFn,controller.userController.update_profile);
router.post('/deleteUser', verifyTokenFn,controller.userController.delete_user);


//address api's
router.post('/addAddress', verifyTokenFn,controller.userController.add_address);
router.post('/getAddress', verifyTokenFn,controller.userController.get_address);
router.post('/editAddress', verifyTokenFn,controller.userController.edit_address);
router.post('/deleteAddress', verifyTokenFn,controller.userController.delete_address);
router.post('/activeDeactiveAddress', verifyTokenFn,controller.userController.active_deactive_address);
router.post('/getAddressList', verifyTokenFn,controller.userController.get_address_list);

module.exports = router