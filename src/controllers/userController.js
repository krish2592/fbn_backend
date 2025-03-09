import User from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";

class UserController {

  static async registerOrLogin(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      let user = await User.findOne({ email, isDeleted: false });

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
      const user = await User.findOne({email, isDeleted:false});
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const formatDate = (date) => {
        if (!date) return null;
        const dob = new Date(date);
        const day = String(dob.getDate()).padStart(2, "0");
        const month = String(dob.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = dob.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const resPayload = {
      userId: user.userId,
      email: user.email,
      phone: user.phone,
      name: user.name,
      dob: formatDate(user.dob)
    }

      console.log({data1:resPayload})
      return res.status(200).json({
        success: true, 
        message: "Get User Succeess", 
        data: resPayload });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }


   // Update user email
   static async updateUserEmail(req, res) {
    try {
      const { userId, updateQuery } = req.body;

      const user = await User.findOneAndUpdate({userId: userId, isDeleted: false}, {email: updateQuery});
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        success: true, 
        message: "Update User Succeess", 
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }


   // Get user name
   static async updateUserName(req, res) {
    try {
      const { userId, updateQuery } = req.body;

      console.log(req.query);

      const user = await User.findOneAndUpdate({userId:userId, isDeleted: false},{name: updateQuery});
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        success: true, 
        message: "Update User Succeess", 
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }

  // Get user name
  static async updateUserPhone(req, res) {
    try {
      const { userId, updateQuery } = req.body;

      const user = await User.findOneAndUpdate({userId: userId, isDeleted: false}, {phone: updateQuery});
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        success: true, 
        message: "Update User Succeess", 
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }



   // Get user name
   static async updateUserDOB(req, res) {
    try {
      const { userId, updateQuery } = req.body;

      function convertToDate(updateQuery) {
        console.log("Received DOB:", updateQuery);
    
        // Validate format using regex (dd/mm/yyyy)
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
        if (!dateRegex.test(updateQuery)) {
            console.error("Invalid Date Format: Expected dd/mm/yyyy");
            return null;
        }
    
        const [day, month, year] = updateQuery.split("/").map(Number);
    
        // Create date object (JavaScript months are 0-based)
        const dateObject = new Date(Date.UTC(year, month - 1, day));
    
        // Validate the date object
        return isNaN(dateObject.getTime()) ? null : dateObject;
    }

    const dob = convertToDate(updateQuery);
    if (!dob) {
        console.log("Invalid Date Format: Must be dd/mm/yyyy");
        return;
    }

      const user = await User.findOneAndUpdate({userId: userId, isDeleted: false}, {dob: dob});
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        success: true, 
        message: "Update User Succeess", 
      });
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
