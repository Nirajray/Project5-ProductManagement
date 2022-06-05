const isValid = function(value) {
    if (typeof(value) === 'undefined' || typeof(value) === null) {
        return false
    }
    if (typeof(value) === "number" && (value).toString().trim().length > 0) {
        return true
    }
    if (typeof(value) === "string" && (value).trim().length > 0) {
        return true
    }

}
const isValidTotal = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === null) {
        return false
    }
    if (typeof (value).trim().length === 0) {
        return false
    }
    if (typeof (value) === "number" && (value).trim().length > 0) {
        return true
    }
    
}
const validInstallment = function isInteger(value) {
    if (value < 0) return false
    if (value % 1 == 0) return true
}


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const validQuantity = function isInteger(value) {
    if(value < 1) return false
     if(value % 1 == 0 ) return true
}

const isValidStatus = function(status) {
    return ['pending', 'completed', 'cancelled'].indexOf(status) !== -1
}



module.exports.isValidTotal = isValidTotal;
module.exports = {isValid, isValidStatus,validQuantity}

module.exports.validInstallment = validInstallment;
module.exports.isValidRequestBody= isValidRequestBody 
module.exports.isValidRequestBody= isValidRequestBody


