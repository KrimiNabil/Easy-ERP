const express = require('express');
// an express method used to route BL
const router = express.Router();
const User = require('../models/user')
const Entity = require('../models/entity')
// import bcrypt
const bcrypt = require('bcrypt')
// import json web token 
const jwt = require('jsonwebtoken');
// session Config
const key = "Pscho101";
// import multer
const multer = require('multer');
// import path from core
const path = require('path');
const fs = require('fs'); // File system to check file existence


// this will define the type of file you will accept
const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/xml': 'xml',
    'image/svg': 'svg',
   
}

// multer configuration
const storageConfig = multer.diskStorage({
    // destination cd mean call back
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        if (isValid) {
            cb(null, 'backend/uploads')
        }
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE[file.mimetype];
        const imgName = `${Date.now()}-easyErp.${extension}`;
        cb(null, imgName);
    }
});

// import nodemailer
const mail = require('./mailer');
const sendPdfEmail =require('./pdfmail');
// generate password
const generate = require('generate-password')
// Get All Users
router.get("/", (req, res) => {
    User.find().then(
        (docs) => {
            if (docs) {
                res.json({ users: docs });
            } else {
                res.json({ msg: "error" });
            }
        }
    )
});

// add user (signup)
// storage:storageConfig (config storage and location)/avatar the name of image from FE
router.post("/", multer({ storage: storageConfig }).single('avatar'), (req, res) => {
    console.log(req.body);
    User.findOne({ "contactDetails.email": req.body.email }).then(
        (doc) => {
            if (doc) {
                res.json({ msg: "you alredy have an account" });
            } else {
                bcrypt.hash(req.body.pwd, 8).then(
                    (doc) => {
                        let hashed = doc
                        console.log(req.file);
                        if (req.file) {
                            req.body.avatar = `http://localhost:3000/images/${req.file.filename}`
                        }
                        let user = new User({
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            pwd: hashed, 
                            role:req.body.role,
                            gender: req.body.gender,
                            contactDetails: {
                                fullName: req.body.fullName,
                                phone: req.body.phone,
                                email: req.body.email,
                                address: req.body.address,
                                country: req.body.country,
                                city: req.body.city,
                                state: req.body.state,
                            },
                            bankAccountInfo: {
                                accountHolderName: req.body.accountHolderName,
                                accountNumber: req.body.accountNumber,
                                bankName: req.body.bankName,
                                swiftCode: req.body.swiftCode,
                                branchName: req.body.branchName,
                            },
                           
                            avatar: req.body.avatar,
                        });
                        user.save((err, doc) => {
                            console.log(doc);
                            if (doc) {
                                res.json({ msg: "added" });
                            } else {
                                res.json({ error: err });
                            }
                        })
                    }
                )

            }
        }
    )
});
// login 
router.post("/login", (req, res) => {
    console.log(req.body);
    User.findOne({ "contactDetails.email": req.body.email }).then(
        (doc) => {
            console.log(doc);
            if (!doc) {
                res.json({ msg: "incorect email" });
            } else {
                bcrypt.compare(req.body.pwd, doc.pwd).then(
                    (compair) => {
                        console.log(compair);
                        if (!compair) {
                            res.json({ msg: "incorect password" });
                        } else {
                            let connectUser = {
                                id: doc._id,
                                firstName: doc.firstName,
                                userName: doc.userName,
                                lastName: doc.lastName,
                                contactDetails: {
                                    phone: doc.phone,
                                    email: doc.email,
                                },
                                role: doc.role,
                                entityID: doc.entityID,
                                avatar: doc.avatar
                            }
                            let login = jwt.sign(connectUser, key, { expiresIn: '1h' });
                            res.json({ msg: "correct", token: login });
                        }
                    }
                )
            }
        }
    )
});

