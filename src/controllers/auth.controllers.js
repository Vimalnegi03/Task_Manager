import User from '../models/user.model.js'
import ApiError from '../utils/api-error.js'
import asyncHandler from '../utils/async-handler.js'
import ApiResponse from '../utils/api-response.js'
import { sendMail,emailVerificationContentMailGenContent,forgotPasswordMailGenContent } from '../utils/mail.js'
import crypto from 'crypto'
export const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, fullName } = req.body;
  const avatar = req.file;
  const localPath = avatar?.path;
  const url = `http://localhost:7000/api/v1/users/register/${localPath}`;
  
  // 1. Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    if (username === existingUser.username) {
      return res.status(400).json(
        new ApiError(400, { message: "Username already exists. Please choose a different one." })
      );
    } else {
      return res.status(400).json(
        new ApiError(400, { message: "Email already registered." })
      );
    }
  }

  // 2. Create user first (without token yet)
  const newUser = await User.create({
    email,
    username,
    password,
    fullName,
    avatar: {
      url,
      localPath,
    }
  });
 const user=await User.findOne({email}).select('-password')
  // 3. Generate email verification token
  const { hashedToken, unhashedToken, tokenExpiry } = await user.generateTemporaryToken();
   console.log(hashedToken);
   
  // 4. Update user with token values
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save();

  // 5. Send email with unhashed token
  const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${unhashedToken}&email=${email}`;
  const mailGenContent = emailVerificationContentMailGenContent(username, verificationUrl);

  await sendMail({
    email,
    subject: "Email Verification - Task Manager",
    mailGenContent,
  });

  res.status(201).json(
    new ApiResponse(201, {
      user: user,
      message: "User registered. Verification email sent.",
      success: true,
    })
  );
});

export const loginUser=asyncHandler(async(req,res,next)=>{
  const {email,password}=req.body
  const user=await User.findOne({email})
  if(!user)
    return res.status(400).json(new ApiError(400,{message:"Please enter a valid email"}))
  const isCorrect= await user.isPasswordCorrect(password)
  if(!isCorrect)
    return res.status(400).json(new ApiError(400,{message:"Please enter correct password"}))
  const token=await user.generateAccessToken(next);
  const cookieOption={
    httpOnly:true,
    maxAge:24*1000*60*60
  }
  res.cookie("token",token,cookieOption)
  res.status(200).json({
    success:true,
    message:"Login successfull",
    token,
    user:{
      id:user._id,
      name:user.fullName
    }
  })
}) 

export const verifyEmail=asyncHandler(async(req,res)=>{
  const {token}=req.params
  if(!token)
    return res.status(400).json(new ApiError(400,{message:"Please provide a valid token"}))
  const hashedToken =crypto.createHash("sha256")
                      .update(token).digest("hex")
  const user=await User.findOne({emailVerificationToken:hashedToken})
  if(!user)
    return res.status(400).json(new ApiError(400,{messsage:"User not found"}))
                      
   if(user.emailVerificationExpiry<Date.now())
    return res.status(400).json(new ApiError(400,{message:"verification time exceed"}))

   user.isEmailVerified=true
   user.emailVerificationToken=''
   user.emailVerificationExpiry=''
   await user.save()

  res.status(200).json(
    new ApiResponse(200, {
      message: "User verified successfully",
      success: true,
    })
  );
  
})

export const logoutUser=asyncHandler(async(req,res)=>{
  res.cookie("token","")
  res.status(200).json(new ApiResponse(200,"","User logged out successfully"))
})

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(new ApiError(400, { message: "Email is required" }));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json(new ApiError(404, { message: "User not found" }));
  }

  if (user.isEmailVerified) {
    return res.status(400).json(new ApiError(400, { message: "Email is already verified" }));
  }

  // Generate new verification token
  const { hashedToken, unhashedToken, tokenExpiry } = user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save();

  // Create verification URL
  const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${unhashedToken}&email=${email}`;

  // Create email content
  const mailGenContent = emailVerificationContentMailGenContent(user.username, verificationUrl);

  // Send email
  await sendMail({
    email: user.email,
    subject: "Resend Verification Email - Task Manager",
    mailGenContent: mailGenContent,
  });

  res.status(200).json(
    new ApiResponse(200, {
      message: "Verification email resent successfully. Please check your inbox.",
      success: true,
    })
  );
});

export const refreshAccessToken=asyncHandler(async(req,res)=>{

})
export const forgotPasswordRequest=asyncHandler(async(req,res)=>{
  const {email}=req.body
  const user=await User.findOne({email})
  if(!user)
    return res.status(400).json(new ApiError(400,{message:"user not found"}))
  const {hashedToken,unhashedToken,tokenExpiry}=await user.generateTemporaryToken()
  user.forgotPasswordToken=unhashedToken;
  user.forgotPasswordExpiry=tokenExpiry;
  await user.save();
  const passwordResetUrl = `${process.env.BASE_URL}/reset-password?token=${unhashedToken}&email=${email}`;
  const mailGenContent=forgotPasswordMailGenContent(user.username,passwordResetUrl)
  await sendMail({
    email,
    subject: "Email Verification - Task Manager",
    mailGenContent,
  });

  res.status(201).json(
    new ApiResponse(201, {
      message: "please check your mail ",
      success: true,
    })
  );
});

export const changeCurrentPassword=asyncHandler(async(req,res)=>{
  const {forgotPasswordToken}=req.params
  const {password}=req.body
  if(!forgotPasswordToken)
    return res.status(400).json(new ApiError(400,"Invalid token"))
 const user= await User.findOne({forgotPasswordToken})
 if(!user)
  return res.status(400).json(new ApiError(400,"Invalid token"))
  if(user.forgotPasswordExpiry<Date.now())
    return res.status(400).json(new ApiError(400,"Time expired to reset Password"))
  user.password=password;
  user.forgotPasswordExpiry=undefined;
  user.forgotPasswordToken=undefined;
  await user.save()
  res.status(200).json(new ApiResponse(200,"Password updated successfully"))
})
export const getCurrentUser=asyncHandler(async(req,res)=>{
  const _id=req.user?.id
  const user=await User.findOne({_id}).select("-password")
  if(!user)
    return res.status(400).json(new ApiError(400,{message:"User not found"}))
  res.status(200).json(new ApiResponse(200,{message:"user details fetched successfully"},{success:true}))
  
})
