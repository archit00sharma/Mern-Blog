import Ajv from "ajv";
const ajv = new Ajv();


const validation = (schema) => {
    return async (req, res, next) => {
        const validate = ajv.compile(schema);
        const valid = validate(req.body);
        if (!valid) {
            return res.status(400).json({
                error: validate.errors
            });
        } else {
            next();
        }
    };
};


const signupSchema = {
    type: "object",
    properties: {
        username: { type: "string" },
        email: { type: "string" },
        password: { type: "string" }
    },
    required: ["username", "email", "password"],
    additionalProperties: false
}



export const ajvValidations = {
    signup: validation(signupSchema),
}