"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInputErros = void 0;
const express_validator_1 = require("express-validator");
const handleInputErros = (req, res, next) => {
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.handleInputErros = handleInputErros;
//# sourceMappingURL=validation.js.map