// Add Accounting Agent
router.post("/addAcountingAgent", multer({ storage: storageConfig }).single('avatar'), (req, res) => {
    console.log(req.body);

    User.findOne({ "contactDetails.email": req.body.email }).then(
        (doc) => {
            if (doc) {
                res.json({ msg: "Agent exist" })
            } else {
                Entity.findById({ _id: req.body.entityID }).then(
                    (entityFound) => {
                        if (entityFound) {
                            let genteratedPwd = generate.generate({
                                length: 10,
                                numbers: true,
                                symbols: true
                            })
                            if (req.file) {
                                req.body.avatar = `http://localhost:3000/images/${req.file.filename}`
                            }
                            let agent = new User({
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                email: req.body.email,
                                pwd: genteratedPwd,
                                gender: req.body.gender,
                                contactDetails: {
                                    fullName: req.body.fullName,
                                    phone: req.body.phone,
                                    email: req.body.email,
                                    address: req.body.address,
                                    country: req.body.country,
                                    city: req.body.city,
                                    state: req.body.state,
                                },
                                role: "Accounting Agent",
                                avatar: req.body.avatar,

                            })
                            agent.save(async (err, doc) => {
                                // return error
                                if (err) {
                                    console.error("Error saving entity:", err);
                                    return res.status(500).json({ msg: "Error saving entity" });
                                }
                                if (doc) {
                                    try {
                                        entityFound.employees.push(doc._id);
                                        await entityFound.save();
                                        agent.entityID = doc._id
                                        await agent.save()
                                       mail(agent).catch(console.error);
                                        console.log("Email sent:");

                                        res.json({ msg: "added and email was sent" })
                                    } catch (err) {
                                        console.error("Error updating user:", err);
                                        return res.status(500).json({ msg: "Error adding agent" });
                                    }
                                }
                            });
                        }
                    }
                )
            }
        }
    )
});
// Add Signature
router.post("/addSignature", multer({ storage: storageConfig }).single('signaturePath'), (req, res) => {
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("File:", req.file);
    
    
    res.json({msg:"message reseved"});

    // User.findOne({ "contactDetails.email": req.body.email }).then(
    //     (doc) => {
    //         if (doc) {
    //             res.json({ msg: "Agent exist" })
    //         } else {
    //             Entity.findById({ _id: req.body.entityID }).then(
    //                 (entityFound) => {
    //                     if (entityFound) {
    //                         let genteratedPwd = generate.generate({
    //                             length: 10,
    //                             numbers: true,
    //                             symbols: true
    //                         })
    //                         if (req.file) {
    //                             req.body.avatar = `http://localhost:3000/images/${req.file.filename}`
    //                         }
    //                         let agent = new User({
    //                             firstName: req.body.firstName,
    //                             lastName: req.body.lastName,
    //                             email: req.body.email,
    //                             pwd: genteratedPwd,
    //                             gender: req.body.gender,
    //                             contactDetails: {
    //                                 fullName: req.body.fullName,
    //                                 phone: req.body.phone,
    //                                 email: req.body.email,
    //                                 address: req.body.address,
    //                                 country: req.body.country,
    //                                 city: req.body.city,
    //                                 state: req.body.state,
    //                             },
    //                             role: "Accounting Agent",
    //                             avatar: req.body.avatar,

    //                         })
    //                         agent.save(async (err, doc) => {
    //                             // return error
    //                             if (err) {
    //                                 console.error("Error saving entity:", err);
    //                                 return res.status(500).json({ msg: "Error saving entity" });
    //                             }
    //                             if (doc) {
    //                                 try {
    //                                     entityFound.employees.push(doc._id);
    //                                     await entityFound.save();
    //                                     agent.entityID = doc._id
    //                                     await agent.save()
    //                                    mail(agent).catch(console.error);
    //                                     console.log("Email sent:");

    //                                     res.json({ msg: "added and email was sent" })
    //                                 } catch (err) {
    //                                     console.error("Error updating user:", err);
    //                                     return res.status(500).json({ msg: "Error adding agent" });
    //                                 }
    //                             }
    //                         });
    //                     }
    //                 }
    //             )
    //         }
    //     }
    // )
});
// Update User
router.put("/", (req, res) => {
    console.log(req.body);
    User.updateOne({ _id: req.body._id }, req.body).then(
        (doc) => {
            console.log(doc);
            if (doc.nModified == 1) { res.json({ msg: true }) } else { res.json({ msg: false }) }
        }
    )
});
// Delete User dy ID
router.delete("/:id", (req, res) => {
    console.log(req.params.id);

    User.deleteOne({ _id: req.params.id }).then(
        (doc) => {
            if (doc.deletedCount == 1) {
                res.json({ msg: true })
            } else {
                res.json({ msg: false })
            }
        }
    )

});
// Get User by ID
router.get("/:id", (req, res) => {
    console.log(req.params.id);
    User.findById({ _id: req.params.id }).then(
        (doc) => {
            if (doc) {
                res.json({ user: doc });
            } else {
                res.json({ msg: "not found" });
            }

        }
    )
});

router.post("/sendmail", async (req, res) => {
    const fileToSend = req.body;

    console.log("Request body received from frontend:", fileToSend);

    // Validate input
    if (!fileToSend.customerEmail || !fileToSend.pdfUrl) {
        return res.status(400).json({ msg: 'Customer email and PDF URL are required.' });
    }

    try {
        // Extract the file name and determine its base directory dynamically
        const pdfFilename = path.basename(fileToSend.pdfUrl); // Extract file name
        const pdfDirectory = path.dirname(fileToSend.pdfUrl); // Extract directory
        const baseDirectory = path.resolve(pdfDirectory); // Resolve base directory

        // Construct the full path
        const fullPath = path.join(baseDirectory, pdfFilename);

        console.log("Resolved full path for PDF:", fullPath);

        // Update the fileToSend object with the resolved path
        fileToSend.pdfUrl = fullPath;

        // Send the email
        const emailInfo = await sendPdfEmail(fileToSend);

        console.log("Email sent successfully:", emailInfo);
        res.status(200).send({ msg: 'Email sent successfully', info: emailInfo });

    } catch (error) {
        console.error("Error processing email request:", error.message);
        res.status(500).send({
            error: 'Failed to send email',
            details: error.message,
        });
    }
});

router.get("/customer/stats", async (req, res) => {
   
    
    try {
        // Count total customers
        const totalCustomers = await User.countDocuments({ role: "Costumer" });
        console.log(totalCustomers);
        // Assuming we track weekly customer counts in a separate collection
        const previousWeekCustomers = await getPreviousWeekCustomerCount();

        // Calculate the percentage change
        const change = previousWeekCustomers > 0 
            ? ((totalCustomers - previousWeekCustomers) / previousWeekCustomers) * 100 
            : 100;

        res.status(200).json({total:
            totalCustomers,
            // change: change.toFixed(2), // Limit to 2 decimal places
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching customer statistics' });
    }
});

// Mock function for previous week's data (replace with actual database logic)
async function getPreviousWeekCustomerCount() {
    // Replace this with actual logic to fetch data from your database
    // For example, you might store weekly stats in a "stats" collection
    return 3540; // Mocked number for demonstration
}


// exports user BL
module.exports = router