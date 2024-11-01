import { NextRequest, NextResponse } from 'next/server';

import sgMail from '@sendgrid/mail';
import { EmailMsg } from '@/types/dto';
import { siteConfig } from '@/config/site';
import { render } from '@react-email/render';
import { InviteUserEmail } from '../../../emails/user-invite';

export interface UserInviteDTO {
    inviterEmail: string,
    inviterFirstName: string,
    receiverEmail: string,
    receiverFirstName: string,
    auditLink: string,
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // Set your SendGrid API Key
        sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
        // Parse the JSON body from the request
        const requestBody: UserInviteDTO = await req.json();

        const emailHtml = render(InviteUserEmail({
            inviterFirstName: requestBody.inviterFirstName,
            inviterEmail: requestBody.inviterEmail,
            receiverEmail: requestBody.receiverEmail,
            receiverFirstName: requestBody.receiverFirstName,
            auditLink: requestBody.auditLink,
            inviteFromIp: req.ip,
            inviteFromLocation: req.geo?.country,
        }));

        // Create the email message
        const msg: EmailMsg = {
            to: requestBody.receiverEmail,
            from: siteConfig.emailFrom,
            subject: 'You have been invited to evaluate an audit!',
            text: `Hello you have been invited to evaluate an audit!`,
            html: emailHtml,
        };

        // Send the email using SendGrid
        const response = await sgMail.send(msg);
        console.log(response[0].statusCode);
        console.log(response[0].headers);

        // Return a success response
        return NextResponse.json(response);
        // return NextResponse.json({ "message": "success" });
    } catch (error) {
        console.error(error);
        // Return an error response
        return NextResponse.json({ error });
    }
}
