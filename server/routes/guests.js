const router = require("express").Router();
const auth = require("../middleware/auth");
//Guest Model
const Guest = require("../models/Guest");
const { check, validationResult } = require("express-validator");

router.get("/", auth, async (req, res) => {
  try {
    const guest = await Guest.find({ user: req.user.id });
    res.json(guest);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Serevr Error");
  }
});

router.post(
  "/",
  [
    check("name", "Please provide a name")
      .not()
      .isEmpty(),
    check("phone", "Please provide a valid phone number")
      .not()
      .isEmpty()
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { name, phone, dietary, isconfirmed } = req.body;
    try {
      let guest = new Guest({
        user: req.user.id,
        name,
        phone,
        dietary,
        isconfirmed
      });
      guest = await guest.save();
      res.json(guest);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    let guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ msg: "Guest Not Found" });
    }
    await Guest.findByIdAndRemove(req.params.id);
    res.send("Guest Removed");
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

router.put("/:id", auth, async (req, res) => {
  const { name, phone, dietary, isconfirmed } = req.body;
  const updayedGuest = { name, phone, dietary, isconfirmed };
  try {
    let guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ msg: "Guest Not Found" });
    }
    guest = await Guest.findByIdAndUpdate(
      req.params.id,
      { $set: updayedGuest },
      { new: true }
    );
    res.send(guest);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
