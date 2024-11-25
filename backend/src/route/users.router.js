// routes/users.js
const express = require("express");
const { body } = require("express-validator");
const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const avtMiddleware = require("../middlewares/avt.middleware");
const router = express.Router();


router.get("/", userController.getAllUsers);
router.get("/search", authMiddleware, userController.searchUserController);
router.get(
  "/except-current",
  authMiddleware,
  userController.getAllUsersExceptCurrent
);

router.get("/gender", authMiddleware, userController.getUserByGender);
router.get(
  "/following-posts",
  authMiddleware,
  userController.getFollowingPosts
);
router.get("/behavior", authMiddleware, userController.getBehavior);

router.get("/following", authMiddleware, userController.getUserFollowing);
router.get("/followers", authMiddleware, userController.getUserFollowers);

router.patch("/fullname-bio", authMiddleware, userController.updateFullnameAndBio);
router.get("/behavior/:id", authMiddleware, userController.getBehaviorId);
router.delete("/:id/follow", authMiddleware, userController.deleteFollower);
router.get(
  "/:id/check-followed",
  authMiddleware,
  userController.checkIsFollowed
);
router.get(
  "/:id/count",
  authMiddleware,
  userController.countFollowersAndFollowing
);
router.patch("/behavior", authMiddleware, userController.updateBehavior);
router.get(
  "/check-refresh-token",
  authMiddleware,
  userController.checkRefreshTokenHasExpired
);

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("username").not().isEmpty().withMessage("Username is required"),
    body("full_name").optional(),
    body("avatar_url")
      .optional()
      .isURL()
      .withMessage("Avatar URL must be a valid URL"),
    body("background_url")
      .optional()
      .isURL()
      .withMessage("Background URL must be a valid URL"),
    body("bio").optional(),
    body("behavior").optional(),
    body("gender").optional(),
    body("age").isNumeric().withMessage("Age must be a number"),
    body("location.coordinates")
      .optional()
      .isArray()
      .withMessage("Location coordinates must be an array"),
    body("location.coordinates.*")
      .optional()
      .isNumeric()
      .withMessage("Location coordinates must be numbers"),
  ],
  authController.registerUser
);

router.get("/:id", authMiddleware, userController.getUserById);

router.get("/avt/:id", authMiddleware, userController.getUserAvatar);

router.patch(
  "/avt/:id",
  authMiddleware,
  avtMiddleware,
  userController.updateAvatar
);

router.patch(
  "/background/:id",
  authMiddleware,
  userController.updateBackground
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  authController.loginUser
);

router.post("/refresh-token", authMiddleware, authController.refreshToken);

// follow
router.post("/:id/follow", authMiddleware, userController.addFollower);

router.put("/:id", authMiddleware, userController.updateUserInfo);
router.delete("/:id", authMiddleware, userController.deleteUser);



module.exports = router;
