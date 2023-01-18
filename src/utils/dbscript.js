
const db_sql = {
    "Q0":`SELECT * FROM users WHERE mobile_no = '{var1}'`,
    "Q1": `SELECT * FROM users WHERE mobile_no = '{var1}' and deleted_at IS null`,
    "Q2": `INSERT INTO users ( id,mobile_no,otp ) VALUES ('{var1}','{var2}','{var3}') RETURNING *`,
    "Q3": `UPDATE users SET otp = '{var1}',updated_at = '{var2}' WHERE mobile_no = '{var3}' RETURNING *`,
    "Q4": `UPDATE users SET is_verified = 'true',otp='0',updated_at = '{var1}' WHERE mobile_no = '{var2}' RETURNING *`,
    "Q5": `UPDATE users SET full_name = '{var1}',updated_at = '{var2}' WHERE mobile_no = '{var3}' RETURNING *`,
    "Q6": `INSERT INTO address (id,user_id,type,house_villa_no, full_address) VALUES ('{var1}','{var2}','{var3}','{var4}','{var5}') RETURNING *`,
    "Q7": `SELECT * FROM address WHERE user_id = '{var1}' and id = '{var2}' and deleted_at IS null `,
    "Q8": `UPDATE address SET type='{var1}',house_villa_no='{var2}', full_address='{var3}',updated_at='{var4}' WHERE user_id = '{var5}' and id = '{var6}' RETURNING *`,
    "Q9": `UPDATE address SET updated_at = '{var1}', deleted_at = '{var2}' WHERE user_id = '{var3}' and id = '{var4}' RETURNING *`,
    "Q10": `UPDATE address SET updated_at = '{var1}', status = '{var2}' WHERE user_id = '{var3}' and id='{var4}' RETURNING *`,
    "Q11": `SELECT * FROM address WHERE deleted_at IS null `,
    "Q12": `UPDATE users SET full_name = '{var1}',updated_at = '{var2}' WHERE mobile_no = '{var3}' RETURNING *`,
    "Q13": `UPDATE users SET updated_at = '{var1}', deleted_at = '{var2}' WHERE mobile_no = '{var3}' RETURNING *`,
    


}

function dbScript(template, variables) {
    if (variables != null && Object.keys(variables).length > 0) {
        return template.replace(new RegExp("\{([^\{]+)\}", "g"), (_unused, varName) => {
            return variables[varName];
        });
    }
    return template
}

module.exports = { db_sql, dbScript };