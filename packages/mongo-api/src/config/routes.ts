import { Router } from "express";
import passport from "passport";
import { addGroup, deleteGroups, getGroups, updateGroup } from "../models/groups.model";
import { addProperties, deleteProperties, getProperties } from "../models/properties.model";
import { Roles } from "../models/roles.model";
import { createNewUser, loginUserWithPassword } from "../models/user.model";
import { ERROR_MSGS } from "./errors";



// TODO: Implement Swagger for API documentation

// const conn = async () => await mongoInstance();
// const GridFS = new Mongoose.mongo.GridFSBucket(conn.db, {
//     bucketName: "files"
// })
// const Groups = models.groups;
// const Properties = models.properties;
// const Roles = models.roles;
// const Users = models.users;
const router = Router();

// router.get("/image/:filename", async (req, res, next) => {
//     if (!req.params.filename) {
//         next(new BadRequest(ERROR_MSGS.NO_FILENAME));
//     }

//     GridFS.openDownloadStreamByName(req.params.filename).on("error", error => (
//         next(new BadRequest(error.message))
//     )).pipe(res);
// });

// router.get("/files/:pid/:type?", passport.authenticate('jwt', { session: false }), async (req, res, next) => {

//     if (!req.params.pid) {
//         next(new BadRequest(ERROR_MSGS.NO_PROPERTY_ID));
//     }

//     const type = req.params.type ? { "metadata.type": req.params.type } : {};
//     GridFS.find({ "metadata.pid": req.params.pid, ...type }).toArray((error: Error, files: any[]) => {
//         if (error) {
//             next(new BadRequest(error.message));
//         }

//         res.json({
//             files,
//             success: true
//         });
//     });
// });

// router.post("/upload", passport.authenticate('jwt', { session: false }), multerMiddleware, async (_, res) => {
//     return res.json({
//         success: true
//     });
// });

// router.get('/delete/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
//     if (!req.params.id) {
//         next(new BadRequest(ERROR_MSGS.NO_PROPERTY_ID));
//     }

//     const id = mongoose.Types.ObjectId(req.params.id);
//     GridFS.delete(id, (error, result) => {
//         if (error) {
//             next(new BadRequest(error.message));
//         }
//         res.json({
//             info: result,
//             success: true
//         })
//     })
// });

// router.post("/properties/delete", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
//     if (req.user && ![1, 2, 4].includes(req.user.role)) {
//         next(new BadRequest(ERROR_MSGS.USER_ROLE_NOT_ALLOWED));
//     }
//     if (!req.body.ids) {
//         next(new BadRequest(ERROR_MSGS.NO_PROPERTY_IDS));
//     }

//     if (!Array.isArray(req.body.ids)) {
//         next(new BadRequest(ERROR_MSGS.NOT_ARRAY));
//     }

//     let fileCount = 0;
//     const fileErrors: string[] = [];
//     const getProperties = await Properties.find({ propertyId: { $in: req.body.ids } });
//     const existingProperties: string[] = JSON.parse(JSON.stringify(getProperties))
//         .map(({ propertyId }: { propertyId: string }) => propertyId);

//     if (existingProperties.length <= 0) {
//         next(new NotFound(ERROR_MSGS.NOTHING_FOUND));
//     }

//     for (const pid of existingProperties) {
//         GridFS.find({ "metadata.pid": String(pid) }).toArray((error: Error, files: any[]) => {
//             if (error) {
//                 fileErrors.push(error.message);
//             }
//             for (const file of files) {
//                 GridFS.delete(mongoose.Types.ObjectId(file._id), (error) => {
//                     if (error) {
//                         fileErrors.push(error.message);
//                     }
//                 })
//                 fileCount += 1;
//             }
//         });
//     }

//     await Properties.deleteMany({
//         propertyId: {
//             $in: existingProperties
//         }
//     });

//     res.json({
//         errors: fileErrors,
//         messages: `${existingProperties.length} Properties have been deleted, and ${fileCount} files have been deleted`,
//         success: true
//     })

// })
router.post("/register", async (req, res, next) => {
    try {
        const result = await createNewUser({
            group: req.body.group,
            name: req.body.name,
            role: req.body.role,
            email: req.body.email,
            password: req.body.password
        });
        return res.json(result);
    } catch (e) {
        next(e);
    }
});

