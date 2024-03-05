import { siteConfig } from '@/config/site';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components';
import * as React from 'react';

export const EvaluationEmail = ({
                                  senderEmail = 'user',
                                  receiverEmail = "",
                                  auditName = 'https://gapnavigator.com/audits',
                                  inviteFromIp = '',
                                  inviteFromLocation = '',
                                }: EvaluationEmailProps) => {
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
            <Section className="text-center my-8">

            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};


interface EvaluationEmailProps {
  senderEmail?: string,
  receiverEmail?: string,
  auditName?: string,
  inviteFromIp?: string,
  inviteFromLocation?: string,
}

export default EvaluationEmail;