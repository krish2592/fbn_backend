import User from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';
// import logger from "../logger.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const moduleName = __filename;

class UserController {

  static async registerOrLogin(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await User.findOne({ email, isDeleted: false });

      if (user) {

        const userTokenDetails = { id: user?.userId, username: email };
        const accessToken = jwt.sign(userTokenDetails, process.env.SECRET_KEY, { expiresIn: "24h" });

        const sessionPayload = {
          userId: user.userId,
          email: user.email,
          phone: null,
          name: null,
          dob: null,
          accessToken: accessToken,
          refreshToken: user.refreshToken
        }

        return res.status(200).json({
          success: true,
          message: "User already exist",
          data: sessionPayload
        });
      }

      const userData = await User.create({
        email,
        userId: uuidv4(),
      })

      if (userData) {

        const userTokenDetails = { id: userData?.userId, username: email };

        const accessToken = jwt.sign(userTokenDetails, process.env.SECRET_KEY, { expiresIn: "24h" });
        const refreshToken = jwt.sign(userTokenDetails, process.env.REFRESH_SECRET_KEY);

        const updateSession = await User.findOneAndUpdate({
          userId: userData.userId, isDeleted: false
        }, { refreshToken: refreshToken });

        if (updateSession) {

          const sessionPayload = {
            userId: userData.userId,
            email: userData.email,
            phone: null,
            name: null,
            dob: null,
            accessToken: accessToken,
            refreshToken: refreshToken
          }

          return res.status(200).json({
            success: true,
            message: "User authenticated",
            data: sessionPayload
          });
        }
      }

    } catch (error) {
      console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
      return res.status(500).json({ message: "Server error", error });
    }
  }

  // Get user by ID
  static async getUser(req, res) {
    try {
      const { email } = req.query;
      const user = await User.findOne({ email, isDeleted: false });
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

      const userTokenDetails = { id: user?.userId, username: email };
      const accessToken = jwt.sign(userTokenDetails, process.env.SECRET_KEY, { expiresIn: "24h" });

      const resPayload = {
        userId: user.userId,
        email: user.email,
        phone: user.phone,
        name: user.name,
        dob: formatDate(user.dob),
        accessToken: accessToken,
        refreshToken: user.refreshToken
      }

      return res.status(200).json({
        success: true,
        message: "Get User Succeess",
        data: resPayload
      });
    } catch (error) {
      console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
      return res.status(500).json({ message: "Server error", error });
    }
  }


  static async refreshToken(req, res) {

    console.log(`${moduleName}: Refreshing token started`);

    const { refreshToken } = req.body

    if (!refreshToken) {

      console.log(`${moduleName}: No refresh token provided`);

      return res.status(403).json({ message: "No refresh token provided" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, async (err, decoded) => {

      console.log(`${moduleName}: Error: ${err}`);

      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      // Find user with this refresh token
      const user = await User.findOne({ userId: decoded.id, refreshToken });
      if (!user) return res.status(403).json({ message: "Refresh token not found" });

      // Generate new access token
      const newToken = jwt.sign({ id: user.userId, username: user.email }, process.env.SECRET_KEY, { expiresIn: "24h" });

      res.json(
        {   
        accessToken: newToken,
        refreshToken: refreshToken
       }
      );

    });

  };

  // Update user email
  static async updateUserEmail(req, res) {
    try {
      const { userId, updateQuery } = req.body;

      const user = await User.findOneAndUpdate({ userId: userId, isDeleted: false }, { email: updateQuery });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Update User Succeess",
      });
    } catch (error) {
      console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
      return res.status(500).json({ message: "Server error", error });
    }
  }


  // Get user name
  static async updateUserName(req, res) {
    try {
      const { userId, updateQuery } = req.body;

      console.log(req.query);

      const user = await User.findOneAndUpdate({ userId: userId, isDeleted: false }, { name: updateQuery });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Update User Succeess",
      });
    } catch (error) {
      console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
      return res.status(500).json({ message: "Server error", error });
    }
  }

  // Get user name
  static async updateUserPhone(req, res) {
    try {
      const { userId, updateQuery } = req.body;

      const user = await User.findOneAndUpdate({ userId: userId, isDeleted: false }, { phone: updateQuery });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Update User Succeess",
      });
    } catch (error) {
       console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
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

      const user = await User.findOneAndUpdate({ userId: userId, isDeleted: false }, { dob: dob });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Update User Succeess",
      });
    } catch (error) {
      console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
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
       console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
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
      console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
      return res.status(500).json({ message: "Server error", error });
    }
  }
}

export default UserController;