// router.get("/session-expired", passport.authenticate('jwt', { session: false }), async (_, res) => {
//     res.json({
//         success: true
//     })
// });

router.post("/login", async (req, res, next) => {
    try {
        const result = await loginUserWithPassword(req.body.username, req.body.password);
        return res.json(result);
    } catch (e) {
        next(e);
    }
});

// router.get("/reset-password", () => {
//     // Should be a seperate package
// });

router.get("/roles", passport.authenticate('jwt', { session: false }), (_, res, next) => {
    Roles.find((error: Error, roles: Record<string, string>) => {
        if (error) {
            next(error);
        }

        res.json({ roles });
    })
});
// router.get("/users", passport.authenticate('jwt', { session: false }), (_, res, next) => {
//     Users.find().lean((error: Error, users: Record<any, any>) => {
//         if (error) {
//             next(error);
//         }
//         res.json({ users: JSON.stringify(users) });
//     })
// });
// router.get("/groups/:id", passport.authenticate('jwt', { session: false }), (req, res, next) => {
//     const filter = {
//         groupId: {
//             $in: [Number(req.params.id)]
//         }
//     };

//     console.log("asdasdasdGROUPSD:", req.params);

//     Groups.find().lean((error: Error, groups: Record<any, any>) => {
//         if (error) {
//             next(error);
//         }
//         res.json({
//             groups: JSON.stringify(groups)
//         });
//     });
// });
router.get(["/properties", "/properties/:gid/:pid"], passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const { gid, pid } = req.params;


    try {
        if (!gid && !pid) {
            throw new Error(ERROR_MSGS.NO_ID);
        }
        const result = await getProperties({
            gid: Number(gid),
            pids: [Number(pid)]
        });

        return res.json(result);
    } catch (e) {
        next(e);
    }
});

router.post("/properties/add", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        if (!req.body || !req.body.length) {
            throw new Error(ERROR_MSGS.NO_PROPERTIES_PAYLOAD);
         }
         
        const result = await addProperties(req.body);
        return res.json(result);
    } catch (e) {
        next(e);
    }
});


router.post("/properties", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const { gid, pids } = req.body;

    try {
        if (!gid && (!pids || !pids.length)) {
            throw new Error(ERROR_MSGS.NO_ID);
         }
        const result = await getProperties({
            gid: gid && Number(gid) || undefined,
            pids: Array.isArray(pids) ? pids.map((pid: string) => Number(pid)) : [Number(pids)]
        });

        return res.json(result);
    } catch (e) {
        next(e);
    }
});

router.post("/properties/delete", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const { pids } = req.body;

    try {
        if (!pids || !pids.length) {
            throw new Error(ERROR_MSGS.NO_ID);
         }
        const result = await deleteProperties({
            pids: Array.isArray(pids) ? pids.map((pid: string) => Number(pid)) : [Number(pids)]
        });

        return res.json(result);
    } catch (e) {
        next(e);
    }
});


router.post("/groups/add", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        if (!req.body || !req.body.length) {
            throw new Error(ERROR_MSGS.NO_GROUPS);
         }
         
        const result = await addGroup(req.body);
        return res.json(result);
    } catch (e) {
        next(e);
    }
});

router.get(["/groups","/groups/:gid"], passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const { gid } = req.params;

    try {
        const result = await getGroups(Number(gid) || undefined);
        return res.json(result);
    } catch (e) {
        next(e);
    }
});

router.post("/groups/update", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const { gid, group } = req.body;

    try {
        if (!gid || !group) {
            throw new Error(ERROR_MSGS.NO_GROUPS);
        }
        const result = await updateGroup({ from: Number(gid), to: JSON.parse(group) });
        return res.json(result);
    } catch (e) {
        next(e);
    }
});

router.post("/groups/delete", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const { gids } = req.body;

    try {
        if (!gids || !gids.length) {
            throw new Error(ERROR_MSGS.NO_ID);
         }
        const result = await deleteGroups({
            gids: Array.isArray(gids) ? gids.map((gid: string) => Number(gid)) : [Number(gids)]
        });

        return res.json(result);
    } catch (e) {
        next(e);
    }
});


export default router;