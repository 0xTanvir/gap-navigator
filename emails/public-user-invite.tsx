import React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading, Hr, Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from "@react-email/components";
import { siteConfig } from "@/config/site";

interface PublicUserInviteEmailProps {
  inviterEmail?: string,
  receiverEmail?: string,
  auditLink?: string,
  inviteFromIp?: string,
  inviteFromLocation?: string,
}

const PublicUserInvite = ({
                            inviterEmail,
                            receiverEmail,
                            auditLink = 'https://gapnavigator.com/audits',
                            inviteFromIp = '',
                            inviteFromLocation = '',
                          }: PublicUserInviteEmailProps) => {
  const previewText = `Join ${siteConfig.name}`;
  return (
    <Html>
      <Head/>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="my-10 mx-auto p-5 w-[465px]">

            <Heading className="text-2xl font-normal text-center p-0 my-8 mx-0">
              Evaluate <strong>Audit</strong> on <strong>{siteConfig.name}</strong>
            </Heading>
            <Text className="text-sm">
              Hello {receiverEmail},
            </Text>
            <Text className="text-sm">
              <strong>{inviterEmail}</strong> (
              <Link
                href={`mailto:${inviterEmail}`}
                className="text-blue-600 no-underline"
              >
                {inviterEmail}
              </Link>
              ) has invited you to join <strong>{siteConfig.name}</strong> to evaluate a audit.
            </Text>
            <Section className="text-center my-8">
              <Button
                className="bg-[#00A3FF] rounded text-white text-[12px] font-semibold no-underline text-center"
                href={auditLink}
              >
                Join the team
              </Button>
            </Section>
            <Text className="text-sm">
              or copy and paste this URL into your browser:{' '}
              <Link
                href={auditLink}
                className="text-blue-600 no-underline"
              >
                {auditLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-6 mx-0 w-full"/>
            <Text className="opacity-50 text-xs">
              This invitation was intended for{' '}
              <span className="">{receiverEmail} </span>.This invite was sent from{' '}
              <span className="">{inviteFromIp}</span> located in{' '}
              <span className="">{inviteFromLocation}</span>. If you were not
              expecting this invitation, you can ignore this email. If you are
              concerned about your account's safety, please reply to this email to
              get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PublicUserInvite;