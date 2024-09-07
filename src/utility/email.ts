import nodemailer from "nodemailer";
import pug from 'pug';
import htmlToText from 'html-to-text';
export default class Email{
    private to: any;
    private firstName: string;
    private url: any;
    private from: string;
    constructor(user: { email: any; name: string; }, url: any) {
        this.to=user.email;
        this.firstName=user.name.split(" ")[0];
        this.url=url;
        this.from=process.env.EMAIL_FORM
    }
    newTransport(){
        if(process.env.NODE_ENV==='production'){
            return nodemailer.createTransport({
                service:"Gmail",
                auth:{
                    user:process.env.GMAIL_USERNMAE,
                    pass:process.env.GMAIL_PASSWORD,
                }
            });
        }
        return nodemailer.createTransport({
            host:process.env.EMIAL_HOST,
            port:process.env.EMAIL_PORT,
            auth:{
                user:process.env.EMAIL_USERNAME,
                pass:process.env.EMAIL_PASSWORD,
            }
        });
    }
    async send(template, subject) {
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        })
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: htmlToText.fromString(html),
            html
        }
        await this.newTransport().sendMail(mailOptions);
    }
    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Gym Family');
    }
    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
    }
}
