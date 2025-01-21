const express = require('express');
const router = express.Router();

const Entity = require('../models/entity');
const User = require('../models/user')

// import multer
const multer = require('multer');
// import path from core
const path = require('path');

// image will replace the path backend/uploads 
router.use('/images', express.static(path.join('backend/uploads')))
// this will define the type of file you will accept
const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

// multer configuration
const storageConfig = multer.diskStorage({
    // destination
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        if (isValid) {
            cb(null, 'backend/uploads')
        }
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE[file.mimetype];
        const imgName = name + '-' + Date.now() + '-easyErp-' + '.' + extension;
        cb(null, imgName);
    }
});
// add entity
router.post("/", multer({ storage: storageConfig }).single('logo'), (req, res) => {
    console.log(req.body);
    Entity.findOne({ registrationNumber: req.body.registrationNumber }).then(
        (doc) => {
            if (doc) {
                res.json({ msg: "entity exict" })
            } else {
                User.findById({ _id: req.body.owner }).then(
                    (owner) => {
                        if (!owner) {
                        } else {
                            if (req.file) {
                                req.body.logo = `http://localhost:3000/images/${req.file.filename}`
                            }
                            let entity = new Entity({
                                name: req.body.name,
                                registrationNumber: req.body.registrationNumber,
                                industry: req.body.industry,
                                website: req.body.website,
                                email: req.body.email,
                                phone: req.body.phone,
                                address: {
                                    street: req.body.street,
                                    city: req.body.city,
                                    state: req.body.state,
                                    country: req.body.country,
                                },
                                logo: req.body.logo,
                                bankDetails: {
                                    accountHolderName: req.body.accountHolderName,
                                    accountNumber: req.body.accountNumber,
                                    bankName: req.body.bankName,
                                    branchName: req.body.branchName,
                                    swiftCode: req.body.swiftCode,
                                },
                                owner:owner._id,
                                avatar: req.body.logo
                            })
                            entity.save(async (err, doc) => {
                                if (err) {
                                  console.error("Error saving entity:", err);
                                  return res.status(500).json({ msg: "Error saving entity" });
                                }
                                if (doc) {
                                  try {
                                    // Update the owner
                                    owner.role = "Entity Owner";
                                    owner.entityID = doc._id;
                                    await owner.save(); // Ensure the owner is saved successfully
                                    // Send the success response after both operations
                                    return res.json({ msg: "Entity and user updated successfully" });
                                  } catch (err) {
                                    console.error("Error updating user:", err);
                                    return res.status(500).json({ msg: "Error updating user" });
                                  }
                                }
                              });
                              
                          
                        }
                    }
                )
            }
        }
    )

})
// get entities
router.get("/", (req, res) => {
    Entity.find().then(
        (docs) => {
            if (!docs) {
                res.json({ msg: "entities was not found" })
            } else {
                res.json({ msg: "here entities", entities: docs })
            }
        }
    )
})
// get entity by id
router.get("/:id", (req, res) => {
    Entity.findById({ _id: req.params.id }).then(
        (doc) => {
            if (!doc) {
                res.json({ msg: "entity was not found" });
            } else {
                res.json({ msg: "here entity", entity: doc });
            }
        }
    )
})
// update entity
router.put("/", (req, res) => {
    Entity.updateOne({ _id: req.body._id }, req.body).then(
        (doc) => {
            if (doc.nModified == 1) {
                res.json({ msg: "update sucsses" })
            } else {
                res.json({ msg: "update fail" })
            }
        }
    )
})
// delete entity by id
router.delete("/:id", (req, res) => {
    Entity.deleteOne({ _id: req.params.id }).then(
        (doc) => {
            if (doc.deletedCount == 1) {
                res.json({ msg: "deleted " })
            } else {
                res.json({ msg: "not found " })
            }
        }
    )
})

module.exports = router