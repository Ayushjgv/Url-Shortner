import nodemailer from "nodemailer";



export const SendEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ayushprajapat456@gmail.com",
            pass: "uoxl ewpb qhka ztjq"
        }
    });

    return await transporter.sendMail({
        from: "ayushprajapat456@gmail.com",
        to: email,
        subject: "Test Email",
        html: `<h1>Hello!</h1><p>This came from my localhost app. otp is <strong>${otp}</strong></p>`
    });
}
