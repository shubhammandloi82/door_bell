const client = require('../config/db');
const { db_sql, dbScript } = require('../utils/dbscript');
const { v4: uuidv4 } = require('uuid')
const { issueJWT } = require('../utils/token')

module.exports.signup = async (req, res) => {
    try {
        let { mobile_no } = req.body
        let otp = Math.floor(100000 + Math.random() * 900000);
        let id = uuidv4();
        let s1 = dbScript(db_sql['Q0'], { var1: mobile_no })
        let checkUser = await client.query(s1);
        if (checkUser.rowCount == 0) {
            let s2 = dbScript(db_sql['Q2'], { var1: id, var2: mobile_no, var3: otp })
            let createUser = await client.query(s2);
            let payload = {
                mobile_no: mobile_no,
                id: createUser.rows[0].id
            }
            let token = await issueJWT(payload);
            if (createUser.rowCount > 0) {
                res.status(201).json({
                    success: true,
                    message: "User Registered Successfully",
                    data: createUser.rows,
                    token: token
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: "Something Went Wrong",
                    data: {}
                })
            }
        } else {
            let _dt = new Date().toISOString()
            if(checkUser.rows[0].deleted_at){
                return res.status(200).json({
                    success: true,
                    message: "User Account is Deleted Contact With DoorBell Team",
                    data: {}
                })
            }
            let s3 = dbScript(db_sql['Q3'], { var1: otp, var2: _dt, var3: mobile_no })
            let updateUser = await client.query(s3);
            if (updateUser.rowCount > 0) {
                let payload = {
                    mobile_no: mobile_no,
                    id: updateUser.rows[0].id
                }
                let token = await issueJWT(payload);
                res.status(200).json({
                    success: true,
                    message: "User Updated Succefully",
                    data: updateUser.rows,
                    token: token
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: "Something Went Wrong",
                    data: {}
                })
            }
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports.verify_otp = async (req, res) => {
    try {
        let mobile_no = user.mobile_no;
        let { otp } = req.body
        let _dt = new Date().toISOString();
        let s1 = dbScript(db_sql['Q1'], { var1: mobile_no })
        let checkUser = await client.query(s1);
        if (checkUser.rowCount > 0) {
            if (checkUser.rows[0].otp == otp) {
                let s2 = dbScript(db_sql['Q4'], { var1: _dt, var2: mobile_no })
                let updateUser = await client.query(s2);
                if (updateUser.rowCount > 0) {
                    res.status(200).json({
                        success: true,
                        message: "User Verified Successfully",
                        data: updateUser.rows
                    })
                } else {
                    res.status(400).json({
                        success: false,
                        message: "Something Went Wrong",
                        data: {}
                    })
                }
            } else {
                res.status(200).json({
                    success: true,
                    message: "Invalid Otp Please Provide Us a Valid Otp",
                    data: {}
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid User...!",
                data: {}
            })
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports.resend_otp = async (req, res) => {
    try {
        let mobile_no = user.mobile_no;
        let otp = Math.floor(100000 + Math.random() * 900000);
        let _dt = new Date().toISOString();
        let s1 = dbScript(db_sql['Q1'], { var1: mobile_no })
        let checkUser = await client.query(s1);
        if (checkUser.rowCount > 0) {
        let s2 = dbScript(db_sql['Q3'], { var1: otp, var2: _dt, var3: mobile_no })
        let updateOtp = await client.query(s2);
        if (updateOtp.rowCount > 0) {
            res.status(200).json({
                success: true,
                message: "Otp Sended To User Mobile No",
                data: updateOtp.rows
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Something Went Wrong",
                data: {}
            })
        }
    }else {
        res.status(400).json({
            success: false,
            message: "Invalid User...!",
            data: {}
        })
    }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports.submit_profile = async (req, res) => {
    try {
        let mobile_no = user.mobile_no;
        let { full_name, type, house_villa_no, full_address } = req.body;
        let s1 = dbScript(db_sql['Q1'], { var1: mobile_no })
        let checkUser = await client.query(s1);
        if (checkUser.rowCount > 0) {
            let _dt = new Date().toISOString()
            let s2 = dbScript(db_sql['Q5'], { var1: full_name, var2: _dt, var3: mobile_no })
            let updateUser = await client.query(s2);
            let id = uuidv4();
            let s3 = dbScript(db_sql['Q6'], {
                var1: id, var2: checkUser.rows[0].id
                , var3: type, var4: house_villa_no, var5: full_address
            })
            let updateAddress = await client.query(s3);
            if (updateAddress.rowCount > 0) {
                res.status(200).json({
                    success: true,
                    message: "User Profile Submited Successfully",
                    data: updateAddress.rows
                })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Something Went Wrong",
                    data: {}
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid User...!",
                data: {}
            })
        }

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports.update_profile = async (req, res) => {
    try {
        let {mobile_no,id} = user;
        let { full_name} = req.body;
        let s1 = dbScript(db_sql['Q1'], { var1: mobile_no })
        let checkUser = await client.query(s1);
        if (checkUser.rowCount > 0) {
            let _dt = new Date().toISOString()
            let s2 = dbScript(db_sql['Q12'], { var1: full_name, var2: _dt, var3: mobile_no })
            let updateUser = await client.query(s2);
            if (updateUser.rowCount > 0) {
                res.status(200).json({
                    success: true,
                    message: "User Profile Updated Successfully",
                    data: updateUser.rows
                })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Something Went Wrong",
                    data: {}
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid User...!",
                data: {}
            })
        }

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports.delete_user = async (req, res) => {
    try {
        let {mobile_no,id} = user;
        let s1 = dbScript(db_sql['Q1'], { var1: mobile_no })
        let checkUser = await client.query(s1);
        if (checkUser.rowCount > 0) {
            let _dt = new Date().toISOString()
            let s2 = dbScript(db_sql['Q13'], { var1: _dt, var2: _dt, var3: mobile_no })
            let deleteUser = await client.query(s2);
            if (deleteUser.rowCount > 0) {
                res.status(200).json({
                    success: true,
                    message: "User Profile Deleted Successfully",
                    data: deleteUser.rows
                })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Something Went Wrong",
                    data: {}
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid User...!",
                data: {}
            })
        }

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
// address controller function


module.exports.add_address = async (req, res) => {
    try {
        let {mobile_no,id} = user;
        let { type, house_villa_no, full_address } = req.body;
        let s1 = dbScript(db_sql['Q1'], { var1: mobile_no })
        let checkUser = await client.query(s1);
        if (checkUser.rowCount > 0) {
            let id = uuidv4();
            let s3 = dbScript(db_sql['Q6'], {
                var1: id, var2: checkUser.rows[0].id
                , var3: type, var4: house_villa_no, var5: full_address
            })
            let addAddress = await client.query(s3);
            if (addAddress.rowCount > 0) {
                res.status(200).json({
                    success: true,
                    message: "User Address Added Successfully",
                    data: addAddress.rows
                })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Something Went Wrong",
                    data: {}
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid User...!",
                data: {}
            })
        }

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports.get_address = async (req, res) => {
    try {
        let { mobile_no, id } = user;
        let {address_id } = req.body;
        let s1 = dbScript(db_sql['Q1'], { var1: mobile_no })
        let checkUser = await client.query(s1);
        if (checkUser.rowCount > 0) {
            let s2 = dbScript(db_sql['Q7'], { var1: id ,var2:address_id})
            let getAddress = await client.query(s2);
            if (getAddress.rowCount > 0) {
                res.status(200).json({
                    success: true,
                    message: "Get Address Details Successfully",
                    data: getAddress.rows
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: "This Address is Not Found",
                    data: {}
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid User...!",
                data: {}
            })
        }

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports.edit_address = async (req, res) => {
    try {
        let { mobile_no, id } = user;
        let { address_id,type, house_villa_no, full_address } = req.body;
        let s1 = dbScript(db_sql['Q1'], { var1: mobile_no })
        let checkUser = await client.query(s1);
        if (checkUser.rowCount > 0) {
            let _dt = new Date().toISOString()
            let s2 = dbScript(db_sql['Q8'], {
                var1: type, var2: house_villa_no
                , var3: full_address, var4: _dt, var5: id,var6:address_id
            })
            let updateAddress = await client.query(s2);
            if (updateAddress.rowCount > 0) {
                res.status(200).json({
                    success: true,
                    message: "User Address Updated Successfully",
                    data: updateAddress.rows
                })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "This Address is Not Found",
                    data: {}
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid User...!",
                data: {}
            })
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports.delete_address = async (req, res) => {
    try {
        let { mobile_no, id } = user;
        let { address_id }=req.body;
        let s1 = dbScript(db_sql['Q1'], { var1: mobile_no })
        let checkUser = await client.query(s1);
        if (checkUser.rowCount > 0) {
            let _dt = new Date().toISOString()
            let s2 = dbScript(db_sql['Q9'], {
                var1: _dt, var2: _dt
                , var3: id ,var4:address_id
            })
            let deleteAddress = await client.query(s2);
            if (deleteAddress.rowCount > 0) {
                res.status(200).json({
                    success: true,
                    message: "User Address Deleted Successfully",
                    data: {}
                })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "This Address is Not Found",
                    data: {}
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid User...!",
                data: {}
            })
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports.active_deactive_address = async (req, res) => {
    try {
        let { mobile_no, id } = user;
        let { address_id,status } = req.body;
        let s1 = dbScript(db_sql['Q1'], { var1: mobile_no })
        let checkUser = await client.query(s1);
        if (checkUser.rowCount > 0) {
            let _dt = new Date().toISOString()
            let s2 = dbScript(db_sql['Q10'], {
                var1: _dt, var2: status
                , var3: id,var4:address_id
            })
            let activeDeactiveAddress = await client.query(s2);
            if (activeDeactiveAddress.rowCount > 0) {
                res.status(200).json({
                    success: true,
                    message: "User Address Active/Deactive Successfully",
                    data: activeDeactiveAddress.rows
                })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "This Address is Not Found",
                    data: {}
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid User...!",
                data: {}
            })
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports.get_address_list = async (req, res) => {
    try {
        let { mobile_no,id } = user;
        let s1 = dbScript(db_sql['Q1'], { var1: mobile_no })
        let checkUser = await client.query(s1);
        if (checkUser.rowCount > 0) {
            let s2 = dbScript(db_sql['Q11'])
            let getAddressList = await client.query(s2);
            if (getAddressList.rowCount > 0) {
                res.status(200).json({
                    success: true,
                    message: "Get User Address List Successfully",
                    data: getAddressList.rows
                })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Empty List ..!",
                    data: {}
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid User...!",
                data: {}
            })
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}