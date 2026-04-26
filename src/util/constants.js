export const FORM_FIELD_DATATYPES_OBJECT = {
    "String": {
        name: "String",
        inputtype: "text",
        inputoptions: {}
    },
    "Number": {
        name: "Number",
        inputtype: "text",
        inputoptions: {
            inputMode: "numeric"
        }
    },
    "Email": {
        name: "Email",
        inputtype: "email",
        inputoptions: {}
    },
    "Contact-number": {
        name: "Contact-number",
        inputtype: "text",
        inputoptions: {
            inputMode: "numeric",
            maxLength: 10
        }
    },
    "Datetime": {
        name: "Datetime",
        inputtype: "datetime-local",
        inputoptions: {}
    },
    "File": {
        name: "File",
        inputtype: "file",
        inputoptions: {}
    },
    "Boolean": {
        name: "Boolean",
        inputtype: "radio",
        inputoptions: {},
        isEnum: true
    },
    "Options": {
        name: "Options",
        inputtype: "",
        inputoptions: {},
        isEnum: true
    }
}

export const FORM_FIELD_DATATYPES = [
    {
        name: "String",
        inputtype: "text",
        inputoptions: {}
    },
    {
        name: "Number",
        inputtype: "text",
        inputoptions: {}
    },
    {
        name: "Email",
        inputtype: "email",
        inputoptions: {}
    },
    {
        name: "Contact-number",
        inputtype: "text",
        inputoptions: {
            maxLength: 10
        }
    },
    {
        name: "Datetime",
        inputtype: "datetime-local",
        inputoptions: {}
    },
    {
        name: "File",
        inputtype: "file",
        inputoptions: {}
    },
    {
        name: "Boolean",
        inputtype: "radio",
        inputoptions: {},
        isEnum: true
    },
    {
        name: "Options",
        inputtype: "",
        inputoptions: {},
        isEnum: true
    }
]