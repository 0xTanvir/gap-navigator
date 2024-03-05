import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { render } from "@react-email/render";
import { EmailMsg } from "@/types/dto";
import { siteConfig } from "@/config/site";
import EvaluationEmail from "@/emails/evaluation-email";

export interface UserInviteDTO {
  senderEmail: string,
  receiverEmail: string,
  auditName: string,
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Set your SendGrid API Key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
    // Parse the JSON body from the request
    const requestBody: UserInviteDTO = await req.json();

    const emailHtml = render(EvaluationEmail({
      senderEmail: requestBody.senderEmail,
      receiverEmail: requestBody.receiverEmail,
      auditName: requestBody.auditName,
      inviteFromIp: req.ip,
      inviteFromLocation: req.geo?.country,
    }));

    // Create the email message
    const msg: EmailMsg = {
      to: requestBody.receiverEmail,
      from: siteConfig.emailFrom,
      subject: 'Hello,\\n\\nThe audit evaluations have been completed successfully. Please find the attached report for detailed insights.\\n\\nBest Regards,\\nAudit Team',
      text: `<p>Hello,</p><p>The audit evaluations have been completed successfully. Please find the attached report for detailed insights.</p><p>Best Regards,<br>Audit Team</p>`,
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
    return NextResponse.json({error});
  }
}