const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
exports.create = (req, res) => {
    res.send({ message: "create handler"});
};
exports.findAll = (req, res) => {
    res.send({ message: "finAll handler"});
};
exports.findOne = (req, res) => {
    res.send({ message: "finOne handler"});
};
exports.update = (req, res) => {
    res.send({ message: "update handler"});
};
exports.delete = (req, res) => {
    res.send({ message: "delete handler"});
};
exports.deleteAll = (req, res) => {
    res.send({ message: "deleteAll handler"});
};
exports.findAllFavorite = (req, res) => {
    res.send({ message: "findAllFavorite handler" });
};
exports.create = async (req, res, next) => {
    if(!req.body?.name){
        return next(new ApiError(400, "name can not be empty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};
exports.findAll = async (req, res, next) => {
    let document = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        const {name} = req.query;
        if (name) {
            document = await contactService.findByName(name);
        } else {
            document = await contactService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving contacts")
        );
    }
    return res.send(document);
};
exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    }   catch (error) {
        return next (
            new ApiError(
                500,
                'Error retrieving contact with id=${req.params.id}'
            )
        );
    }
};
exports.update = async (req, res, next)=> {
    if (Object.keys(req.body).length == 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if (!document){
            return next(new ApiError(404, "Contact was update successfully"));
        }
        return res.send({ message: "Contact was update successfully"});
    } catch (error) {
        return next(
            new ApiError(500, 'Error updating contact with id=${req.params.id}')
        );
    }
};
exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was deleted successfully" });
     } catch (error) {
            return next(
                new ApiError(
                    500,
                    'Could not delete contact with id=${req.params.id}'
                )
            );
        }
    };
