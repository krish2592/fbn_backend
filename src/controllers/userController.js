import User from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";

class UserController {

  static async registerOrLogin(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      let user = await User.findOne({ email });

      if (!user) {
        user = new User({
          email,
          userId: uuidv4(),
        });
        await user.save();
      }

      return res.status(200).json({
        success: true, 
        message: "User authenticated", 
        data: user });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }

  // Get user by ID
  static async getUser(req, res) {
    try {
      const { email } = req.query;
      const user = await User.findOne({email});
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log({data1:user})
      return res.status(200).json({
        success: true, 
        message: "Get User Succeess", 
        data: user });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }

  // Update user profile
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, profilePicture } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, profilePicture },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User updated", user: updatedUser });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }
}

export default UserController;
